let jwt=require("jsonwebtoken")

let authenticate=async(req,res,next)=>{
let token=req.headers?.authorization.split(" ")[1];
if(token){

    let decode= jwt.verify(token,process.env.SECRET_KEY);
    if(decode){
        req.userID=decode.userID;
        next();
    }else{
        res.send({msg:"token verification failed"})
    }
}else{
    res.send({msg:"pls provide token"})
}
}

module.exports={authenticate}