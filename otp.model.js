const mongoose = require("mongoose");



const OtpSchema = new mongoose.Schema({
    uuid: String,
    otp: String
});




module.exports = 
mongoose.model("otps", OtpSchema);