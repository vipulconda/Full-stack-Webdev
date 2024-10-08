const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const nodemailer = require("nodemailer");
const UserMessage = require("../models/messages");
const jwt = require("jsonwebtoken");
const validateUser = require("../models/validate");
const crypto = require("crypto");
const OTP = require("../models/otpschema");
const path = require("path");
const {profilepicupload,postupload} = require("../models/uploads");
const validateProfileUpdate = require("../models/profileupdatevalidation");
const authenticateToken = require("../models/authmiddleware");
const Conversation = require('../models/chats');
const Posts=require('../models/post')
const Comment=require('../models/comments')
const Like=require('../models/likes')

const { isValid } = require("zod");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
secret_key = "123456";
const router = express.Router();
// send otp
router.post("/send-otp", async (req, res) => {
  const { error } = validateUser(req.body);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { firstname, lastname, contact, email, username, password } = req.body;
  console.log(req.body);
  try {
    const EmailAlreadyExists = await User.findOne({ email });
    const UsernameAlreadyExists = await User.findOne({ username });
    console.log(req.body);
    if (EmailAlreadyExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (UsernameAlreadyExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const otp = crypto.randomBytes(3).toString("hex");

    const otp1 = new OTP({
      email: email,
      otp: otp,
    });
    await otp1.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vipul02vns@gmail.com",
        pass: "vwxv qjdh tifu nxwy",
      },
    });

    const mailOptions = {
      to: email,
      from: "vipul02vns@gmail.com",
      subject: "Verify your email",
      text: `Hi "${username}",\n\n Verify your email to complete the registration process.\n\n
          OTP for email verification is  ${otp} \n\n
       feel free to contact us.\n\nBest regards,\Study Point Team`,
      html: `<p>Hi there,</p><p> 
      Verify your email to complete the registration process.</p> <p>OTP for email verificaltion is</p><p>
      <h2>${otp}</h2>
      <p>Feel free to contact us</p>
      <p>Best Regards,</p>
      <p>Study Point team</p>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("Inside sendMail callback");
      if (error) {
        console.error("Error sending email: ", error); // Log detailed error
        return res
          .status(500)
          .json({ message: "Error sending email: " + error.message });
      }
      console.log("OTP sent: ", info.response);
      return res.status(200).json({ message: "OTP sent" });
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" + { error } });
  }
});

//register
router.post("/register", async (req, res) => {
  const { otp, ...userdata } = req.body;
  const { error } = validateUser(userdata);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  console.log(req.body);
  try {
    const EmailAlreadyExists = await User.findOne({ email: userdata.email });
    const UsernameAlreadyExists = await User.findOne({
      username: userdata.username,
    });

    if (EmailAlreadyExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (UsernameAlreadyExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const isValidOtp = await OTP.findOne({
      email: userdata.email,
      otp: req.body.otp,
    });
    if (isValidOtp) {
      console.log("otp valid");
      const encryptedpassword = await bcrypt.hash(userdata.password, 10);
      const user = new User({
        firstname: userdata.firstname,
        lastname: userdata.lastname,
        contact: userdata.contact,
        email: userdata.email,
        username: userdata.username,
        password: encryptedpassword,
      });
      console.log("otp vipul");
      await user.save();
      OTP.deleteOne({ username: userdata.email, otp: req.body.otp });
      console.log("registration successfull");
      return res.status(200).json({ message: "User registered  successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "server error" + { error } });
  }
});

// login route

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ username });
    //    console.log(req.body)
    if (!user) {
      return res.status(500).json({ message: "Username does not exist" });
    }

    const validUser = await bcrypt.compare(password, user.password);
    console.log(validUser);
    if (!validUser) {
      return res.status(500).json({ message: "invalid password" });
    }

    jwt_token = jwt.sign({ username: user.username }, secret_key, {
      expiresIn: "1h",
    });
    res.json({ token: jwt_token , username : user.username, email : user.email,userId:user._id,expiresIn : 3600});
    console.log("login successfull");
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// contact route
router.post("/contact", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const NewMessage = new UserMessage(data);
    await NewMessage.save();
    console.log("message sent successfully");
    res.json({ message: data.firstname + " your message has been send " });
  } catch (error) {
    res.status(310).json({ message: "error sending message" + { error } });
  }
});

// send reset password mail
router.post("/resetpassword", async (req, res) => {
  const { email } = req.body;
  const frontendOrigin = req.headers["frontend-origin"];

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000;
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vipul02vns@gmail.com",
      pass: "vwxv qjdh tifu nxwy",
    },
  });
  const resetLink = `${frontendOrigin}/UpdatePassword?token=${resetToken}`;
  console.log(resetLink);
  const mailOptions = {
    to: user.email,
    from: "vipul02vns@gmail.com",
    subject: "Password Reset Request",
    text: `Hi there,\n\nWe received a request to reset your password.
     If you didn't request this, please ignore this email.\n\nTo reset your password,
     click the link below:\n\n ${resetLink} \n\nIf you have any questions or concerns, 
     feel free to contact us.\n\nBest regards,\nStudy Point Team`,
    html: `<p>Hi there,</p><p>We received a request to reset your password. 
    If you didn't request this, please ignore this email.</p><p>To reset your password, 
    click the link below:</p><p><a href="${resetLink}" >Reset Password</a></p><p>
    If you have any questions or concerns, feel free to contact us.</p><p>Best regards,<br>Study Point Team</p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    console.log("Inside sendMail callback");
    if (error) {
      console.error("Error sending email: ", error); // Log detailed error
      return res
        .status(500)
        .json({ message: "Error sending email: " + error.message });
    }
    console.log("Password reset link sent: ", info.response);
    return res
      .status(200)
      .json({ message: "Password reset link sent", token: resetToken });
  });
});

