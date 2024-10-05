"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

interface Plan {
  folder: string;
  files: string[];
}

export async function getPlansData() {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  console.log(`Reading plans directory: ${plansDir}`);
  const folderNames = await fsPromises.readdir(plansDir);
  console.log(`Found plan folders: ${folderNames}`);

  const plansData: (Plan | null)[] = await Promise.all(folderNames.map(async folder => {
    const folderPath = path.join(plansDir, folder);
    const stat = await fsPromises.stat(folderPath);
    if (stat.isDirectory()) {
      const files = await fsPromises.readdir(folderPath);
      const jsonFiles = files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
      console.log(`Found plan files in folder ${folder}: ${jsonFiles}`);
      return { folder, files: jsonFiles };
    } else {
      return null;
    }
  }));
  
  const filteredPlansData: Plan[] = plansData.filter(plan => plan !== null) as Plan[];

  return {
    props: {
      plans: filteredPlansData,
    },
  };
}


export async function getJsonFileContents(folder: string, fileName: string) {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  const folderPath = path.join(plansDir, folder);
  const filePath = path.join(folderPath, `${fileName}.json`);

  console.log(`Reading plan file: ${filePath}`);

  if (!(await fsPromises.stat(folderPath)).isDirectory()) {
    throw new Error('Invalid folder');
  }

  if (!(await fsPromises.stat(filePath)).isFile()) {
    throw new Error('Invalid file');
  }

  const resolvedFolderPath = path.resolve(folderPath);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFolderPath.startsWith(plansDir) || !resolvedFilePath.startsWith(plansDir)) {
    throw new Error('Path traversal detected');
  }

  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}