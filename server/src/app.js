import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    // origin:["http://localhost:5173"],
    origin:["https://feedback-f65j.onrender.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials:true
}))
app.use(express.json({limit:"200mb"}))
app.use(express.urlencoded({extended:true,limit :"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import tweetRouter from "./routes/tweet.routes.js";

app.get("/", (req, res) => res.send("Backend of Streamify"));
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tweets", tweetRouter);


export{app};