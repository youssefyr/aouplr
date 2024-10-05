"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

export const getGuides = async () => {
  const guidesDir = path.join(process.cwd(), "public", "data", "guides");
  console.log(`Reading guides directory: ${guidesDir}`);
  const filenames = await fsPromises.readdir(guidesDir);
  console.log(`Found guide files: ${filenames}`);
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
    const filePath = path.join(process.cwd(), "public", "data", "guides", filename);
    console.log(`Reading guide file: ${filePath}`);
    const content = await fsPromises.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading guide content: ${error instanceof Error ? error.message : error}`);
    return "NULLL";
  }
};