const bcrypt = require("bcryptjs");

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Register = require("../models/mearnstackschema");

router.get("/", (req, res) => {
    res.render("index") // use render instead of send for template engine HBS(handle bars engine)
})

router.get("/login", (req, res) => {
    res.render("login") // use render instead of send for template engine HBS(handle bars engine)
})

router.get("/register", (req, res) => {
    res.render("register") // use render instead of send for template engine HBS(handle bars engine)
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

            const token = await registerEmployee.generateAuthToken();
            const employee = await registerEmployee.save()
            res.status(201).render("index")

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

        const token = await user.generateAuthToken();
        if (isMatch) {
            res.status(200).render("index");
        } else {
            res.status(400).send("Invalid login details");
        }
    } catch (e) {
        res.status(400).send("Invalid login details")
    }
})



module.exports = router;