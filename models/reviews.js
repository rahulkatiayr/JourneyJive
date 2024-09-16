const { date } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewschema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
})

const Review=mongoose.model("Review",reviewschema);
module.exports=Review;