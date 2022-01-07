require("dotenv").config();
const express = require("express");
const db = require("./db/conn");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const router = require("./routers/router");


const path  = require("path");
const hbs = require("hbs");
// if we use html files from public folder

const static_path = path.join(__dirname,'../public')
app.use(express.static(static_path))

// if we want to use template engine HBS(handle bars engine) views folder
const template_path = path.join(__dirname,'../templates/views')
const partials_path = path.join(__dirname,'../templates/partials')

app.set("view engine", "hbs")
app.set("views",template_path);
hbs.registerPartials(partials_path)


const PORT = process.env.PORT || 8000;

app.use(router)



app.listen(PORT,()=>{
    console.log(`Application running at port ${PORT}`)
});