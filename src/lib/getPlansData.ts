"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

interface Plan {
  folder: string;
  files: string[];
}

async function getDirectories(dirPath: string) {
  const folder = await fsPromises.readdir(dirPath);
  const directories = await Promise.all(folder.map(async file => {
    const folderstat = await fsPromises.stat(path.join(dirPath, file));
    return folderstat.isDirectory() ? file : null;
  }));
  return directories.filter(Boolean) as string[];
}

export async function getPlansData() {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  console.log(`Reading plans directory: ${plansDir}`);
  const folderNames = await getDirectories(plansDir);
  console.log(`Found plan folders: ${folderNames}`);

  const plansData: Plan[] = await Promise.all(folderNames.map(async folder => {
    const folderPath = path.join(plansDir, folder);
    const files = await fsPromises.readdir(folderPath);
    const jsonFiles = files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
    console.log(`Found plan files in folder ${folder}: ${jsonFiles}`);
    return { folder, files: jsonFiles };
  }));

  return {
    props: {
      plans: plansData,
    },
  };

}


export async function getJsonFileContents(folder: string, fileName: string) {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  const folderPath = path.join(plansDir, folder);
  const filePath = path.join(folderPath, `${fileName}.json`);

  console.log(`Reading plan file: ${filePath}`);

  try {
    // Ensure the folder and file are within the expected directory
    if (!(await fsPromises.stat(folderPath)).isDirectory()) {
      throw new Error('Invalid folder');
    }

    if (!(await fsPromises.stat(filePath)).isFile()) {
      throw new Error('Invalid file');
    }

    // Resolve the paths to ensure they are within the plansDir
    const resolvedFolderPath = path.resolve(folderPath);
    const resolvedFilePath = path.resolve(filePath);

    if (!resolvedFolderPath.startsWith(plansDir) || !resolvedFilePath.startsWith(plansDir)) {
      throw new Error('Path traversal detected');
    }

    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}