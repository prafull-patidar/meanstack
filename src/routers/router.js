const bcrypt = require("bcryptjs");

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Register = require("../models/mearnstackschema");

const cookie_parser = require("cookie-parser");
const auth = require("../middlewaare/auth");
const { append } = require("express/lib/response");
const async = require("hbs/lib/async");

router.get("/", (req, res) => {
    res.render("index") // use render instead of send for template engine HBS(handle bars engine)
})

router.get("/login", (req, res) => {
    res.render("login") // use render instead of send for template engine HBS(handle bars engine)
})

router.get("/register", (req, res) => {
    res.render("register") // use render instead of send for template engine HBS(handle bars engine)
})

// page for only JWT authentification purpose
router.get("/secretpage", auth,  (req, res) => {

  
        res.render("secret")
    
    // use render instead of send for template engine HBS(handle bars engine)
})



router.post("/register", async (req, res) => {
    try {
        if (req.body.password === req.body.confirmpassword) {
            const registerEmployee = await new Register({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                address: req.body.address,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            // const token = await registerEmployee.generateAuthToken();

            // res.cookie("jwt",token,{
            //     expires:new Date(Date.now() + 300000),
            //     httpOnly:true,
            // // secure:true works only when site is secured(htpps)
            // });

            const employee = await registerEmployee.save()
            res.status(201).render("login")

        } else {
            res.status(400).send("Password Does not match")
        }
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post("/login", async (req, res) => {
    try {

        const user = await Register.findOne({ email: req.body.email });
        const isMatch = await bcrypt.compare(req.body.password, user.password);

       
        if (isMatch) {
            const token = await user.generateAuthToken();
            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 300000), //expires after 5 minutes 
                httpOnly:true, //user can not modify cookie
                // secure:true works only when site is secured(htpps)
            });
            res.status(200).redirect("secretpage");
        } else {
            res.status(400).send("Invalid login details");
        }
    } catch (e) {
        res.status(400).send("Invalid login details")
    }
})


router.get("/logout",auth, async (req,res)=>{
    try{
        res.clearCookie("jwt");
        req.user.tokens = []
        await req.user.save();
        res.redirect("login");
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})


module.exports = router;