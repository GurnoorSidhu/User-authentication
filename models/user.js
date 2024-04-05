const mongoose = require("mongoose");
const { createHmac,randomBytes } = require('crypto');
const {generateTokenForUser} = require("../services/auth")

const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        default:"user",
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    }
},{timestamps:true});


UserSchema.pre("save", function (next){
    const user = this;
    if(!user.isModified("password")) return next();
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
    return next();
})

UserSchema.static("matchPasswordandGenerateToken", async function (email, password) {
    const user = await this.findOne({ email: email });
    if (!user) {
        return { error: "User Not Found!" };
    }
    
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest('hex');
    
    if (hashedPassword !== userProvidedHash) {
        return { error: "Wrong Password!" };
    }
    
    const token = generateTokenForUser(user);
    return token;
});

const User = mongoose.model("user",UserSchema);

module.exports = User;