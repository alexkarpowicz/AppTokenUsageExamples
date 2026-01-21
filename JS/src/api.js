const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const FormData = require('form-data');

const SUMSUB_BASE_URL = 'https://api.sumsub.com';

const api = axios.create({
  baseURL: SUMSUB_BASE_URL,
});

api.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

function createSignature(config) {
  console.log('Creating a signature for the request...');

  const secretKey = config.secretKey || process.env.SUMSUB_SECRET_KEY;
  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', secretKey);
  signature.update(ts + config.method.toUpperCase() + config.url.replace(SUMSUB_BASE_URL, ''));

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}

function addDocument(applicantId, metadata, documentFilePath, appToken, secretKey) {
  console.log("Adding document to the applicant...");
  const method = 'post';
  const url = `/resources/applicants/${applicantId}/info/idDoc`;
  const form = new FormData();
  form.append('metadata', JSON.stringify(metadata));
  const content = fs.readFileSync(documentFilePath);
  form.append('content', content, documentFilePath);

  const headers = {
    'Accept': 'application/json',
    'X-App-Token': appToken || process.env.SUMSUB_APP_TOKEN,
    ...form.getHeaders(),
  };

  return api({ method, url, headers, data: form, secretKey });
}

module.exports = {
  addDocument,
};
