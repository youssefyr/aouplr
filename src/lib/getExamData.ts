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

async function getDirectories(dirPath: string) {
  const folder = await fsPromises.readdir(dirPath);
  const directories = await Promise.all(folder.map(async file => {
    const folderstat = await fsPromises.stat(path.join(dirPath, file));
    return folderstat.isDirectory() ? file : null;
  }));
  return directories.filter(Boolean) as string[];
}


export async function getExamsData() {
  const examsDir = path.join(process.cwd(), "public", "data", "exams");
  console.log(`Reading exams directory: ${examsDir}`);
  const folderNames = await getDirectories(examsDir);
  console.log(`Found exam folders: ${folderNames}`);

  const examsData: Exam[] = await Promise.all(folderNames.map(async folder => {
    const folderPath = path.join(examsDir, folder);
    const files = await fsPromises.readdir(folderPath);
    const jsonFiles = files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
    console.log(`Found exam files in folder ${folder}: ${jsonFiles}`);
    return { folder, files: jsonFiles };
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
  const filePath = path.join(folderPath, `${fileName}.json`); 

  console.log(`Reading exam file: ${filePath}`);

  try {
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

    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}

export const getAllCourses = async (): Promise<{ uniqueCourses: string[] }> => {
  const dataDir = path.join(process.cwd(), "public", "data", "exams");
  const allCourses: Set<string> = new Set();

  try {
    const folders = await getDirectories(dataDir);

    for (const folder of folders) {
      const folderPath = path.join(dataDir, folder);
      const files = await fsPromises.readdir(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
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
  } catch (error) {
    console.error(`Error reading courses: ${error instanceof Error ? error.message : error}`);
  }

  return { uniqueCourses: Array.from(allCourses) };
}

export const getAllExamContentsWithTimes = async (): Promise<{ [key: string]: string[] }> => {
  const dataDir = path.join(process.cwd(), "public", "data", "exams");
  const allExamContentsWithTimes: { [key: string]: string[] } = {};

  try {
    const folders = await getDirectories(dataDir);

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
  } catch (error) {
    console.error(`Error reading exam contents with times: ${error instanceof Error ? error.message : error}`);
  }

  return allExamContentsWithTimes;
};