require("dotenv").config();
let express=require("express");
const { connection } = require("./configs/db");
let cors=require("cors")
let {Postmodel}=require("./models/post.model")
let {Usermodel}=require("./models/user.model")
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");
const { authenticate } = require("./middleware/authenticate");
const { authorization } = require("./middleware/authorization");

let app=express();
app.use(express.json());
app.use(cors());





app.get("/",(req,res)=>{
    res.send({msg:"home"})
})

app.post("/signup",async(req,res)=>{
    let{name,email,password}=req.body;
let user=await Usermodel.find({email});
if(user.length>0){
res.send({msg:"user already exists, pls login"});
}else{

    try{
        const hash = bcrypt.hashSync(password, 4);
        await Usermodel.create({name,email,password:hash});
        res.send({msg:"sign up done"})
    }catch(err){
        console.log("error in signup")
        res.send({msg:"error in sign up"})
    }
}
})

app.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let user=await Usermodel.findOne({email});
    console.log(user)
    if(user){
        try{
          let pass_match =  bcrypt.compareSync(password, user.password);
          if(pass_match){

            var token = jwt.sign({ userID:user._id }, process.env.SECRET_KEY);
                res.send({msg:"login success",token})
          }else{
            res.send({msg:"wrong credentials"})
          }
        }catch(Err){
            console.log(Err)
            res.send({msg:"login failed"})
        }
    }else{
        res.send({msg:"pls sign up"})
    }
})

app.get("/allposts",async(req,res)=>{
    let allposts=await Postmodel.find();
    res.send({data:allposts})
})

// authenticate part

app.get("/post/user",authenticate,async(req,res)=>{
    let allposts=await Postmodel.find({userID:req.userID});
    res.send({data:allposts})
})

// CREATE
app.post("/post/create",authenticate,async(req,res)=>{
    let {title,body}=req.body;
    let user=await Usermodel.findOne({_id:req.userID})
if(user){
    await Postmodel.create({title,body,userID:req.userID});
    res.send({msg:`post created by ${user.name}`})

}else{
    res.send({msg:"invalid token"})
}


})

// AUTHORISATION required

// UPDATE
app.put("/post/update/:postID",authenticate,authorization,async(req,res)=>{
let {title,body}=req.body;
let {postID}=req.params;
try{await Postmodel.findByIdAndUpdate({_id:postID},{title,body});
res.send({msg:"post updated"})}
catch(err){
    res.send({msg:"error in put update"})
}
})

// DELETE
app.delete("/post/delete/:postID",authenticate,authorization,async(req,res)=>{
let {postID}=req.params;
await Postmodel.findByIdAndDelete({_id:postID});
res.send({msg:"post deleted"})
})













app.listen(process.env.PORT,()=>{
    connection()
    console.log("listening at port 8080")
})