const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB=async()=>{
    await Listing.deleteMany({});
     Finaldata= initdata.data.map((obj)=>({...obj,
      owner:'667a91e0db10918920bd9414'}));
    
    console.log("next output ");
    await Listing.insertMany(Finaldata);
    console.log("initialized successfully");
}

initDB();