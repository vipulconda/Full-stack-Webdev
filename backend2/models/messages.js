const { required } = require("joi");
const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
const Messages = mongoose.model("User Messages", msgSchema);
module.exports=Messages;