let mongoose=require("mongoose");

let postSchema=new mongoose.Schema({
title:String,
body:String,
userID:String
})

let Postmodel=mongoose.model("post",postSchema);

module.exports={
    Postmodel
}