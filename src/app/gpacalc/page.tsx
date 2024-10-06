'use client'
import { GpaCourse } from '@/lib/types';
import React, { useState } from 'react';
import Navbar from '../_components/navbar';
import ThemeSelect from '../_components/themeselect';



const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<GpaCourse[]>([]);
  const [name, setName] = useState<string>("");
  const [creditHours, setCreditHours] = useState<number | "">("");
  const [score, setScore] = useState<number | "">("");
  const [exportedData, setExportedData] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const addCourse = () => {
    if (name !== "" && creditHours !== "" && score !== "" && score <= 100) {
      setCourses([...courses, { name, creditHours: Number(creditHours), score: Number(score) }]);
      setName("");
      setCreditHours("");
      setScore("");
    }
  };

  const convertScoreToPoints = (score: number) => {
    if (score >= 90) return 4.00;
    if (score >= 82) return 3.50;
    if (score >= 74) return 3.00;
    if (score >= 66) return 2.50;
    if (score >= 58) return 2.00;
    if (score >= 50) return 1.50;
    return 0;
  };

  const calculateGpa = () => {
    if (courses.length === 0) return "0";
    const totalCredits = courses.reduce((acc, course) => acc + course.creditHours, 0);
    const totalPoints = courses.reduce((acc, course) => acc + course.creditHours * convertScoreToPoints(course.score), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };
  
  const classifyGpa = (gpa: number) => {
    if (gpa >= 3.67) return "Excellent";
    if (gpa >= 3.00) return "Very Good";
    if (gpa >= 2.33) return "Good";
    if (gpa >= 2.00) return "Fair";
    return "Fail";
  };
  
  const getGradeLetter = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 82) return "B+";
    if (score >= 74) return "B";
    if (score >= 66) return "C+";
    if (score >= 58) return "C";
    if (score >= 50) return "D";
    return "Fail";
  };

  const exportData = () => {
    if (courses.length > 1) {
    const jsonData = JSON.stringify(courses);
    const encodedData = btoa(jsonData);
    setExportedData(encodedData);
    } else alert("No data to export.")
  };

  const copyToClipboard = () => {
    if (exportedData) {
      navigator.clipboard.writeText(exportedData).then(() => {
        setShowAlert(true);
        setTimeout(() => {setShowAlert(false); setExportedData("")}, 3000);
      });
    }
  };

  const importData = () => {
    const encodedData = prompt('Please enter the encoded data:');
    if (encodedData) {
      try {
        const jsonData = atob(encodedData);
        const importedCourses: GpaCourse[] = JSON.parse(jsonData);
        const newCourses = importedCourses.filter(
          (importedCourse) => !courses.some((course) => course.name === importedCourse.name)
        );
        setCourses((prevCourses) => [...prevCourses, ...newCourses]);
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Invalid data. Please try again.');
      }
    }
  };

  const ClearData = () => {
      setCourses([]);
  }

  const gpa = parseFloat(calculateGpa());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GPA Calculator</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full max-w-xs"
          placeholder="Course Name"
        />
        <input
          type="number"
          value={creditHours}
          onChange={(e) => { 
            setCreditHours(e.target.value === "" ? "" : Number(e.target.value))}}
          className="input input-bordered w-full max-w-xs"
          placeholder="Credit Hours"
        />
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value === "" ? "" : Math.min(Number(e.target.value), 100))}
          className="input input-bordered w-full max-w-xs"
          placeholder="Score"
        />
        <button onClick={addCourse} className="btn btn-primary w-full max-w-xs">Add Course</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-md">
          <thead>
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Credit Hours</th>
              <th>Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className={index % 2 === 0 ? "" : "hover"}>
                <th>{index + 1}</th>
                <td>{course.name}</td>
                <td>{course.creditHours}</td>
                <td>{course.score}</td>
                <td>{getGradeLetter(course.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl">GPA: {gpa.toFixed(2)}</h2>
        <h2 className="text-xl">Classification: {courses.length === 0 ? "Add a course" : classifyGpa(gpa)}</h2>
      </div>
      <div className="mb-4">
        <button className="btn btn-primary mr-2" onClick={exportData}>Export Data</button>
        <button className="btn btn-secondary mr-2" onClick={importData}>Import Data</button>
        <button className="btn btn-secondary" onClick={ClearData}>Clear Data</button>
        {exportedData && (
          <div className="mt-2">
            <button className="btn btn-accent" onClick={copyToClipboard}>Copy</button>
          </div>
        )}
      </div>
      {showAlert && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data copied to clipboard!</span>
        </div>
      )}
      <div className="divider divider-info">Info</div>
      <div className="flex flex-wrap justify-start gap-4 mt-4">
      <div className="overflow-x-auto flex-auto">
        <table className="table-sm">
          <thead>
            <tr>
              <th>Score Range</th>
              <th>Letter Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>100 – 90</td><td>A</td></tr>
            <tr><td>89 – 82</td><td>B+</td></tr>
            <tr><td>81 – 74</td><td>B</td></tr>
            <tr><td>73 – 66</td><td>C+</td></tr>
            <tr><td>65 – 58</td><td>C</td></tr>
            <tr><td>57 – 50</td><td>D</td></tr>
            <tr><td>Below 50</td><td>Fail</td></tr>
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto flex-auto">
        <table className="table-sm">
          <thead>
            <tr>
              <th>GPA Range</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>4.00 – 3.67</td><td>Excellent</td></tr>
            <tr><td>3.66 – 3.00</td><td>Very Good</td></tr>
            <tr><td>2.99 – 2.33</td><td>Good</td></tr>
            <tr><td>2.32 – 2.00</td><td>Fair</td></tr>
            <tr><td>Below 2.00</td><td>Fail</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

const HomePage: React.FC = () => {

  return (
    <div>
      <Navbar />
      <main className="p-4">
        <GpaCalculator />
      </main>
      <ThemeSelect />
    </div>
  );
};

export default HomePage;