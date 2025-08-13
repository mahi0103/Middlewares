const express = require('express');
const validate = require('express-validator');
const body = validate.body;
const validationResult = validate.validationResult;

const usermodel = require('./mongo')
//const {body,ValidationRes} = require('express-validator');  //single line with destructering;
const app = express();


const mongoose = require('mongoose');
const { error } = require('console');

//Database connection!
mongoose.connect('mongodb+srv://Mahi:9390392440@learning-cluster.qfo520q.mongodb.net/User',
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // force TLS
    tlsAllowInvalidCertificates: false
  }
)
.then(()=>{console.log('Connected!')})
.catch
((err)=>{console.log(err)});
//Validation array 
const ValidateUser = [
    body('name')
    .notEmpty()
    .withMessage('Shoud=ld not empty!')
    .isString().withMessage('it should string'),

    body('age')
    .isInt().withMessage('is should number!')
]

function Logger(req,res,next){
    console.log(`${req.method}`);
    console.log(`${req.url}`);
    next();
}

app.use(express.json());
let Users = [{ name: "Mahi", age: 24 },
  { name: "John", age:30 }];
app.use(Logger);
app.get('/user',(req,res)=>{
    res.status(200).json(Users);
})

app.use(Logger);
app.post('/users', ValidateUser,(req,res)=>{

     const errors = validationResult(req); // it return as an array

    if (!errors.isEmpty()) { // if array is empty  the we goo to go!
        
        return res.status(400).json({ errors: errors.array() });
    }

    const user = req.body;
    Users.push(user);
    return res.status(201).json({
        message: `${req.body.name} created successfully!`,
        user
    });
})

app.post('/dbusers',async(req,res)=>{
    try{
        const user = await usermodel.create(req.body);
        return res.status(201).json({
            message:'User created!',
            user
        })
    } catch(err){
         res.status(401).json({error:err.message});
    }
})

app.get('/dbusers',async(req,res)=>{
    try{

        const user = await usermodel.find({});
         return res.status(200).json({data:user})

    }catch(err){
        return res.status(404).json({message:'Users not found!'})
    }
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