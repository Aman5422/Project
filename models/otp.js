const mongoose =require("mongoose")




const otpSchema = new mongoose.Schema({
    email:String,
},{
    timestamps:true
})

module.exports = new mongoose.model("Otp", otpSchema);