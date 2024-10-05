"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import { getPlansData, getJsonFileContents } from "@/lib/getPlansData";

interface Plan {
  type: string;
  name: string;
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

const cleanType = (type: string): string => {
  return type
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
};

const Page: React.FC = () => {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [planContents, setPlanContents] = useState<StudyPlan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const data = await getPlansData();
      setPlans(data.props.plans);
    }
    fetchPlans();
  }, []);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setSelectedName(null);
    setPlanContents(null);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedName(event.target.value);
    setPlanContents(null);
  };

  const handleViewPlan = async () => {
    if (selectedType && selectedName) {
      try {
        const contents = await getJsonFileContents(selectedType, selectedName) as StudyPlan;
        setPlanContents(contents);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBackToTypes = () => {
    setSelectedType(null);
    setSelectedName(null);
    setPlanContents(null);
  };

  const handleBackToNames = () => {
    setSelectedName(null);
    setPlanContents(null);
  };

  if (!plans) return <div>Loading...</div>;

  const types = Array.from(new Set(plans.map(plan => plan.type)));

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      {!selectedType ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Plans - Select a Program</h2>
          <select className="select select-bordered w-full max-w-xs" onChange={handleTypeChange}>
            <option value="">Select a Program</option>
            {types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      ) : !selectedName ? (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToTypes}>Back</button>
          <h2 className="text-xl font-bold mb-4">Select a Study Plan - Inside {cleanType(selectedType)}</h2>
          <select className="select select-bordered w-full max-w-xs" onChange={handleNameChange}>
            <option value="">Select a plan</option>
            {plans.filter(plan => plan.type === selectedType).map((plan, index) => (
              <option key={index} value={plan.name}>{plan.name}</option>
            ))}
          </select>
        </div>
      ) : !planContents ? (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToNames}>Back</button>
          <h2 className="text-xl font-bold mb-4">View Plan of [{cleanType(selectedName)}]</h2>
          <button className="btn btn-primary" onClick={handleViewPlan}>View Plan</button>
        </div>
      ) : (
        <div>
          <button className="btn btn-secondary mb-4" onClick={handleBackToNames}>Back</button>
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