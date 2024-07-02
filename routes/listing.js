const express=require("express");
const router=express.Router();
const app=express();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
app.use(express.urlencoded({extended : true}));
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

const {isloggedin,isOwner}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer=require("multer");
const{storage}=require("../cloudConfig.js")
const upload=multer({storage});



const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
        if(error){
            let message=error.details.map((el)=>el.message).join(",");
            console.log(message);
            throw new ExpressError(400,message);
        }else{
            next();
        }
};

// index route
router.get("/",wrapAsync(listingController.index));
// / new route 
router.get("/new",isloggedin,wrapAsync(listingController.renderNewForm));
// show route
router.get("/:id",isloggedin,wrapAsync(listingController.show));

router.post("/new/list",upload.single("listing[image]"),validatelisting,wrapAsync(listingController.CreateNew)
);



// edit route
router.get("/:id/edit",isloggedin,wrapAsync(listingController.edit));

// update route
router.put("/:id/update",isloggedin,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingController.update));

// delete route
router.delete("/:id",isloggedin,wrapAsync(listingController.delete));

module.exports=router;