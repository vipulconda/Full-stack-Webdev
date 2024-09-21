const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // Import the Cloudinary config

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics', // Folder where images will be stored in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }] 
  },
});

// Create Multer instance with disk storage and file filter
const upload = multer({
  storage: storage
});

module.exports = upload;
