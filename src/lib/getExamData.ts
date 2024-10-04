"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

interface Exam {
  folder: string;
  files: string[];
}

interface ExamDetails {
  dayname: string;
  [time: string]: string[] | string; // time slots with course arrays or dayname
}

interface ExamContents {
  [date: string]: ExamDetails;
}

export async function getExamsData() {

  const examsDir = path.join(process.cwd(), "public", "data", "exams");
  const folders = await fsPromises.readdir(examsDir, { withFileTypes: true });
  folders.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const examsData: Exam[] = await Promise.all(folders.map(async dirent => {
    const folder = dirent.name;
    const files = await fsPromises.readdir(path.join(examsDir, folder));
    files.filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    return { folder, files };
  }));
  return {
    props: {
      exams: examsData,
    },
  };
}

export async function getJsonExamFileContents(folder: string, fileName: string) {
  const examsDir = path.join(process.cwd(), "public", "data", "exams");
  const folderPath = path.join(examsDir, folder);
  const filePath = path.join(folderPath, `${fileName}`);

  // Ensure the folder and file are within the expected directory
  if (!(await fsPromises.stat(folderPath)).isDirectory()) {
    throw new Error('Invalid folder');
  }

  if (!(await fsPromises.stat(filePath)).isFile()) {
    throw new Error('Invalid file');
  }

  // Resolve the paths to ensure they are within the examsDir
  const resolvedFolderPath = path.resolve(folderPath);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFolderPath.startsWith(examsDir) || !resolvedFilePath.startsWith(examsDir)) {
    throw new Error('Path traversal detected');
  }

  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err}`);
  }
}

export const getAllCourses = async (): Promise<{ [key: string]: string[] }> => {
  const dataDir = path.join(process.cwd(), "public", "data", "exams");
  const folders = await fsPromises.readdir(dataDir);
    const allCourses: Set<string> = new Set();
  
    for (const folder of folders) {
      const files = await fsPromises.readdir(path.join(dataDir, folder));
      for (const file of files) {
        const filePath = path.join(dataDir, folder, file);
        const fileContents = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
        Object.values(fileContents as ExamContents).forEach(details => {
          Object.values(details).forEach(courses => {
            if (Array.isArray(courses)) {
              courses.forEach(course => allCourses.add(course));
            }
          });
        });
      }
    }
  
    return { uniqueCourses: Array.from(allCourses) };
  };


export const getAllExamContentsWithTimes = async (): Promise<{ [key: string]: string[] }> => {
  const dataDir = path.join(process.cwd(), "public", "data", "exams");
  const folders = await fsPromises.readdir(dataDir);
    const allExamContentsWithTimes: { [key: string]: string[] } = {};
  
    for (const folder of folders) {
      allExamContentsWithTimes[folder] = [];
      const files = await fsPromises.readdir(path.join(dataDir, folder));
      for (const file of files) {
        const filePath = path.join(dataDir, folder, file);
        const fileContents = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
        Object.entries(fileContents as ExamContents).forEach(([date, details]) => {
          Object.entries(details).forEach(([time, courses]) => {
            if (time !== 'dayname' && Array.isArray(courses)) {
              courses.forEach(course => {
                allExamContentsWithTimes[folder].push(`${course} - ${date} at ${time}`);
              });
            }
          });
        });
      }
    }
  
    return allExamContentsWithTimes;
  };