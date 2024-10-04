"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import { getGuides } from '@/lib/guides';

interface Guide {
  name: string;
  path: string;
}

const Guides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const guidesData = await getGuides();
      console.log(guidesData)
      setGuides(guidesData);
    };

    fetchGuides();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Guides</h1>
        <ul className="list-disc pl-5">
          {guides.map(guide => (
            <li key={guide.path}>
              <Link href={`/guides/${guide.name.replace(/ /g, '_')}`} className="text-blue-500 hover:underline">
                {guide.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ThemeSelect />
    </div>
  );
};

export default Guides;