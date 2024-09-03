const Joi = require('joi');

// Define a Joi schema for user validation
const userValidationSchema = Joi.object({
  firstname: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8) // Minimum length of 8 characters
  .max(30) // Maximum length of 30 characters
  .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // At least one lowercase, one uppercase, one digit, and one special character
  .required(),
  contact : Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().optional(), // Optional field
  profilepic: Joi.string()
  .pattern(/\.(jpg|jpeg|png|gif|bmp)$/i, { name: 'image format' }) // Regex to match file extensions
   // Ensure the path is provided
   .messages({
    'string.pattern.name': 'Invalid image format. Only .jpg, .jpeg, .png, .gif, and .bmp are allowed.',
  }),
  dob: Joi.date().optional(), // Optional field
  nationality: Joi.string().optional(), // Optional field
  about: Joi.string().optional(), // Optional field
  university: Joi.string().optional(), // Optional field
  gender:  Joi.string().optional() 
})

// Function to validate user data
const validateUser = (userData) => {
  return userValidationSchema.validate(userData);
};

module.exports = validateUser;
