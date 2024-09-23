
const mongoose=require('mongoose')
const PostSchema=new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',  // References the User model
        required: true
      },
    image:{
        type: String,
        required: true
    },
    content:{
        type : String,
        required: true
    },
    comments_count:{
       type: Number,
       default:0
    },
    likes: {
        type: Number,
        default : 0
    }
})

Post=mongoose.model("Posts",PostSchema);
module.exports=Post
