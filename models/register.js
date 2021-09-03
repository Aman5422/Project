const mongoose=require("mongoose")

const TodoSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,

    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique:true
    },
    password : {
        type: String,
        required: true,
    },
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

// TodoSchema.methods.createPasswordResetToken = function(){
//     const resetToken = crypto.randomBytes(32).toString('hex')

//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     console.log({resetToken}, this.passwordResetToken)
//     this.passwordResetExpires=Date.now() + 10 + 60 +1000;

//     return resetToken;
// }
    
module.exports = new mongoose.model("Register", TodoSchema);