"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import { getExamsData, getJsonExamFileContents, getAllCourses, getAllExamContentsWithTimes } from "@/lib/getExamData";

interface Exam {
  folder: string;
  files: string[];
}

interface ExamDetails {
  dayname: string;
  [time: string]: string[] | string; // time slots with course arrays or dayname
}

interface ExamContents {
  [date: string]: ExamDetails;
}

interface Course {
    course: string;
    times: string[];
    conflict: boolean;
}

interface ExamContentsWithTimes {
    [key: string]: string[];
}

const ExamPage: React.FC = () => {
    const [exams, setExams] = useState<Exam[] | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [examContents, setExamContents] = useState<ExamContents | null>(null);
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState<string>('fulltimetable');
    const [allCourses, setAllCourses] = useState<{ [key: string]: string[] }>({});
    const [courseSuggestions, setCourseSuggestions] = useState<string[]>([]);
    const [allExamContentsWithTimes, setAllExamContentsWithTimes] = useState<ExamContentsWithTimes>({});
    const [savedConflicts, setSavedConflicts] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
      async function fetchExams() {
        const data = await getExamsData();
        setExams(data.props.exams);
      }
      fetchExams();
    }, []);
  
    useEffect(() => {
      async function fetchAllCourses() {
        const courses = await getAllCourses();
        setAllCourses(courses);
      }
      fetchAllCourses();
    }, []);

    useEffect(() => {
        async function fetchAllExamContentsWithTimes() {
          const contentsWithTimes = await getAllExamContentsWithTimes();
          setAllExamContentsWithTimes(contentsWithTimes);
        }
        fetchAllExamContentsWithTimes();
      }, []);
  
    useEffect(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      }
    }, []);

    const handleFolderChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const folder = event.target.value;
        setSelectedFolder(folder);
        setSelectedFile(null);
        setExamContents(null);
      
        if (folder) {
          const exam = exams?.find(exam => exam.folder === folder);
          if (exam && exam.files.length === 1) {
            const file = exam.files[0];
            setSelectedFile(file);
            const contents = await getJsonExamFileContents(folder, file);
            setExamContents(contents as ExamContents);
          }
        }
      };

  const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFile(event.target.value);
    setExamContents(null);
  };

  const handleViewExam = async () => {
    if (selectedFolder && selectedFile) {
      try {
        const contents = await getJsonExamFileContents(selectedFolder, selectedFile);
        setExamContents(contents as ExamContents);
      } catch (error) {
        console.error('Error fetching exam contents:', error instanceof Error ? error.message : String(error));
      }
    }
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setSelectedFile(null);
    setExamContents(null);
  };

  const handleBackToFiles = () => {
    if (selectedFolder && exams?.find(exam => exam.folder === selectedFolder)?.files.length === 1) {
      setSelectedFolder(null);
      setSelectedFile(null);
      setExamContents(null);
    } else {
      setSelectedFile(null);
      setExamContents(null);
    }
  };

  const checkForConflicts = (course: string, CCourses: Course[], allExamContentsWithTimes: ExamContentsWithTimes) => {
    return CCourses.filter(CCCourse => {
      return CCCourse.times.some(time => {
        return Object.values(allExamContentsWithTimes).some(details => {
          return details.some(detail => {
            const [courseName, dateandaddon, timeR] = detail.split(' - ');
            const [date, addtotimeRange] = dateandaddon.split(" at ")
            const timeRange = addtotimeRange + " - " + timeR
            if (!timeRange) return false;
            
            const [startTime, endTime] = timeRange.split(" - ")

            const splitmydate =  time.split(' at ')
            const [myStartTime, myEndTime] = splitmydate[1]?.split(' - ') || [];
            const mydate = splitmydate[0]?.split(' - ')[1]  || []
            return courseName === course && (
              (startTime == myStartTime && endTime == myEndTime && date == mydate)   
            );
          });
        });
      });
    });
  };


