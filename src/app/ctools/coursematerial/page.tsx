"use client"
import { MaterialData } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import LoadingPage from '@/app/_components/loading';
import { getMaterials } from '@/lib/materials';
import Link from 'next/link';

const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/;

const CourseMaterial: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialData | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsData = await getMaterials();
        setMaterials(materialsData);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedType && materials && materials[selectedType]) {
      setSuggestions(Object.keys(materials[selectedType]));
    }
  }, [selectedType, materials]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedItem(null);
    setInputValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedItem = e.target.value;
    handleItemSelect(selectedItem);
  };

  if (!materials) return (<><LoadingPage /> </>);
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Course Material</h1>
        <div className="mb-4">
          <button className="btn btn-primary mr-2" onClick={() => handleTypeChange('General')}>General Materials</button>
          <button className="btn btn-secondary" onClick={() => handleTypeChange('Main')}>Course Materials</button>
        </div>
        {selectedType && (
          <div className="mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onSelect={handleSelect}
              className="input input-bordered w-full max-w-xs"
              placeholder={`Search ${selectedType} materials`}
              list="suggestions"
            />
            <datalist id="suggestions">
              {suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>
        )}
        {selectedType && selectedItem && materials && materials[selectedType] && materials[selectedType][selectedItem] && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selectedItem}</h2>
            <ul className="list-disc pl-5">
            {Object.keys(materials[selectedType][selectedItem]).map((key) => {
                const value = materials[selectedType][selectedItem][key];
                return (
                <li key={key}>
                    {key}: {urlRegex.test(value) ? (
                    <Link href={value} className="text-blue-500 underline" target='_blank'>
                            {value}
                    </Link>
                    ) : (
                    value
                    )}
                </li>
                );
            })}
            </ul>
          </div>
        )}
        {selectedType && (
          <button className="btn btn-accent mt-4" onClick={() => handleItemSelect(inputValue)}>See Materials</button>
        )}
      </div>
      <ThemeSelect />
    </div>
  );
};

export default CourseMaterial;