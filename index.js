const express = require("express");
require("./conn.js")
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const User = require('./models/userModles.js')
const Blog =  require('./models/userBlogs.js')
const app = express();
const dotenv = require('dotenv');
const port = process.env.PORT||8000
const router = express.Router(); 
const bcrypt  = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_TOKEN = 'Hiten_Is_GoodBoy';
dotenv.config();

mongoose.connect(process.env.url)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Your code here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.use(router);

router.get("/AllBlogs", async(req, res)=>{
    const getAll = await Blog.find()
    console.log("hello Home");
    res.send(getAll)
})

router.post("/AllBlogs/add", async(req, res)=>{
  
  try {
    const addOne = await Blog(req.body)
    console.log("hello Home AddBlog");
    
    if(!addOne){
      res.send("error")
      
    }
    res.send(addOne);
    addOne.save();
  } catch (error) {
    res.status(500).json({error: "Not Found"}).send()
  }
})

router.get("/AllBlogs/:id", async(req, res)=>{
  try {
    const getOne = await Blog.findById(req.params.id);
    console.log("hello Home");
    
    if(!getOne){
      res.send("error")
    }
    res.send(getOne);
  } catch (error) {
    res.status(500).json({error: "Not Found"}).send()
  }
})

router.post("/AllBlogs/edit/:id", async(req, res)=>{
  const _id = req.params.id;
  try {
    const updateOne = await Blog.findByIdAndUpdate(_id, {blog: req.body});
    console.log("hello Home edit");
    
    if(!updateOne){
      res.send("error")
    }
    res.send(updateOne);
  } catch (error) {
    res.status(500).json({error: "Not Found"}).send()
  }
})



router.delete("/AllBlogs/delete/:id", async(req, res)=>{
  const _id = req.params.id;
  try {
    const deleteOne = await Blog.findByIdAndDelete(_id);
    console.log("hello Home delete");
    
    if(!deleteOne){
      res.send("error")
    }
    res.send(deleteOne);
  } catch (error) {
    res.status(500).json({error: "Not Found"}).send()
  }
})



router.get("/AllBlogs/comment", async(req, res)=>{
    const getAllCommment = await Blog.aggregate([
        {
          $project: {
            _id: 0, 
            comment: 1 
          }
        }
      ])
    console.log("hello Home");
    res.send(getAllCommment)
})


router.post("/AllBlogs", async(req, res)=>{
    const Allblog = await Blog(req.body);
    Allblog.save();
    console.log("hello Home");
    res.send(Allblog);
})

router.post("/SignUp", async(req, res)=>{
  
    try {
      console.log("hello SignUp Post");
    const data = await User(req.body);
    const salt =await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password, salt)
    const userData = await User({username: req.body.username, email: req.body.email, password: secPass});
    userData.save();
    const da = {
      user:{
         _id: userData._id
      }
    }
    const authToken = jwt.sign(da, JWT_TOKEN);
    console.log(da);
    
    res.send(authToken);
    } catch (error) {
      res.send(error).status(404).send()   
    }
})

router.post("/LogIn", async(req, res)=>{
  console.log("hello Log In Post", req.body.username);
  const{email} = req.body
  try {
    const data = await User.findOne({email,})
     
    if(data.length === 0){
      res.send("Invalid User").status(400)
    }
    
      const da={
       user: {
        id: data._id,
       }
      }
    const authToken = jwt.sign(da, JWT_TOKEN)
    console.log(authToken);
    res.json(authToken).send()
  } catch (error) {
    res.send("Bad Req").status(404)
  }
})



app.listen(port,()=>{
    console.log(`Hello Server is running ${port}`);
});