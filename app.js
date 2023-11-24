const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const app = express();
const port = process.env.PORT || 2000;

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
  storage: multerS3({
    s3: s3Client,
    bucket: 'nodejs1532',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'reels/' + Date.now().toString() + '-' + file.originalname);
    },
  }),
});

const videos = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'nodejs1532',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'videos/' + Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Set up a simple endpoint for handling video uploads
app.post('/reels', reels.single('video'), async (req, res) => {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'nodejs1532',
        Key: 'reels/' + Date.now().toString() + '-' + req.file.originalname,
        Body: req.file.buffer,
        ACL: 'public-read',
      },
    });

    const result = await upload.done();
    res.json(result.Location);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/videos', videos.single('video'), async (req, res) => {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'nodejs1532',
        Key: 'videos/' + Date.now().toString() + '-' + req.file.originalname,
        Body: req.file.buffer,
        ACL: 'public-read',
      },
    });

    const result = await upload.done();
    res.json(result.Location);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
