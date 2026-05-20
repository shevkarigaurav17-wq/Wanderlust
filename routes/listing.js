const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");



const ValidateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
   if(error){
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
   }else{
      next();
   }
};


router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("../views/listing.ejs",{allListings});
}));
router.get("/new",(req,res)=>{
   res.render("../views/newform.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   const idlisting=await Listing.findById(id).populate("reviews");
   if(!idlisting){
      req.flash("error","listing you requested doesn't exists");
      return res.redirect("/listings")
   }
   res.render("../views/show.ejs",{idlisting});
}));


//NEW AND CREATE

router.post("/",ValidateListing,wrapAsync(async (req,res,next)=>{
   
    const newlisting= new Listing(req.body.listing);
    console.log(req.body);
   await newlisting.save();
   req.flash("success","new listing created");
   res.redirect("/listings");
}));



//edit
router.get("/:id/edit",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   const idlisting=await Listing.findById(id);
   if(!idlisting){
      req.flash("error","listing you requested doesn't exists");
      return res.redirect("/listings")
   }
   res.render("../views/edit.ejs",{idlisting});
}));

//upadte
router.put("/:id",ValidateListing,wrapAsync(async (req,res)=>{
   if(!req.body.listing){
      throw new ExpressError(400,"Send valid data");
   }
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success","listing updated");
   res.redirect(`/listings/${id}`);
  
   
}));

router.delete("/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
 req.flash("success","listing deleted");
   res.redirect(`/listings`);
  
   
}));

module.exports=router;
