const express = require('express');
const axios = require('axios')
const app = express();
 
function Logger(req,res,next){
    console.log(`${req.method}`);
    console.log(`${req.url}`);
    next();
}

app.use(express.json());
let Users = [{ name: "Mahi", age: 24 },
  { name: "John", age: 30 }];
app.use(Logger);
app.get('/user',(req,res)=>{
    res.status(200).json(Users);
})

app.use(Logger);
app.post('/users',(req,res)=>{
    const user = req.body;
    Users.push(user);
    res.status(201).json({
        message: `${req.body.name} created success fully!`,
        user
    });
})

app.delete('/user/:name',(req,res)=>{
    const name = req.params.name;
    Users = Users.filter((user)=> user.name !== name);
  
    res.status(404).json({
        message:"user removed successfully",
        Users
    })
})
app.listen(3000,()=>{
    console.log('Server Connected!');
})