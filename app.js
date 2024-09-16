 if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
    // console.log(process.env)
 }




const express=require("express");
const app=express();

const mongoose=require("mongoose");
const multer=require("multer");
const upload=multer({dest : "uploads/"});

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.use(methodOverride("_method"));

const flash=require("connect-flash");

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const session=require("express-session");
const MongoStore = require('connect-mongo');


const ExpressError=require("./utils/ExpressError.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLAS;

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },

    touchAfter:24*3600,
})




store.on("error",()=>{
    console.log("error in mongo store ");
})


const seesionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(seesionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.current_user=req.user;
    // passport hmare liye req.user m user ki login details save rkhta h  
    next();

})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email :"kanpur@123",
//         username:"Rahul katiyar"
//     });

//    let newregister=await  User.register(fakeuser,"hellodelta");
//    res.send(newregister);
// })




main().then(()=>{
    console.log("connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// 'mongodb://127.0.0.1:27017/wanderlust'


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

;










app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.get("/",(req,res)=>{
    res.render("listings/Home.ejs");
});

app.get("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found "))
})

// error handler
app.use((err,req,res,next)=>{
    let{status=500, message="something went wrong"}=err;
    res.status(status).render("error.ejs",{message,status})

})