//verify token
router.post("/verifytoken", async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ resetPasswordToken: token });
  if (!user) {
    console.log("Password reset token is invalid or has expired");
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has expired." });
  }
  return res.status(200).json({ message: " token is valid" });
});
// confirm new password

router.post("/newpassword", async (req, res) => {
  const { token, password } = req.body;

  console.log(req.body);
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    console.log("Password reset token is invalid or has expired");
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has expired." });
  }
  const new_password = await bcrypt.hash(password, 10);
  user.password = new_password; // Make sure to hash the password before saving
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.save();
  console.log("Password has been reset successfully");
  return res
    .status(200)
    .json({ message: "Password has been reset successfully." });
});


//user profile

router.get("/profile/:username", authenticateToken, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Profile does not exist" });
   
   return res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      address: user.address,
      contact: user.contact,
      about: user.about,
      dob: user.dob,
      gender: user.gender,
      university: user.university,
      profilepic: user.profilepic,
      nationality: user.nationality,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

//validate image type 



//edit user profile
router.post("/edit", authenticateToken, profilepicupload.single("profilepic"), async (req, res) => {
  const { error } = validateProfileUpdate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const {
    firstname,
    lastname,
    nationality,
    university,
    address,
    contact,
    dob,
    gender,
    about,
  } = req.body;

  const username = req.user.username; // Extract username from authenticated user
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(500).json({ message: "User not found" });
    const oldProfilePic = user.profilepic;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.nationality = nationality || user.nationality;
    user.address = address || user.address;
    user.contact = contact || user.contact;
    user.dob = dob || user.dob;
    user.about = about || user.about;
    user.gender = gender || user.gender;
    user.university = university || user.university;
    if (req.file) {
     
      if (user.profilepic) {
      
        const publicId = user.profilepic.split('/').pop().split('.')[0];
        console.log(publicId)
        await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
      }
      user.profilepic = req.file.path;
    }
    await user.save();
    console.log(user);
   return res.status(200).json({ message: "Profile edited successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/test", (req, res) => {
  res.send("Server is working");
});


// public user profile
router.get('/profile/public/:username',async(req,res)=>{
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Profile does not exist" });    
   return res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      about: user.about,
      university: user.university,
      profilepic: user.profilepic,
      connections:user.connections
    });
    
  } catch (error) {
    console.log("error happended while sending profile")
    return res.status(500).json({ message: "Server error" });
  }
})


// Connect User
router.post('/api/connect/:username',authenticateToken,async(req,res)=>{
  const username1=req.user.username
  const username2=req.params.username;
 // const authHeader = req.headers['authorization'];
//  console.log("headers", authHeader)
  const user1=await User.findOne({username: username1})
  const user2=await User.findOne({username: username2})
   
  try{
        if(username1==username2){
            return res.status(401).json({message : "you cannot connect to yourself "})
        }
        if(user1.connections.includes(username2)){
          return res.status(401).json({message : "already connected "})
        }
        user1.connections.push(username2)
        user2.connections.push(username1)
         await user1.save()
         await user2.save()
        console.log("connected successfully")
        return res.status(200).json({message : "connected successfully"})
  }
  catch(error){
    return res.status(400).json({message : "error occured during connecting ", error : error })
  }
})

//disconnect user
router.post('/api/disconnect/:username',authenticateToken,async(req,res)=>{
  const username1=req.user.username
  const username2=req.params.username;
  const user1=await User.findOne({username: username1})
  const user2=await User.findOne({username: username2})
   
  try{
        if(username1==username2){
            return res.status(401).json({message : "you cannot disconnect to yourself "})
        }
        if(user1.connections.includes(username2)){
           user1.connections=user1.connections.filter(item => item !== username2);
        }
        if(user2.connections.includes(username1)){
          user2.connections=user2.connections.filter(item => item !== username1);
       }
       await user1.save()
       await user2.save()
      
        console.log("disconnected successfully")
        return res.status(200).json({message : "disconnected successfully"})
  }
  catch(error){
    return res.status(400).json({message : "error occured during disconnecting ", error : error })
  }
})

// add posts
router.post('/:userId/create-post',authenticateToken,postupload.single("image"),async(req,res)=>{
   try{
    const userid=req.params.userId
    console.log("userId: ", userid)
     const content=req.body.content;
     const Post=new Posts({
      user_id:userid,
      image:req.file.path,
      content:content
     })
    await Post.save();
    return res.status(200).json({message:"new post added successfully",Post : Post});
   }
   catch(error){
    console.log(error)
    return res.status(400).json({message:"error occured during creating post ",error});
   }
})
// add comment
router.post('/add-comment/:post_id',authenticateToken,async (req,res)=>{
    try{
      const userId=req.params.userId;
    const postId=req.params.post_id;
    const content=req.body;
    const new_comment=new Comment({
      user_id:userId,
      post_id:postId,
      content:content
    })
    await new_comment.save();
    return res.status(200).json({message:"comment added",comment:new_comment});
    }
    catch(error){
        return res.status(400).json("message : error happend during adding comment ",error);
    }
})

// add likes
router.post('/posts/:userId/:post_id/like',authenticateToken,async (req,res)=>{
 try{
  const userId=req.params.userId;
 const postId=req.params.post_id;
 const AlreadyLiked=await Like.findOne({user_id:userId, post_id:postId});
 if(AlreadyLiked){
  return res.status(400).json({message:"already liked"});
 }
 
 const newLike=new Like({user_id:userId, post_id:postId });
 await newLike.save();
 const post= await Posts.findOne({_id :postId})
 post.likes++;
 await post.save();
 return res.status(200).json({message:"like added successfully"});
 }
 catch(error){
  console.log(error)
  return res.status(500).json({message : "error occured ", error})
 }
})
// remove like
router.post('/posts/:userId/:post_id/unlike',authenticateToken,async (req,res)=>{
  try{
   const userId=req.params.userId;
  const postId=req.params.post_id;
  const DeletedLike=await Like.findOneAndDelete({user_id:userId, post_id:postId});
  
  if(DeletedLike){
    const post= await Posts.findOne({_id :postId})
    post.likes--;
    await post.save();
    return res.status(200).json({message:"like  removed successfully"});
  }
  return res.status(200).json({message:"not liked"});
  }
  catch(error){
    console.log(error)
   return res.status(500).json({message : "error occured ", error})
  }
 })

 // Get whether the user has liked the post
router.get('/posts/:userId/:postId/isLiked',authenticateToken, async (req, res) => {
  try {
    const { userId, postId } = req.params;
    // Check if the user has liked the post
    const like=await Like.findOne({user_id:userId, post_id:postId});
    let isLiked=false;
    if(like)isLiked=true;
   return res.status(200).json({ isLiked});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error fetching like status', error });
  }
});

//get posts
router.get('/profile/:username/posts',authenticateToken ,async (req, res) => {
  
  try {
    const  {username}  = req.params;
  console.log("username " ,username)
  const user=await User.findOne({username:username});
  const userId=user._id;
  const { page = 1, limit = 10 } = req.query; // Default to 10 posts per page
    const posts = await Posts.find({ user_id: userId })
      .skip((page - 1) * limit) // Skip the posts already fetched
      .limit(Number(limit)) // Limit the number of posts returned
      .sort({ createdAt: -1 }); // Sort by latest posts
    const totalPosts = await Posts.countDocuments({ user_id: userId });
    const hasMore = totalPosts > page * limit; // Check if more posts are available
    console.log("posts",posts)
   return res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.log(error)
   return res.status(500).json({ message: 'Error fetching posts', error });
  }
});

module.exports = router;

