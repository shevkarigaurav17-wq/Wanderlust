const express = require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
//user signup and save
router.get("/signup", (req,res)=>{
           res.render("users/signup.ejs")
});

router.post("/signup", wrapasync(async (req,res)=>{
   try{
    let {username,email,password}=req.body;
   const newuser=new User({email,username});
   const registereduser=await User.register(newuser,password);
   console.log(registereduser);
   req.flash("success","welcome to wanderlust");
   res.redirect("/listings");
   }catch(err){
      req.flash("error",err.message);
       res.redirect("/signup");
   }
}));

module.exports = router;