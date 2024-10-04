"use server"
import fs from 'fs';
import path from 'path';

interface Plan {
  folder: string;
  files: string[];
}

export async function getPlansData() {
  const plansDir = path.join(process.cwd(), 'public/data/plans');
  const folders = fs.readdirSync(plansDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const plansData: Plan[] = folders.map(folder => {
    const files = fs.readdirSync(path.join(plansDir, folder))
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    return { folder, files };
  });

  return {
    props: {
      plans: plansData,
    },
  };
}

export async function getJsonFileContents(folder: string, fileName: string) {
  const plansDir = path.join(process.cwd(), 'public/data/plans');
  const folderPath = path.join(plansDir, folder);
  const filePath = path.join(folderPath, `${fileName}.json`);

  // Ensure the folder and file are within the expected directory
  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
    throw new Error('Invalid folder');
  }

  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
    throw new Error('Invalid file');
  }

  // Resolve the paths to ensure they are within the plansDir
  const resolvedFolderPath = path.resolve(folderPath);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFolderPath.startsWith(plansDir) || !resolvedFilePath.startsWith(plansDir)) {
    throw new Error('Path traversal detected');
  }

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file ${filePath}: ${err}`);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}