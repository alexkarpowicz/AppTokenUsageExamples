require('dotenv').config();
const express = require('express');
const { addDocument } = require('./src/api');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/upload/:applicantId', async (req, res) => {
  const { applicantId } = req.params;
  const appToken = req.headers['x-app-token'] || process.env.SUMSUB_APP_TOKEN;
  const secretKey = req.headers['x-secret-key'] || process.env.SUMSUB_SECRET_KEY;

  if (!appToken || !secretKey) {
    return res.status(400).send({ 
      error: 'Authentication credentials are required. Please provide them in the request headers (X-App-Token, X-Secret-Key) or in the .env file.' 
    });
  }

  const docTypes = ['front', 'back', 'selfie'];
  const uploadResults = [];

  try {
    for (const docType of docTypes) {
      const documentFilePath = `resources/${docType}.png`;
      let metadata;

      if (docType === 'selfie') {
        metadata = {
          idDocType: 'SELFIE',
          country: 'USA'
        };
      } else {
        metadata = {
          idDocType: 'ID_CARD',
          idDocSubType: docType === 'front' ? 'FRONT_SIDE' : 'BACK_SIDE',
          country: 'USA',
          number: '123456789',
          issuedDate: '2026-01-02',
          dob: '2000-02-01',
          placeOfBirth: 'NY',
        };
      }

      console.log(`Adding ${docType} of document to applicant: ${applicantId}`);
      const response = await addDocument(applicantId, metadata, documentFilePath, appToken, secretKey);
      uploadResults.push({ type: docType, status: 'success', data: response.data });
    }
    res.status(200).send(uploadResults);
  } catch (error) {
    console.error("Error:\n", error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'An error occurred during the upload process.', details: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
