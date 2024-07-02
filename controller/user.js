const User=require("../models/user.js");
const {redirectway}=require("../middleware.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postsignUp=(async(req,res)=>{
    try{ let {username,email,password}=req.body;
      const newUser=new User({
       username,email
});

  let reg_user= await User.register(newUser,password);
  console.log(reg_user);
  req.login(reg_user,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","signed up successfully");
    res.redirect("/listings");
  })
  
  
 
}catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
}
});

module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logout=(req,res,next)=>{
    console.log(req.user);
    
    req.logOut(err=>{
        if(!err){
            req.flash("success","logged out successfully");
            res.redirect("/listings");
        }else{
            next(err);
        }
    })

    
};

module.exports.logIN=async (req,res)=>{
    req.flash("success","welcome to wanderlust");
    console.log("login successfully");
    console.log(res.locals.redirecturl);
    res.redirect(res.locals.redirecturl);

};
