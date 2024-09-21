
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname :{
    type :String ,
    required :true
 },
  address: {
    type: String,
  
  },

  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  about:{
    type : String
   
  },
  university: {
    type: String,
    
  },
  resetPasswordToken: {
    type :String
 
  },
  nationality: {
    type: String,
  },
  resetPasswordExpires:  {
      type :String
     
    },

    dob:{
      type : Date
    },
    gender:{
      type : String
    },
    profilepic:{
      type: String ,
      default: 'https://res.cloudinary.com/dgnldu9be/image/upload/v1726063126/3135715_pvfqw5.png'
    },
    connections:[String]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
