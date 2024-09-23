const mongoose =require('mongoose')

const likes_Schema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    }
}, {timestamps:true})
Like=mongoose.model('Likes',likes_Schema);
module.exports=Like;