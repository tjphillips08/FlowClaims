// upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up storage config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueName}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /upload - single file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    originalName: req.file.originalname,
    storedName: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
