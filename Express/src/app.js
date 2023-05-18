const express=require("express");
const moment = require("moment")
const app=express();
const port=process.env.port || 3000
const path=require("path");
const bcrypt = require('bcrypt');
const hbs=require("hbs")
const mypublic=path.join(__dirname,"../public");
const mypartials=path.join(__dirname,"../partials");
app.use(express.urlencoded({extended:false}));
app.use(express.static(mypublic));
app.set("view engine","hbs")
hbs.registerPartials(mypartials);
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
await mongoose.connect('mongodb+srv://monug1513:monu123@mangement.4fzmmsn.mongodb.net/');
}
const teacherSchema = new mongoose.Schema({
    firstname: String,
    lastname:String,
    emailid:String,
    mobilenumber:Number,
    password:String,
    confirmpassword:String,
    newpassword:String
});
const Teacher = mongoose.model('Teacher',teacherSchema);





// studentinfo

const studentSchema = new mongoose.Schema({
  name:String,
  rollno:Number,
  class:String

});
const Student = mongoose.model('Student',studentSchema);


// studentattendance


const attenSchema = new mongoose.Schema({
  name:String,
  rollno:Number,
  class:String,
  radio:String,
  date:{
  type:String,
  

  }

});
const Atten = mongoose.model('Atten',attenSchema);


app.get("/",(req,res)=>{

res.render("index")

})
app.get("/about",(req,res)=>{
res.render("about")


})
app.get("/contact",(req,res)=>{

res.render("contact")

})


app.get("/teachersign",(req,res)=>{
res.render("teachersign")
})
app.post("/teachersign",async(req,res)=>{ 
const emailid=req.body.emailid
const password=req.body.password

const check=await Teacher.findOne({emailid})
if(check==null){

const founderror="Emailid Not Found Please Create Account First."
res.render("teachersign",{founderror})

}
else{

  if(check.emailid===emailid){
    if(check.password==password){
    
    res.send("login")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    
    
    }
    else{
    
    const passerror="Emailid either Password Not Match"
    res.render("teachersign",{passerror})
    
    
    
    }}
   
}

})
app.get("/teachersignup",(req,res)=>{
res.render("teachersignup")
})

app.post("/teachersignup",async(req,res)=>{
const password=req.body.password
const confirmpassword=req.body.confirmpassword
const mysecure=await bcrypt.hash(password,10)
if(password===confirmpassword){
res.render("teachersign")
}
else{
  const passntmatch="Password And Confirmpassword Not Match"
  res.render("teachersignup",{passntmatch})
}


const teacherinfo = new Teacher({ 
  firstname:req.body.firstname,
  lastname:req.body.lastname,
  emailid:req.body.emailid,
  mobilenumber:req.body.mobilenumber,
  password:mysecure,
  confirmpassword:mysecure,
  newpassword:req.body.newpassword
});
teacherinfo.save()
})

app.get("/teacherforget",(req,res)=>{

res.render("teacherforget")


})
app.post("/teacherforget",async(req,res)=>{
  const emailid=req.body.emailid
  const newpassword=req.body.newpassword
  const data=await Teacher.findOne({emailid})
  if(data==null){

    res.send("Emailid Not Found Please Create Account First.")

  }
  else
  {
    if(data.emailid==emailid){
    const update=await Teacher.findOneAndUpdate({emailid},{$set:{password:newpassword}})
  
    }
  }
  
})








app.get("/show",async(req,res)=>{
  
const data=await Atten.find()
console.log(data)
res.render("show",{data})
})

const searchSchema = new mongoose.Schema({
  search:String

});
const search = mongoose.model('search',searchSchema);


// searchbydate
app.get("/search",async(req,res)=>{

res.render("search")
})
app.post("/search",async(req,res)=>{
var date=req.body.date

date = moment(date).format('M/DD/YYYY')
console.log(date)
const radiocheck=await Atten.find({date})

if(radiocheck!==null){

  res.render("search",{radiocheck})
  // console.log(radiocheck)
// console.log("date found")

}
else{

// console.log("date not found")


}
 




  })
















// addstundent\
app.get("/addstudent",(req,res)=>{
res.render("addstudent")

})
app.post("/addstudent",async(req,res)=>{
  const studentinfo = new Student({ 
    name:req.body.name,
    rollno:req.body.rollno,
    class:req.body.class,
    
  });
  await studentinfo.save()
  res.render("index")

})


























// classinformation
app.get("/attendance",async(req,res)=>{
const data=await Student.find()
res.render("attendance",{data})
})

app.post("/attendance",async(req,res)=>{
const rollno=req.body.rollno
let date=new Date()
date=date.toLocaleDateString("en-US")
const radiocheck=await Atten.findOne({rollno})
console.log(radiocheck)
if(radiocheck===null){
  const studentatten=new Atten({
  name:req.body.name,
  class:req.body.class,
  radio:req.body.radio,
  rollno:req.body.rollno,
  date:date
  })
 
  await studentatten.save()
  console.log("date not match")
} else if(radiocheck.date!==date&radiocheck.rollno!==rollno)
{
  const studentatten=new Atten({
    name:req.body.name,
    class:req.body.class,
    radio:req.body.radio,
    rollno:req.body.rollno,
    date:date
    })
   
    await studentatten.save()
    console.log("date not match")
}
else{


console.log("date match")



}



})
















// adminimformation here
app.get("/adminsignup",(req,res)=>{
res.render("adminsignup")
})

app.get("/adminlogin",(req,res)=>{

res.render("adminlogin")

})
app.post("/adminlogin",async(req,res)=>{
  const emailid=req.body.emailid
  const password=req.body.password
  const check=await Teacher.findOne({emailid})
  if(check==null){
  
  const founderror="Emailid Not Found. Please Create Account First."
  res.render("teachersign",{founderror})
  
  }
  else{
  
    if(check.emailid===emailid){
      if(check.password==password){
      
      res.send("login")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      
      
      }
      else{
      
      const passerror="Emailid either Password Not Match"
      res.render("adminlogin",{passerror})
      
      
      
      }}
     
  }
  



})
app.get("/adminforget",(req,res)=>{

res.render("adminforget")

})

app.post("/adminlogin",async(req,res)=>{
  
  const emailid=req.body.emailid
  const newpassword=req.body.newpassword
  const data=await Teacher.findOne({emailid})
  if(data==null){
   const signup="Emailid not found Please signup"
    res.render("adminlogin",{signup})

  }
  else
  {
    if(data.emailid==emailid){
    const update=await Teacher.findOneAndUpdate({emailid},{$set:{password:newpassword}})

  
    }

  }
  
  
})








app.listen(port,(req,res)=>{

console.log("Running on Port 3000")



})