import axios from 'axios';
import fs from 'fs';

import config from './config';

const vowelApi = axios.create({
  baseURL: 'https://workspace-gboe8y2.vowel.com/api/',
  headers: {
    Cookie: `VSC1=${config.vowelAuthToken};`,
  },
});

async function downloadTilesImage(url: string, path: string) {
  const response = await axios.get(url, {
    responseType: 'text',
    responseEncoding: 'base64',
  });

  fs.writeFileSync(`${path}/tiles.webp`, response.data, { encoding: 'base64' });
}

async function downloadVideo(url: string, path: string) {
  const response = await vowelApi({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(`${path}/video.mp4`));

  return new Promise<void>((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadActionItemSuggestions(meetingId: string, path: string) {
  const { data } = await vowelApi.get(`/meetings/${meetingId}/suggestions`);

  fs.writeFileSync(`${path}/actionItemSuggestions.json`, JSON.stringify(data, null, 2));
}

async function downloadTalkTimes(meetingId: string, path: string) {
  const { data } = await vowelApi.get(`/meetings/${meetingId}/talkTimes`);

  fs.writeFileSync(`${path}/talkTimes.json`, JSON.stringify(data, null, 2));
}

async function downloadTranscript(meetingId: string, path: string) {
  const { data } = await vowelApi.get(`/meetings/${meetingId}/transcriptions?size=100000`);

  fs.writeFileSync(`${path}/transcript.json`, JSON.stringify(data, null, 2));
}

export async function downloadMeeting(id: string, path: string) {
  const { data } = await vowelApi.get(`/meetings/${id}`);

  fs.writeFileSync(`${path}/meetingData.json`, JSON.stringify(data, null, 2));

  const promises = [
    downloadVideo(`/meetings/${id}/download`, path),
    downloadTranscript(id, path),
    downloadTalkTimes(id, path),
    downloadActionItemSuggestions(id, path),
  ];

  const tilesUrl = data.primaryPictures.find((picture) => picture.type === 'TILES')?.url;
  if (tilesUrl) {
    promises.push(downloadTilesImage(tilesUrl, path));
  }

  await Promise.all(promises);

  return data;
}

export async function listMeetings(page: number) {
  const response = await vowelApi.get(`/meetings?page=${page || 0}&size=${config.batchSize}`);

  const {
    _embedded: { media: meetings },
    page: { totalPages, number: currentPage },
  } = response.data;

  return { meetings, totalPages, currentPage };
}
