import fs from 'fs';

import { createFolderIfDoesNotExist } from '../helpers/createFolderIfDoesNotExist';

let data = {
  downloadedMeetings: {},
};

try {
  data = require('../../out/data.json');
} catch {
  // data json doesn't exist yet
  createFolderIfDoesNotExist('./out');
  saveData();
}

export function saveData() {
  fs.writeFileSync('./out/data.json', JSON.stringify(data, null, 2));
}

export default data;
