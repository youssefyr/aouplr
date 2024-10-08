"use server"
import { Plan } from './types';
import { promises as fsPromises } from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV == "development"
const plansDir = isDevelopment ? path.join(process.cwd(), "public", "data", "plans") :
 path.join(process.cwd(),"public", "data", "plans");



export async function getPlansData() {
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
  const filePath = isDevelopment ? path.join(process.cwd(), "public", "data", "plans", `${type}-${name}.json`)
                    : path.join(process.cwd(), "public", "data", "plans", `${type}-${name}.json`);

  console.log(`Reading plan file: ${filePath}`);

  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${err instanceof Error ? err.message : err}`);
  }
}