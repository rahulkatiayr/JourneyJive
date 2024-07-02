const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectway}=require("../middleware.js");


module.exports=router;
const controlUser=require("../controller/user.js");


router.get("/signup",controlUser.signup);

router.post("/signup",wrapAsync(controlUser.postsignUp));



router.get("/login",controlUser.login);

router.post("/login",redirectway,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
controlUser.logIN
);

router.get("/logout",controlUser.logout);
