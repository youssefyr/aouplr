import React from 'react';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import Link from 'next/link';

const CourseTools: React.FC = () => {

    const tools = [
        { href: '/ctools/exams#fulltimetable', title: 'Exam Dates', description: 'Check the dates for your upcoming exams.', WIP: false },
        { href: '/ctools/exams#mycourses', title: 'Exam Date Conflict', description: 'Report and resolve exam date conflicts.', WIP: false },
        { href: '/ctools/plans', title: 'Plans', description: 'View official study plans or Create and manage your study plans.', WIP: true },
        { href: '/ctools/coursematerial', title: 'Course Materials', description: 'View Materials to help you study for the Courses you want', WIP: true },
    ];

    return (
        <div>
            <Navbar />
            <main className="p-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Course Tools</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    <Link href={tool.href} className="text-blue-500 hover:underline">
                                        {tool.title}
                                    </Link>
                                    {tool.WIP && (
                                    <div className="badge badge-info gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-4 w-4 stroke-current">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        WIP
                                    </div>
                                )}
                                </h2>
                                <p>{tool.description}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </main>
            <ThemeSelect />
        </div>
    );
};

export default CourseTools;