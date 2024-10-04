"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

export const getGuides = async () => {
  const guidesDir = path.join(process.cwd(), 'public/data/guides');
  const filenames = await fsPromises.readdir(guidesDir);
  const guides = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => ({
      name: filename.replace(/_/g, ' ').replace('.md', ''),
      path: `/data/guides/${filename}`
    }));
  return guides;
};

export const getGuideContent = async (filename: string) => {
    try {
        const filePath = path.join(process.cwd(), 'public/data/guides', filename);
        const content = await fsPromises.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        console.error(`Error reading guide content: ${error}`);
        return "NULLL";
    }
};