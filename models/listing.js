const { application } = require("express");
const mongoose=require("mongoose");
const User = require("./user.js");
const Review = require("./reviews");
const { required } = require("joi");
const Schema=mongoose.Schema;



const listingSchema=new Schema({
    title:{type:String,
        required:true},
    description:String,
    image: {
        url : String,
        filename:String,
    },

    reviews:[{
        type:Schema.Types.ObjectId,
        ref :"Review",


    }],

    owner:[{
        type:Schema.Types.ObjectId,
        ref :"User",
        required:true,

    }],

    
    
    price:Number,
    location:String,
    country:String,
    
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
        console.log("done and deleted ");
        
    }

});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;