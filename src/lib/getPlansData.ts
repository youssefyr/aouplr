"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

interface Plan {
  folder: string;
  files: string[];
}

export async function getPlansData() {
  const plansDir = path.join(process.cwd(), 'public', 'data/plans');
  const folders = await fsPromises.readdir(plansDir, { withFileTypes: true });
  folders.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const plansData: Plan[] = await Promise.all(folders.map(async dirent => {
    const folder = dirent.name;
    const files = await fsPromises.readdir(path.join(plansDir, folder));
    files.filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    return { folder, files };
  }));

  return {
    props: {
      plans: plansData,
    },
  };
}

export async function getJsonFileContents(folder: string, fileName: string) {
  const plansDir = path.join(process.cwd(), 'public', 'data/plans');
  const folderPath = path.join(plansDir, folder);
  const filePath = path.join(folderPath, `${fileName}`);

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

  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err}`);
  }
}