"use server"
import { ExamContents } from './types';
import { promises as fsPromises } from 'fs';
import path from 'path';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

async function getFiles(dirPath: string) {
  const files = await fsPromises.readdir(dirPath);
  return files.filter(file => file.endsWith('.json'));
}

const isDevelopment = process.env.NODE_ENV == "development";


export async function getExamsData() {
  const examsDir = isDevelopment ? path.join(process.cwd(), "public", "data", "exams")
                   : path.join(process.cwd(), "public", "data", "exams");
  console.log(`Reading exams directory: ${examsDir}`);
  const files = await getFiles(examsDir);
  console.log(`Found exam files: ${files}`);

  const examsData = files.map(file => {
    const [type, name] = file.replace('.json', '').split('-');
    return { type, name, file };
  });

  return {
    props: {
      exams: examsData,
    },
  };
}

export async function getJsonExamFileContents(fileName: string) {
  const examsDir = isDevelopment ? path.join(process.cwd(), "public", "data", "exams")
                   : path.join(process.cwd(), "public", "data", "exams");
  const filePath = path.join(examsDir, fileName);

  console.log(`Reading exam file: ${filePath}`);

  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}

export const getAllCourses = async (): Promise<{ uniqueCourses: string[] }> => {
  const dataDir = isDevelopment ? path.join(process.cwd(), "public", "data", "exams")
                   : path.join(process.cwd(), "public", "data", "exams");
  const allCourses: Set<string> = new Set();

  try {
    const files = await getFiles(dataDir);

    for (const file of files) {
      const filePath = isDevelopment ? path.join(process.cwd(), "public", "data", "exams", file)
      : path.join(process.cwd(), "public", "data", "exams", file);
      const fileContents = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
      Object.values(fileContents as ExamContents).forEach(details => {
        Object.values(details).forEach(courses => {
          if (Array.isArray(courses)) {
            courses.forEach(course => allCourses.add(course));
          }
        });
      });
    }
  } catch (error) {
    console.error(`Error reading courses: ${error instanceof Error ? error.message : error}`);
  }

  return { uniqueCourses: Array.from(allCourses) };
}

export const getAllExamContentsWithTimes = async (): Promise<{ [key: string]: string[] }> => {
  const allExamContentsWithTimes: { [key: string]: string[] } = {};
  const examsDir = isDevelopment ? path.join(process.cwd(), "public", "data", "exams")
                   : path.join(process.cwd(), "public", "data", "exams");

  try {
    const files = await getFiles(examsDir);

    for (const file of files) {
      const filePath = path.join(examsDir, file);
      const fileContents = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
      Object.entries(fileContents as ExamContents).forEach(([date, details]) => {
        Object.entries(details).forEach(([time, courses]) => {
          if (time !== 'dayname' && Array.isArray(courses)) {
            courses.forEach(course => {
              if (!allExamContentsWithTimes[course]) {
                allExamContentsWithTimes[course] = [];
              }
              const courseType = capitalizeFirstLetter(file.split("-")[0]);
              allExamContentsWithTimes[course].push(`${courseType} - ${date} at ${time}`);
            });
          }
        });
      });
    }
  } catch (error) {
    console.error(`Error reading exam contents with times: ${error instanceof Error ? error.message : error}`);
  }

  return allExamContentsWithTimes;
};