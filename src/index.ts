import { Command } from 'commander';
import path from 'path';

import data, { saveData } from './data';
import config from './config';
import { convertDateToPST } from './helpers/convertDateToPST';
import { createFolderIfDoesNotExist } from './helpers/createFolderIfDoesNotExist';
import { sanitizeFolderName } from './helpers/sanitizeFolderName';
import { downloadMeeting, listMeetings } from './meetings';

async function run() {
  console.log(`Starting download with ${config.batchSize} meetings per batch...`);

  createFolderIfDoesNotExist('./out');
  createFolderIfDoesNotExist('./out/meetings');

  let page = 0;
  let total = 1;

  while (page < total) {
    const { meetings, totalPages } = await listMeetings(page);

    if (page === 0) {
      total = totalPages;
    }

    console.group(`Init batch ${page + 1} of ${total}`);

    const promises = meetings.map(async (meeting) => {
      if (data.downloadedMeetings[meeting.id]) {
        console.log(`Skipping meeting ${meeting.id} because it was already downloaded`);
        return;
      }

      const basePath = path.resolve('out', 'meetings', sanitizeFolderName(meeting.name));
      createFolderIfDoesNotExist(basePath);

      const meetingFolderPath = path.resolve(basePath, sanitizeFolderName(convertDateToPST(meeting.startTime)));
      createFolderIfDoesNotExist(meetingFolderPath);

      await downloadMeeting(meeting.id, meetingFolderPath);

      data.downloadedMeetings[meeting.id] = true;
      saveData();

      console.log(`Downloaded meeting: ${meetingFolderPath}`);
    });

    await Promise.all(promises);
    console.groupEnd();

    page += 1;
  }
}

const cli = new Command();

cli
  .version('1.0.0')
  .option('-a, --auth <value>', "Vowel's VSC1 cookie value for authentication")
  .option('-b, --batch <value>', 'Batch size (default is 5)')
  .action((options) => {
    if (options.auth) {
      config.vowelAuthToken = options.auth;
    }

    if (options.batch) {
      config.batchSize = parseInt(options.batch, 10);
    }

    run();
  });

cli.parse(process.argv);
