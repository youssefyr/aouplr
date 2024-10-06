"use server"
import { promises as fsPromises } from 'fs';
import path from 'path';

export const getMaterials = async () => {
  const materialsPath = path.join(process.cwd(), 'public', 'data', 'materials', 'materials2025.json');
  const data = await fsPromises.readFile(materialsPath, 'utf8');
  return JSON.parse(data);
};