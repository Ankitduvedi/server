const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: 'ap-south-1', // Replace with your desired AWS region
  credentials: fromIni({
    accessKeyId: 'AKIAQFH76463TX4YV5LT',
    secretAccessKey: 'jI2Ps2lzxy2QtyeoH7da1SvFgHTfsKI7R6IdmmAM',
  }),
});

// Configure multer and multer-s3 to handle file uploads to S3
const reels = multer({
  storage: multer.memoryStorage(),
});

const videos = multer({
  storage: multer.memoryStorage(),
});

// Set up a simple endpoint for handling video uploads
app.post('/reels', reels.single('video'), async (req, res) => {
  try {
    const uploadParams = {
      Bucket: 'nodejs1532',
      Key: 'reels/' + Date.now().toString() + '-' + req.file.originalname,
      Body: req.file.buffer,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    
    res.json(`https://nodejs1532.s3.amazonaws.com/${uploadParams.Key}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error });
  }
});

app.post('/videos', videos.single('video'), async (req, res) => {
  try {
    const uploadParams = {
      Bucket: 'nodejs1532',
      Key: 'videos/' + Date.now().toString() + '-' + req.file.originalname,
      Body: req.file.buffer,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    res.json(`https://nodejs1532.s3.amazonaws.com/${uploadParams.Key}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
