// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js'
import {app} from './app.js'

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||4500,()=>{
        console.log(`server is running at port:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongo db connection failed !!!", err);
})






/*
const app= express()

;(async () => { 
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("error: application not able to talk",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error('ERROR',error)
        throw error
    }
})() 
*/





