const express=require("express");
const router=express.Router({mergeParams:true});
const app=express();
const wrapAsync=require("../utils/wrapAsync.js");
app.use(express.urlencoded({extended : true}));
const methodOverride=require("method-override");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const controlReview=require("../controller/review.js")

const validatereview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    
    if(error){
     let errmsg=error.details.map((el)=>el.message).join(",");
     console.log(errmsg);
     throw new ExpressError(400,errmsg);
 }else{
     console.log("no error ");
     next();
 }
    
 }

router.post("/",validatereview,wrapAsync(controlReview.CreateReview));
// delete for route 
router.delete("/:reviewId",wrapAsync(controlReview.DestroyReview));

module.exports=router;