import dotenv from 'dotenv';

dotenv.config();

export default {
  vowelAuthToken: process.env.VOWEL_AUTH_TOKEN,
  batchSize: 5,
};
