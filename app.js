if(process.env.NODE_ENV != 'production'){ 
  require('dotenv').config();
}

const express = require("express");  //set up of express app
const app = express();
const mongoose = require("mongoose");   //set up of mongodb
const path = require("path");         
const methodOverride = require('method-override'); //for method overriding
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");





const port = 3000;

app.listen(port, () =>{
    console.log(`app is listening on port ${port}`);
});


const dburl = process.env.ATLASDB_URL;

async function main() {
   await mongoose.connect(dburl); 
}

main()
.then((res) =>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine", "ejs");  //for seting view diroctry templeting
app.set("views", path.join(__dirname, "views"));  //for setting path of views
app.use(express.urlencoded({extended: true})); //It's use to pass/extract data from URL
app.use(methodOverride('_method'));  //using method overriding
app.engine('ejs', ejsMate);  // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "public")));  // using styling of static file

const store = MongoStore.create({
  mongoUrl: dburl,
 secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});

store.on("error", (err) =>{
  console.log("Error in Mongo Session Store:", err);
});


const sessionOptions = {
  store,
   secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};




app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());   //To use Passport in an Express or Connect-based application, configure it with the required passport.initialize() middleware
app.use(passport.session());      // If your application uses persistent login sessions (recommended, but not required), passport.session() middleware must also be used.
passport.use(new LocalStrategy(User.authenticate()));  //// use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware 
app.use((req,res,next) =>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});



     //Creating Demo User  
// app.get('/demouser', async(req, res) =>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// })


app.get("/", async (req,res)=>{
   const allListings = await Listing.find({})
   res.render("listings/index", {allListings});
    });




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);







//For invalid Response
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

console.log("MAP TOKEN:", process.env.MAP_TOKEN);



// app.get("/testlisting",  async(req,res) =>{
//     let samplelisting = new Listing({
//         title: "my new villa", 
//         description: "By the beach",
//         price:  1200,
//         location: "mumbai, Maharashtra",
//         country: "India",
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
