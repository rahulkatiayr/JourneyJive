const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.CreateReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    console.log(req.params.id);
    let review=new Review(
        req.body.review
    );

    listing.reviews.push(review);

    await review.save();
    await listing.save();
    
    res.redirect("/listings");

};

module.exports.DestroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);



}
