const Joi = require("joi");

// Define a Joi schema for user validation
const userValidationSchema = Joi.object({
  firstname: Joi.string().min(3).max(50).when('$isEmptyAllowed', { is: false, then: Joi.required() }).allow(''),
  lastname: Joi.string().min(3).max(50).when('$isEmptyAllowed', { is: false, then: Joi.required() }).allow(''),
  contact: Joi.string().pattern(/^[0-9]{10}$/).when('$isEmptyAllowed', { is: false, then: Joi.required() }).allow(''),
  address: Joi.string().allow(''),
  profilepic: Joi.string().allow(''),
  dob: Joi.date().iso().allow(''),
  nationality: Joi.string().allow(''),
  about: Joi.string().allow(''),
  university: Joi.string().allow(''),
  gender: Joi.string().valid('Male', 'Female', 'Other').allow('')
});

// Function to validate user data
const validateProfileUpdate = (userData) => {
  return userValidationSchema.validate(userData);
};

module.exports = validateProfileUpdate;
