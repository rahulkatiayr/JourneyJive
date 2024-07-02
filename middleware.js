const Listing=require("./models/listing.js");


module.exports.isloggedin=(req,res,next)=>{
    console.log(req.path,"....",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.originalurl=req.originalUrl;
        console.log("originalUrl is this ");
        req.flash("error","you must be logged in first");
        return res.redirect("/login");
    
}

else{
next();
}
}

module.exports.redirectway=(req,res,next)=>{
    if(req.session.originalurl){
        res.locals.redirecturl= req.session.originalurl;
    }else{
        res.locals.redirecturl="/listings";
    }
next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id).populate("owner");
    if(!listing.owner[0].equals(res.locals.current_user._id)){
        req.flash('error',"you don,t have permission !");
        return res.redirect(`/listings/${id}`);
    }
next();
    

}