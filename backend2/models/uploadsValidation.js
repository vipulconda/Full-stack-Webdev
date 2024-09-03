const Joi = require('joi');
const path = require('path');

// Define a Joi schema for user validation
const userValidationSchema = Joi.object({
  profilepic: Joi.string()
    .custom((value, helpers) => {
        const stringValue = String(value);
      // Extract the file extension
      const ext = path.extname(stringvalue).toLowerCase();
     
      // List of allowed extensions
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

      // Validate file extension
      if (!allowedExtensions.includes(ext)) {
        return helpers.error('any.invalid');
      }
   console.log('valid stirng')
      return stringValue; // Return the valid value
    }, 'File Extension Validation')
    .required()
    .messages({
      'any.invalid': 'Invalid image format. Only .jpg, .jpeg, .png, .gif, and .bmp are allowed.',
    }),
});

// Function to validate user data
const validateUpload = (uploadData) => {
  return userValidationSchema.validate(uploadData);
};

module.exports = validateUpload;
