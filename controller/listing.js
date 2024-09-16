const Listing=require("../models/listing.js");
const User=require("./user")

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
};

module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    let originalurl=listing.image.url;
    let filename=listing.image.filename;
    // console.log("this is file name ");
    // console.log(filename);
    // console.log("previous url ");
    // console.log(originalurl);
   let blur_image = originalurl.replace("/upload","/upload/h_300,w_250");
//    console.log("here is new url ");
//    console.log(blur_image);
 
    res.render("listings/edit.ejs",{listing,blur_image,filename});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.CreateNew=async(req,res,next)=>{
    // let{title,description,location,price,country,image}=req.params;
// we learn a new way to acces by object 
//    let listing=req.body;
//    console.log(listing);
    // Listing.insertOne({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country,
    // })
    // above is the general method to add new data ,look new and short way
        let url=req.file.path;
        let filename=req.file.filename;
        const newlisting=new Listing(req.body.listing);
        newlisting.image={url , filename};
      
      

        
        newlisting.owner=req.user._id;
        let final=(await newlisting.save());
        console.log(final);
        req.flash("success","created new listing succesfully !");
        res.redirect("/listings");
 };

 module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","this listing does not exist ");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.update=async(req,res,next)=>{
    // if(!req.body.listing){
    //     next(new ExpressError(404,"proper listing is not sent "));
    // }
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url , filename}
    await listing.save();

    }
    
    

    req.flash("success","edited successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async(req,res)=>{
    const {id}=req.params;
   let deletedone=await Listing.findByIdAndDelete(id);
   console.log(deletedone);
   req.flash("success","deleted successfully");
   res.redirect("/listings");
};