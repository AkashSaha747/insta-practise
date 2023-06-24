let mongoose=require("mongoose");

let userSchema=new mongoose.Schema({
name:String,
email:String,
password:String
})

let Usermodel=mongoose.model("user",userSchema);

module.exports={
    Usermodel
}
