"use server"
import fs from 'fs';
import path from 'path';

interface Guide {
    name: string;
    path: string;
  }

export const getGuides = () => {
  const guidesDir = path.join(process.cwd(), 'public/data/guides');
  const filenames = fs.readdirSync(guidesDir);
  const guides = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => ({
      name: filename.replace(/_/g, ' ').replace('.md', ''),
      path: `/data/guides/${filename}`
    }));
  return guides;
};

export const getGuideContent = (filename: string) => {
  const filePath = path.join(process.cwd(), 'public/data/guides', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
};