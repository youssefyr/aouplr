"use server"
import fs from 'fs';
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
  const examsDir = path.join(process.cwd(), 'public/data/exams');
  const folders = fs.readdirSync(examsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const examsData: Exam[] = folders.map(folder => {
    const files = fs.readdirSync(path.join(examsDir, folder))
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    return { folder, files };
  });
  return {
    props: {
      exams: examsData,
    },
  };
}

export async function getJsonExamFileContents(folder: string, fileName: string) {
  const examsDir = path.join(process.cwd(), 'public/data/exams');
  const folderPath = path.join(examsDir, folder);
  const filePath = path.join(folderPath, `${fileName}.json`);

  // Ensure the folder and file are within the expected directory
  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
    throw new Error('Invalid folder');
  }

  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
    throw new Error('Invalid file');
  }

  // Resolve the paths to ensure they are within the examsDir
  const resolvedFolderPath = path.resolve(folderPath);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFolderPath.startsWith(examsDir) || !resolvedFilePath.startsWith(examsDir)) {
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

export const getAllCourses = async (): Promise<{ [key: string]: string[] }> => {
    const dataDir = path.join(process.cwd(), 'public/data/exams');
    const folders = fs.readdirSync(dataDir);
    const allCourses: Set<string> = new Set();
  
    for (const folder of folders) {
      const files = fs.readdirSync(path.join(dataDir, folder));
      for (const file of files) {
        const filePath = path.join(dataDir, folder, file);
        const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    const dataDir = path.join(process.cwd(), 'public/data/exams');
    const folders = fs.readdirSync(dataDir);
    const allExamContentsWithTimes: { [key: string]: string[] } = {};
  
    for (const folder of folders) {
      allExamContentsWithTimes[folder] = [];
      const files = fs.readdirSync(path.join(dataDir, folder));
      for (const file of files) {
        const filePath = path.join(dataDir, folder, file);
        const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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