const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const app = express();
const port = process.env.PORT || 2000;

// Configure AWS SDK
AWS.config.update({
  accessKeyId: 'AKIAQFH76463TX4YV5LT',
  secretAccessKey: 'jI2Ps2lzxy2QtyeoH7da1SvFgHTfsKI7R6IdmmAM',
  region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3();

// Configure multer and multer-s3 to handle file uploads to S3
const reels = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nodejs1532',
    acl: 'public-read', // Set ACL to public-read for public access
    key: function (req, file, cb) {
      cb(null, 'reels/' + Date.now().toString() + '-' + file.originalname);
    },
  }),
});

const videos = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nodejs1532',
    acl: 'public-read', // Set ACL to public-read for public access
    key: function (req, file, cb) {
      cb(null, 'videos/' + Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Set up a simple endpoint for handling video uploads
app.post('/reels', reels.single('video'), (req, res) => {

  // You can send a response to the client or perform additional tasks here
  res.json( req.file.location );
});

app.post('/videos', videos.single('video'), (req, res) => {

  // You can send a response to the client or perform additional tasks here
  res.json( req.file.location );
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
