import express from "express";
const app= express()
import cors from "cors";
import cookiesParser from "cookie-parser";
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookiesParser())

// routes import 
import userrouter from './routes/user.router.js'

// routes declaration
app.use("/api/v1/users",userrouter)

export {app}