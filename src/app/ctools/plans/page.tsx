"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../../_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import { getPlansData, getJsonFileContents } from "../../../lib/getPlansData";

interface Plan {
  folder: string;
  files: string[];
}

interface StudyPlan {
  studyplan_name: string;
  years: Record<string, Year>;
}

interface Year {
  [term: string]: Term;
}

interface Term {
  totalch: number;
  courses: Course[];
}

interface Course {
  code: string | null;
  title: string;
  hours: number;
  prerequisite: string | null;
}

const Page: React.FC = () => {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [planContents, setPlanContents] = useState<StudyPlan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const data = await getPlansData();
      setPlans(data.props.plans);
    }
    fetchPlans();
  }, []);

  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(event.target.value);
    setSelectedFile(null);
    setPlanContents(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFile(event.target.value);
    setPlanContents(null);
  };

  const handleViewPlan = async () => {
    if (selectedFolder && selectedFile) {
      try {
        const contents = await getJsonFileContents(selectedFolder, selectedFile) as StudyPlan;
        setPlanContents(contents);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setSelectedFile(null);
    setPlanContents(null);
  };

  const handleBackToFiles = () => {
    setSelectedFile(null);
    setPlanContents(null);
  };

  if (!plans) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      {!selectedFolder ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Plans - Select a Folder</h2>
          <select className="select select-bordered w-full max-w-xs" onChange={handleFolderChange}>
            <option value="">Select a folder</option>
            {plans.map((plan, index) => (
              <option key={index} value={plan.folder}>{plan.folder}</option>
            ))}
          </select>
        </div>
      ) : !selectedFile ? (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToFolders}>Back</button>
          <h2 className="text-xl font-bold mb-4">Select a Plan</h2>
          <select className="select select-bordered w-full max-w-xs" onChange={handleFileChange}>
            <option value="">Select a plan</option>
            {plans.find(plan => plan.folder === selectedFolder)?.files.map((file, index) => (
              <option key={index} value={file}>{file}</option>
            ))}
          </select>
        </div>
      ) : !planContents ? (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToFiles}>Back</button>
          <h2 className="text-xl font-bold mb-4">View Plan</h2>
          <button className="btn btn-primary" onClick={handleViewPlan}>View Plan</button>
        </div>
      ) : (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToFiles}>Back</button>
          <h2 className="text-xl font-bold mb-4">{planContents.studyplan_name}</h2>
          {Object.entries(planContents.years).map(([year, terms], yearIndex) => (
            <div key={yearIndex} className="mb-4">
              <h3 className="text-lg font-bold">{year}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(terms).map(([term, termDetails], termIndex) => (
                  <div key={termIndex} className="mb-2">
                    <h4 className="text-md font-medium">{term} - Total Credit Hours: {termDetails.totalch}</h4>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Hours</th>
                            <th>Prerequisite</th>
                          </tr>
                        </thead>
                        <tbody>
                          {termDetails.courses.map((course, courseIndex) => (
                            <tr key={courseIndex}>
                              <td>{course.code}</td>
                              <td>{course.title}</td>
                              <td>{course.hours}</td>
                              <td>{course.prerequisite}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <ThemeSelect />
    </div>
  );
};

export default Page;