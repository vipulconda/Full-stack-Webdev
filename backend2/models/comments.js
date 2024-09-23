const mongoose =require('mongoose')

const comment_Schema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    },
    content:{
        type:String,
        required:true,

    }
}, {timestamps:true})
Comment=mongoose.model('Comments',comment_Schema);
module.exports=Comment;