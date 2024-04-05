const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8000;
const {ConnectMongoDB} = require("./connection");
const {CheckforAuthCookie} = require("./middlewares/auth");
const router = require("./routes/user")


app.listen(PORT, console.log(`Server Running on ${PORT}`));
ConnectMongoDB("mongodb+srv://gurnoor8520:teradaddy420@cluster0.sffmssb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=> console.log("MongoDB Connected Successfully."))
    .catch((err)=>console.log("Error Connecting MongoDB",err));


app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(CheckforAuthCookie("token"));



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use("/user",router);

app.get("/",(req,res)=>{
    return res.render("home",{
        user:req.user,
    })
})