const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the path to the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');

// Create the uploads directory if it does not exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
} else {
  console.log('Uploads directory already exists');
}

// Allowed image types
const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

// Set up disk storage for Multer
const storage = multer.diskStorage({
  // Destination folder for uploads
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Use the uploadsDir variable here
  },
  // Filename for the uploaded file
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create Multer instance with disk storage and file filter
const upload = multer({
  storage: storage
 
});

module.exports = upload;
