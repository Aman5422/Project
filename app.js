//module import
const express =require("express")
const app =express();
const port = process.env.PORT || 3016;
const hbs =require("hbs");
const mongoose =require('mongoose')
const validate =require("validator")



// use for encryption
const bcrypt = require("bcrypt")
const path = require("path")


// database connection
var connection = require("./db/database");
const Register = require("./models/register")
const Otp = require("./models/otp")


app.use(express.urlencoded({ extended: true }));
app.use(express.json())


//set template engine
const template_path = path.join(__dirname, "./templates/views")
app.set("view engine", "hbs")
app.set("views", template_path)



// servers 
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login' ,async (req, res) =>{
    try{
        const email =req.body.email;
        const password=req.body.password;
        console.log(password)
        const useremail = await Register.findOne({email:email}) 
        console.log(useremail)
        if(useremail.password === password){
            res.status(201).render("successful")
        }else{
            res.send("invalid login details")
        }
    } catch (error) {
        res.status(400).send("invalid login details")
    }
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.post('/register', async (req, res) => {
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const todoTask=new Register({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        password: req.body.password
    })
    todoTask.save()
    .then(result=> {
        console.log(result)
        res.redirect("/login")
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})


app.get("/forget-password" ,(req, res, next) =>{
    res.render("forget-password")
})

app.post("/forget-password" , async (req, res, next) =>{

    console.log(req.body.email)
    const data = await Register.findOne({email:req.body.email})
    const responseType ={};
    if (data){
        const otpData = new Otp({
            email:req.body.email,
        })
        otpData.save()
        .then(result=> {
            console.log(result)
            res.redirect("/reset-password")
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        })
        
    }else{
        responseType.statusText = 'error'
        responseType.message = 'email id not exist'
    }


})


app.get("/reset-password" , (req, res)=> {
    res.render("reset-password")
})


app.post("/reset-password" , async (req, res, next) =>{
    password=req.body.password
    confirmpassword =req.body.cpassword
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)

    if (password == confirmpassword){
        const user = await Register.findOne({email:req.body.email})
        user.password=password
        await user.save({ validateBeforeSave: false});
        res.redirect('/login')
    }else{
        res.redirect("/reset-password")
    }
})


//get all data
app.get("/all" ,(req,res) => {
    Register.find()
    .then(result => {
        res.status(200).json({ data : result})
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({ error : err })
    })
})


//apply condition
app.get("/single/:data", (req,res) => {
    console.log(req.params.data)
    var query = undefined   
    if (req.query.name){
        query = {"name": req.query.name}
    }
    if (req.query.email){
        query = {"email": req.query.email}
    }
    if (req.query._id){
        query = {"_id": req.query._id}
    }
    else {
        Register.find(query)
        .then(result=>{
            res.status(200).json({
                result:result
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error:"err"
            })
        })
    }

    
})

//update data
app.put("/edit/:id", (req,res,next) => {
    console.log(req.params.id)
    Register.findOneAndUpdate({_id:req.params.id}, {
        $set:{
            name:req.body.name,
            email:req.body.email,
        }
    })
    .then(result=>{
        res.status(200).json({
            updated_Register:result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

//delete data
app.delete("/delete/:id", (req, res,next) => {
    Register.remove({_id:req.params.id})
    .then(result => {
        res.status(200).json({
            message: "record deleted..",
            result:result
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})




// listen server
app.listen(port, () =>{
    console.log(`server is running at port  no ${port}`)
})