const { Postmodel } = require("../models/post.model");

let authorization=async(req,res,next)=>{

    let {postID}=req.params;
    let post=await Postmodel.findOne({_id:postID})
    let post_owner=post.userID;
if(post_owner==req.userID){
next();
}else{
    res.send({msg:"not authorised"});
}

}

module.exports={authorization}