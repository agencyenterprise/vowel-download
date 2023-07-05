import fs from 'fs';
import path from 'path';

export function createFolderIfDoesNotExist(folderName: string) {
  const basePath = path.resolve(folderName);

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  return basePath;
}
