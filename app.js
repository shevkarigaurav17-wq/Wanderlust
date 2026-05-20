const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); ; //to parse data
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");//for templates
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/expresserror.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const Reviews = require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const User = require("./models/user.js");
const LocalStrategy=require("passport-local");


//we use separet file for all listing so the single file will not be bloated 
const listings=require("./routes/listing.js");
//we use separet file for all reviews so the single file will not be bloated 
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");

app.use(methodOverride("_method")) ;
app.engine("ejs",ejsMate); //for templates
app.use(express.static(path.join(__dirname,"public")));  //for style 

const sessionoptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{ expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
          maxAge:1000 * 60 * 60 * 24 * 3,
         httpOnly:true //use for security:cross scripting attacks
        },
}

app.use(session(sessionoptions));
app.use(flash());  //single time message display //compulsary to use sessions to use flash


passport.initialize();//initilaize passport as middleware
app.use(passport.session());  // to identify same user across webpages
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  //store session serilaize
passport.deserializeUser(User.deserializeUser());  //ulta of serialize


main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// Model: Listing  //place
// flace
// title
// description
// image
// price
// location
// country
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

app.get("/demouser",async (req,res)=>{
   let fakeuser=new User({
    email:"studenat@gmail.com",
    username:"deltaaastudent",
   }); 
   let registereduser=await User.register(fakeuser,"helloworld"); //use to sabe in db static method
   res.send(registereduser);
});

// here we acually use the listing js from routes
app.use("/listings",listings);
// here we acually use the review js from routes
app.use("/listings/:id/reviews",reviews);

app.use("/",user);


// 404 - catch all routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
   
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/",(req,res)=>{
 res.send("hi");
});