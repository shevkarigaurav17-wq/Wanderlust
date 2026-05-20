const express=require("express");
const router=express.Router({mergeParams: true });
// With mergeParams: true, your router can access:
// req.params.id
// from the parent route /listings/:id/reviews
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");
const {reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

const ValidateReview=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);
   if(error){
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
   }else{
      next();
   }
};

//reviews post
router.post("/",ValidateReview,wrapAsync(async (req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newReview=new Reviews(req.body.review);
   listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
})); 

//delet for review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
   //  $pull
// The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;