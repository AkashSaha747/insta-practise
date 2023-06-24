
let mongoose=require("mongoose");
let connection=()=>{
   try{ mongoose.connect(process.env.MONGO_URL);
console.log("atlas connnected")
}
   catch(err){
    console.log("err connecting to atlas")
   }
}

module.exports={
    connection
}