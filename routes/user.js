
import express, { Router } from "express";
import User from "../models/user.js"; 
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
 const router = express.Router();
import isLoggedin from '../middleware.js';

 router.get("/signup", (req, res)=>{
    res.render ("user/signup.ejs");
 })
 router.post("/signup",async(req, res)=>{
    try{

        let {user} = req.body;
        let user1 = new User({
            username: user.username,
            email: user.email,
        })
       let registeredUser=  await User.register(user1, user.password);
    //    console.log(user);
       req.login(registeredUser, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "You successfully logged in");
            res.redirect("/listing");
        }
       })
        //  req.flash("success", "congratulation you registered successfully");
         console.log(registeredUser);
        //  res.redirect("/listing");
    } catch(err){
        req.flash("error" , "Something went wrong")
        console.log(`Error is ${err}`);
        res.redirect("/signup");
    }
 })
 router.get("/login", async(req, res)=>{
     res.render("user/login.ejs");
 })
 router.post("/login", saveRedirectUrl,  passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), async(req, res)=>{
    req.flash("success", "You logged in successfully");
    let redirectUrl = res.locals.redirectUrl || "/listing" // it means that if res.redirectUrl exist then firstly saved that otherwise saved /listing in redirectUrl;
  res.redirect(redirectUrl);
 })
 router.get("/logout",(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success", "you logged out successfully");
            res.redirect("/listing");
        }
    })
 })
 export default router;