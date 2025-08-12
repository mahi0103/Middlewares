const express = require('express');
const validate = require('express-validator');
const body = validate.body;
const validationResult = validate.validationResult;
//const {body,ValidationRes} = require('express-validator');  //single line with destructering;
const app = express();

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
  { name: "John", age: 30 }];
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