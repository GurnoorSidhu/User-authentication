const express  = require("express");
const app = express;
const router = app.Router();
const USER = require("../models/user");

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/signin",(req,res)=>{
    return res.render("signin");
})

router.post("/signin", async (req,res)=>{
    try {
        const {email,password} = req.body;
        const token = await USER.matchPasswordandGenerateToken(email,password);
        if (token.error === "User Not Found!") {
            return res.render("signin",{
                error:"User Not Found"
            });
        }
        if (token.error === "Wrong Password!") {
            return res.render("signin",{
                error:"Incorrect Password, Try Again!"
            });
        }
        return res.cookie("token",token).render("signin",{
            success:"Login Successfull!"
        });
    }
    catch(err){
        return res.redirect("/user/signin",{
            error:err.message
        });
    }
})

router.post("/signup",async (req,res)=>{
    const {fullName, email, password} = req.body;
    try {
        await USER.create({
            fullName,
            email,
            password,
        })
        return res.redirect("/user/signin");
    } catch (err) {
        if(err.code === 11000){
            console.log("Duplicate User Found !");
            return res.render("signup",{
                duplicateError:"Email Already Exists!"
            });
        }
    }
})

router.get("/admin",(req,res)=>{
    return res.render("admin",{
        user:req.user,
    })
})

router.get("/signout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports = router;