const handleAddCourse = (course: string) => {
  if (!myCourses.some(c => c.course === course)) {
    const conflictingCourses = checkForConflicts(course, myCourses, allExamContentsWithTimes);

    if (conflictingCourses.length > 0) {
      const conflictMessage = `Adding this course (${course}) will result in a conflict with ${conflictingCourses.map(c => c.course).join(', ')}. Are you sure you want to continue?`;
      if (!confirm(conflictMessage)) {
        return;
      }
    }

    const courseTimes = Object.entries(allExamContentsWithTimes).flatMap(([folder, details]) => {
      return details.filter(detail => {
        const [courseName] = detail.split(' - ');
        return courseName === course;
      }).map(detail => `${folder} - ${detail.replace(`${course} - `, '')}`);
    });

    // Update savedConflicts
    const newConflicts = { ...savedConflicts };
    conflictingCourses.forEach(conflictingCourse => {
      if (!newConflicts[conflictingCourse.course]) {
        newConflicts[conflictingCourse.course] = [];
      }
      newConflicts[conflictingCourse.course].push(course);
    });
    newConflicts[course] = conflictingCourses.map(c => c.course);

    setSavedConflicts(newConflicts);
    setMyCourses([...myCourses, { course, times: courseTimes, conflict: conflictingCourses.length > 0 }]);
  }
};
  
  
const handleRemoveCourse = (course: string) => {
    const updatedCourses = myCourses.filter(c => c.course !== course);
  
    // Update savedConflicts
    const newConflicts = { ...savedConflicts };
    delete newConflicts[course];
    Object.keys(newConflicts).forEach(key => {
      newConflicts[key] = newConflicts[key].filter(conflictCourse => conflictCourse !== course);
    });
  
    // Re-check for conflicts among all remaining courses
    const updatedCoursesWithConflicts = updatedCourses.map(c => {
      const conflictingCourses = newConflicts[c.course] || [];
  
      // Ensure the course is not marked as non-conflicting if it still has other conflicts
      const stillConflicting = conflictingCourses.some(conflictCourse => 
        updatedCourses.some(uc => uc.course === conflictCourse && uc.conflict)
      );
  
      return { ...c, conflict: conflictingCourses.length > 0 && stillConflicting };
    });
  
    // Update conflicts between remaining courses
    updatedCoursesWithConflicts.forEach(course => {
      const conflictingCourses = newConflicts[course.course] || [];
      conflictingCourses.forEach(conflictCourse => {
        const conflictCourseObj = updatedCoursesWithConflicts.find(c => c.course === conflictCourse);
        if (conflictCourseObj) {
          conflictCourseObj.conflict = true;
        }
      });
    });
    //////////WIP
  
    // Ensure no course is marked as conflicting if it has no actual conflicts
    const finalCoursesWithConflicts = updatedCoursesWithConflicts.map(c => {
      const conflictingCourses = newConflicts[c.course] || [];
      const hasActualConflicts = conflictingCourses.some(conflictCourse => 
        updatedCoursesWithConflicts.some(uc => uc.course === conflictCourse && uc.conflict)
      );
      return { ...c, conflict: conflictingCourses.length > 0 && hasActualConflicts };
    });
  
    // Ensure that if a course is removed and it was causing conflicts between other courses, those courses are updated to reflect their new conflict status
    finalCoursesWithConflicts.forEach(course => {
      const conflictingCourses = newConflicts[course.course] || [];
      conflictingCourses.forEach(conflictCourse => {
        const conflictCourseObj = finalCoursesWithConflicts.find(c => c.course === conflictCourse);
        if (conflictCourseObj) {
          conflictCourseObj.conflict = conflictingCourses.length > 0;
        }
      });
    });
  
    setSavedConflicts(newConflicts);
    setMyCourses(finalCoursesWithConflicts);
  };
  
  
  const handleCourseInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const suggestions = Object.values(allCourses).flat().filter(course => course.toLowerCase().includes(input.toLowerCase()));
    setCourseSuggestions(suggestions);
  };
  
  
  
  if (!exams) return ( <div>
  <span className="loading loading-infinity loading-lg"></span> <div>Loading...</div></div>
);

  const times = Array.from(new Set(Object.values(examContents || {}).flatMap(details => Object.keys(details).filter(key => key !== 'dayname'))));

