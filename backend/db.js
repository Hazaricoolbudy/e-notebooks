const mongoose=require('mongoose')
const mongoURI='mongodb://localhost:27017/enotebooks?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';


const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log(`connection sucessful`);
    })
}


module.exports=connectToMongo;