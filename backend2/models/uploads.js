const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // Import the Cloudinary config

// Configure Multer Storage for Cloudinary
const profilepicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics', // Folder where images will be stored in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }] 
  },
});
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts', // Folder where post images will be stored
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image formats
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }] // Adjust image size for posts
  },
});

// Create Multer instance with disk storage and file filter
const profilepicupload = multer({
  storage: profilepicStorage
});

const postupload= multer({
  storage:postStorage
});
module.exports = {profilepicupload,postupload}
