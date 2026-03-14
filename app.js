//todo Importing dotenv file and its access to use
// import 'dotenv/config'
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();
//todo importing wrapAsync function and myError fucntion , SchemaValidationn i.e from joi , review module
import wrapAsync from "./utils/wrapAsync.js";
// import myError from "./utils/myError.js";
import  { errorValidate } from "./routes/listing.js";
import controllerApp from "./controller/controllerApp.js";
//todo Requiring cloudinary
import { storage } from "./cloudConfig.js"
//todo multer to incode the data of form of multipart/form data 
import multer from "multer";
const upload = multer({ storage })

//todo Ejs- mate
import ejsMate from "ejs-mate";
app.engine("ejs", ejsMate);
//todo importing method override 
import methodOverride from "method-override";
app.use(methodOverride('_method'));
let mysecret = process.env.secret;
//todo importing cookies-parser and session
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
app.use(cookieParser(mysecret)); // it will parse the data of cookies request other wise when you conole.dir(cookies.req) it will give undefined;
//todo importing connect-monngo for Storing session and other values 
// import MongoStore from 'connect-mongo';
//todo connecting the mongoose
import mongoose from "mongoose";
const dbUrl= process.env.ATLASDB_URL;
// mongoose.connect('mongodb://127.0.0.1:27017/project1')
mongoose.connect(dbUrl) //now mongodb will take the dburl store in the env file.
  .then(() => console.log('Connected!'))
  .catch((err)=>{
    console.log("connection error is " + err);
  })
  //todo to change from common Js to Embedded Js we required to add these 3 lines extra so that we can use import at the place of require import is a part of new ejs and in package.json write "type:" = "module"
import { fileURLToPath } from "url"; // Required for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the directory name
//todo Setting the path of the app.js
import path from "path";
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); //getting public file .
//todo setting express urlencoded 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// to use public folder 
app.use(express.static(path.join(__dirname, "/public")));
//todo imprting the router 
import Rlist from "./routes/listing.js"
import Ruser from "./routes/user.js";
import cookie from "./cookies/cookies.js"; // importing the cookies
//todo Importing passport , localStrategy and user Schema for User Authentication.
import passport from "passport";
import LocalStrategy from "passport-local";
 import User from "./models/user.js"; 
 import listing from "./models/listing.js";
 import isLoggedin from "./middleware.js";
import MongoStore from 'connect-mongo';
//todo starting port
const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log("app listening ");
})
//todo using flash
//const mongo store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: mysecret,  
  },
  touchAfter: 24*60*60, // stores time in seconds
})

store.on("error", (err)=>{
  console.log("Error in Mongo Sessions " + err);
})

const sessionvalue = {
  store: store,
  secret: mysecret,
   resave: false ,
    saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7*24*60*60*1000),
    maxAge: 7*24*60*60*1000,
  },
  };
app.use(session(sessionvalue));
app.use(flash()); //for using the flash function.
 //todo Always use passport after sessionn because it implemented through session and memorise its value by using sessions
 app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.get("/showAll", controllerApp.showAll);

//todo Using the router
app.use("/cookies", cookie);
app.use("/listing", Rlist);
app.use("/", Ruser);

//todo Applying route.route() to combine both get and post route on single which are on the same path

app.get("/newlisting", isLoggedin, wrapAsync (async(req, res)=>{
      res.render("newlist.ejs", {});
})
)
 //todo using wrapAsync here instead of try catch you can use both . In next i used try catch
app.post ("/newlisting",isLoggedin, upload.single("listing[img]"), errorValidate, wrapAsync( controllerApp.newlist)
);
//todo Uploading My photo for about section
app.get("/myphoto", (req, res)=>{
  res.render("myphoto.ejs");
})
app.post("/myphoto" , upload.single("myphoto") , (req, res)=>{
  try{

    console.log(req.file);
    res.send("Photo send successfully");
  } catch(err){
    console.log("Error is " + err);
  }
})
app.get("/edit/:id",isLoggedin, controllerApp.getEdit);
try{
  app.put("/edit/:id",isLoggedin, upload.single("imgurl"), controllerApp.postEdit );
}
catch(err){
  next(err);
}
 //todo Adding AboutSection
 app.get("/about", async(req, res)=>{
  res.render("about.ejs");
})
app.delete("/delete/:id",isLoggedin, controllerApp.destroy);
//todo Approval
app.get("/approved",async (req, res,next)=>{
  //  let list = await listing.find({approved: false});
  let list = await listing.find({ approved: false });
if (!Array.isArray(list)) {
   list = []; // Ensure it's always an array
}
  res.render("approved.ejs",{list})
})
app.post("/approved/:id", async(req, res, next)=>{
  const {id} = req.params;
  let list = await listing.findByIdAndUpdate(id, {approved: true}, {new: true});
  console.log( list);
  res.render("approved.ejs",{list});
})
//todo app.all is used to accept all the request from any server
app.all("*", (req, res, next )=>{
 res.render("about.ejs");
  // next(new myError(400, 'please recheck root '));
})
app.use((err, req, res , next)=>{
  let {status , message} = err;
  res.render("error.ejs" , {status, message});
});