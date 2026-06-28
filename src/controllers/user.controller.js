import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/Apierror.js"
import {user, user} from "../models/user.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js";
import {Apiresponse} from "../utils/Apiresponse.js"
import jwt from "jsonwebtoken"

const generateaccessandrefreshtoken=async (userid)=>{
  try{
const fetch_user=await user.findById(userid)
const acccessToken=fetch_user.generateAccessToken()
const refreshToken=fetch_user.generateRefreshToken()

fetch_user.refreshToken=refreshToken
await fetch_user.save({validateBeforeSave:false})

return {acccessToken,refreshToken}

  }
  catch(error){
throw new ApiError(500,"unknown error occured")
  }
}

const registeruser=asyncHandler(async(req,res)=>{
  // FETCH USER DETAILS FROM FRONTEND
  const {fullname,email,username,password}=req.body
  // console.log("BODY:", req.body)
  // console.log("FILES:", req.files)

 if(
  [fullname,email,username,password].some((field)=>
          !field || field.trim()==="")
){
  throw new ApiError(400,"ALL FIELDS REQUIRED")
}
 const existeduser=await user.findOne({
  $or:[{username},{email}]
 })
 if (existeduser){
  throw new ApiError(409,"USER ALREADY EXISTS FOR THIS EMAIL")
 }
  const avatarlocalpath= req.files?.avatar[0]?.path
  const coverimagelocalpath=req.files?.coverimage[0]?.path

  if(!avatarlocalpath){
    throw new ApiError(400,"Avatar File is required1")
  }
  const avatar=await uploadoncloudinary(avatarlocalpath)
  const coverimage=await uploadoncloudinary(coverimagelocalpath)
if (!avatar){
  throw new ApiError(400,"Avatar File is required2")
}
const user_fetched=await user.create({
  fullname,
  avatar:avatar.url,
  coverimage:coverimage?.url||"",
  email,
  password,
  username:username.toLowerCase()
})

const createduser =await user.findById(user_fetched._id).select(
  "-password -refreshToken"
)

if (!createduser){
  throw new ApiError(500,"SOMETHING WENT WRONG")
}

return res.status(201).json(
  new Apiresponse(200,createduser,"USER REGISTERED successfully")
)

})

const loginuser=asyncHandler(async(req,res)=>{
  // req body ->data
  // username or email
  // find user 
  // password check
  // access and refresh token 
  // send cookie 
  const {email,username,password}=req.body
  if (!username && !email){
    throw new ApiError(400,"username or email is required")
  }
 const fetch_user=await user.findOne({
  $or:[{username},{email}]
 })

if (!fetch_user){
throw new ApiError(404,"user does not exist")
 }
 const ispasswordvalid=await fetch_user.ispasswordcorrect(password)

 if (!ispasswordvalid){
  throw new ApiError(401,"Invalid credentials")
 }
 
const {acccessToken,refreshToken} = await generateaccessandrefreshtoken(fetch_user._id)

const loggedinuser=await user.findById(fetch_user._id).
select("-password", "-refreshToken")

const options={
  httpOnly:true,
  secure:true
}
return res
.status(200)
.cookie("accessToken",acccessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new Apiresponse(
    200,
    {
      user:loggedinuser,
      acccessToken,
      refreshToken
    },
    "user logged in successfully"
  )
)
})

const logoutuser=asyncHandler(async(req,res)=>{

await user.findByIdAndUpdate(
  req.user._id,
  {
$unset: { refreshToken: 1 }
  },
  {
    new:true
  }
)

const options ={
  httpOnly:true,
  secure:true
}

return res.status(200).clearCookie("accessToken",options)
.clearCookie("refreshToken",options).json(new Apiresponse(200,{},"user logged out"))
})


const refreshaccesstoken=asyncHandler(async(req,res)=>{
  try {
const incomingrefreshtoken=req.cookies.refreshToken
  if (incomingrefreshtoken){
    throw new ApiError(401,"unauthorized request")
  }
  const decodedtoken=jwt.verify(
    incomingrefreshtoken,
    process.env.REFRESH_TOKEN_SECRET
  )
  const user =await user.findById(decodedtoken?._id)
  if(incomingrefreshtoken!==user?.refreshToken){
    throw new ApiError(401,"Refresh token is expired")
  }
  const options ={
    httpOnly:true,
    secure:true
  }
  const {acccessToken,newrefreshToken}=await  generateaccessandrefreshtoken(user._id)
  return res.status(200)
  .cookie("accessToken",acccessToken,options)
  .cookie("refreshToken",newrefreshToken,options).
  json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken:newrefreshToken
      },
      "ACCESS TOKEN REFRESHED"
    )
  )  
  } catch (error) {
    throw new ApiError(401,error?.message||"Invalid refresh token")
  }
})

export {registeruser,loginuser,logoutuser,refreshaccesstoken}