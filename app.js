const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: 'ap-south-1', // Replace with your desired AWS region
  credentials: fromIni(), // Automatically uses IAM role or credentials in environment variables
});

// Configure multer to handle file uploads
const upload = multer();

// Set up a simple endpoint for handling file uploads to S3
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Get file data from the request
    const file = req.file;
    
    // Specify S3 upload parameters
    const uploadParams = {
      Bucket: 'your-s3-bucket-name', // Replace with your S3 bucket name
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Provide a public URL for the uploaded file
    const publicUrl = `https://your-s3-bucket-name.s3.amazonaws.com/${uploadParams.Key}`;
    
    // Respond with the public URL
    res.json({ message: 'File uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
