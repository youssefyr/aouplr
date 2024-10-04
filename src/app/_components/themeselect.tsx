"use client"
import React, { useEffect } from 'react';
import { themeChange } from 'theme-change';

const ThemeSelect: React.FC = () => {
    useEffect(() => {
        themeChange(false);
        }, []);    
  return (
    <footer className="fixed bottom-0 right-0 p-4 md:bg-transparent">
      <select className="select select-bordered w-full md:w-auto" data-choose-theme>
        <option disabled value="">Pick a theme</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="lemonade">Lemonade</option>
        <option value="synthwave">Synthwave</option>
      </select>
    </footer>
  );
};

export default ThemeSelect;