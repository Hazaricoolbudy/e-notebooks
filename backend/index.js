const connectToMongo=require('./db')
const express=require('express')
const port= process.env.PORT|| 8000;

connectToMongo();

const app=express()
app.use(express.json())

// avaliable Router 
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))




app.listen(port, ()=>{
    console.log('hello from the other side');
})



