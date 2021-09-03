const mongoose =require("mongoose")

mongoose.connect("mongodb://localhost:27017/backend",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex:true
})
.then( () => console.log("connection database successfully...."))
.catch((error) => console.log(error))