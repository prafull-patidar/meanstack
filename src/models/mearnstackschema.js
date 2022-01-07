const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validator = require("validator");
const res = require("express/lib/response");

const meanstackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        min: 10
    },
    gender: String,
    address: String,
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generate jwt token
meanstackSchema.methods.generateAuthToken = async function() {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = [];
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token
    } catch (e) {
        res.send(`error : ${e}`)
    }
}


// make password hash before save
meanstackSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword =  await bcrypt.hash(this.confirmpassword, 10);
    }

    next();
})


const meanModel = mongoose.model("Register", meanstackSchema)

module.exports = meanModel;