return (
    <div className="container mx-auto p-4">
        <Navbar />
        <div className="tabs tabs-boxed mb-4">
            <a className={`tab ${activeTab === 'fulltimetable' ? 'tab-active' : ''}`} href="#fulltimetable" onClick={() => setActiveTab('fulltimetable')}>Full Timetable</a>
            <a className={`tab ${activeTab === 'mycourses' ? 'tab-active' : ''}`} href="#mycourses" onClick={() => setActiveTab('mycourses')}>My Courses</a>
        </div>
        {activeTab === 'fulltimetable' && (
            <>
                {!selectedFolder ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Search Exams - Select a Folder</h2>
                        <select className="select select-bordered w-full max-w-xs" onChange={handleFolderChange}>
                            <option value="">Select a folder</option>
                            {exams.map((exam, index) => (
                                <option key={index} value={exam.folder}>{exam.folder}</option>
                            ))}
                        </select>
                    </div>
                ) : !selectedFile ? (
                    <div>
                        <button className="btn btn-secondary mb-4" onClick={handleBackToFolders}>Back</button>
                        <h2 className="text-xl font-bold mb-4">Select an Exam</h2>
                        {exams.find(exam => exam.folder === selectedFolder)?.files.length === 1 ? (
                            <></>
                        ) : (
                            <select className="select select-bordered w-full max-w-xs" onChange={handleFileChange}>
                                <option value="">Select a Timetable</option>
                                {exams.find(exam => exam.folder === selectedFolder)?.files.map((file, index) => (
                                    <option key={index} value={file}>{file}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ) : !examContents ? (
                    <div>
                        <button className="btn btn-secondary mb-4" onClick={handleBackToFiles}>Back</button>
                        <h2 className="text-xl font-bold mb-4">View Timetable</h2>
                        <button className="btn btn-primary" onClick={handleViewExam}>View Timetable</button>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-secondary mb-4" onClick={handleBackToFiles}>Back</button>
                        <h3 className='text-xl font-semibold mb-4 text-center'> You can search through the list or use the MyCourses function to find the dates*</h3>
                        <h2 className="text-xl font-bold mb-4">Exam Timetable</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th className="p-4">Time</th>
                                        {Object.entries(examContents).map(([date, details], index) => (
                                            <th key={index} className="p-4">{date} - {details.dayname}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {times.map((time, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-4">{time}</td>
                                            {Object.entries(examContents).map(([, details], index) => (
                                                <td key={index} className="p-4">
                                                    {(details[time] as string[]).map((course, courseIdx) => (
                                                        <div key={courseIdx} className="mb-2">{course}</div>
                                                    ))}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </>
        )}
        {activeTab === 'mycourses' && (
            <div>
                <h2 className="text-xl font-bold mb-4">My Courses</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        id="courseInput"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Add a course"
                        onChange={handleCourseInput}
                        list="courseSuggestions"
                    />
                    <datalist id="courseSuggestions">
                        {courseSuggestions.map((course, index) => (
                            <option key={index} value={course} />
                        ))}
                    </datalist>
                    <button className="btn btn-primary ml-2" onClick={() => {
                        const courseInput = document.getElementById('courseInput') as HTMLInputElement;
                        if (courseInput.value) {
                            handleAddCourse(courseInput.value);
                            courseInput.value = '';
                        }
                    }}>Add</button>
                </div>
                <div className="mb-4">
                    {myCourses.map((courseObj, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center mb-2">
                                <span className={`mr-2 font-bold ${courseObj.conflict ? 'text-red-500' : ''}`}>{courseObj.course}</span>
                                <button className="btn btn-error btn-xs" onClick={() => handleRemoveCourse(courseObj.course)}>Remove</button>
                            </div>
                            {courseObj.conflict ? (
                                <div className="ml-4 text-red-500">
                                    Conflict detected with another course in your timetable. ~ {courseObj.times.join(', ')}
                                </div>
                            ) : (
                                <div className="ml-4">
                                    {courseObj.times.map((time, idx) => (
                                        <div key={idx} className="text-sm">
                                            {time}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
        <ThemeSelect />
    </div>
);
};

export default ExamPage;