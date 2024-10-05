"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

interface Plan {
  type: string;
  name: string;
}

export async function getPlansData() {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  console.log(`Reading plans directory: ${plansDir}`);
  const files = await fsPromises.readdir(plansDir);
  console.log(`Found plan files: ${files}`);

  const plansData: Plan[] = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const [type, ...nameParts] = file.replace('.json', '').split('-');
      const name = nameParts.join('-');
      return { type, name };
    });

  return {
    props: {
      plans: plansData,
    },
  };
}

export async function getJsonFileContents(type: string, name: string) {
  const plansDir = path.join(process.cwd(), "public", "data", "plans");
  const filePath = path.join(plansDir, `${type}-${name}.json`);

  console.log(`Reading plan file: ${filePath}`);

  try {
    // Ensure the file is within the expected directory
    if (!(await fsPromises.stat(filePath)).isFile()) {
      throw new Error('Invalid file');
    }

    // Resolve the path to ensure it is within the plansDir
    const resolvedFilePath = path.resolve(filePath);

    if (!resolvedFilePath.startsWith(plansDir)) {
      throw new Error('Path traversal detected');
    }

    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}