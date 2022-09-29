const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/adminDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  name:{
    type:String,
    required:true
  },
  address:
  {
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  password: {
type: String,
required:true,
  },
 
  role:String,
});


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("login");
  });


  
  app.get("/register", function(req, res){
    res.render("register");
  });
  
  app.get("/logout", function(req, res){
    res.redirect("/");
  });

  app.post("/register",(req,res)=>{
    const newUser=new User({
name:req.body.name,
address:req.body.address,
username:req.body.username,
password:req.body.password,
role:req.body.role
    });

    newUser.save((err)=>{
      if(err){
        console.log(err);
      } else {
        res.render("login");
          
      }
    });
  });

app.post("/login",(req,res)=>{
  const username=req.body.username;
 const password=req.body.password;

 User.findOne({username:username},(err,foundUser)=>{
  if(err){
    console.log(err)
  } else {
    if(foundUser){
      if(foundUser.password===password){
        
            res.render("userdetails",{
              role:foundUser.role,
          name:foundUser.name,
          address:foundUser.address,
          username:req.body.username,
            })
      }
    }
  }
    });

        });
      


app.get('/alluser', function(req, res) {
  User.find({}, function(err, Users){
    if (err)
        return done(err);

    if (Users) {
      res.render('alluser.ejs', {
        usersArray: Users
     
      });
    }
  });
});




  app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });