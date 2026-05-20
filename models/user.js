
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,

    }
    
});

userSchema.plugin(passportLocalMongoose); // ✅ should be a function



module.exports=mongoose.model('User',userSchema);