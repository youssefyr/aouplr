import React from 'react';
import Navbar from '../_components/navbar';
import ThemeSelect from '../_components/themeselect';
const About: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">About This Project</h1>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Project Overview</h2>
              <p>
                This project is built by cwawdaw with the aim of helping university students with common academic tasks. It provides tools for GPA calculation, course management, and guides to various resources that students might need.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <h2 className="card-title">Features</h2>
              <p>
                The project includes a variety of features designed to assist students:
              </p>
              <ul className="list-disc list-inside">
                <li>GPA Calculator: Easily calculate your GPA based on your course grades.</li>
                <li>Course Tools: Manage your courses and keep track of your academic progress.</li>
                <li>Guides: Access helpful guides on various topics that are essential for university life.</li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <h2 className="card-title">Contact</h2>
              <p>
              If you have any questions or feedback, feel free to reach out to cwawdaw. Your input is valuable and helps improve the project.
              </p>
            </div>
          </div>
        </div>
      </main>
      <ThemeSelect />
    </div>
  );
};

export default About;