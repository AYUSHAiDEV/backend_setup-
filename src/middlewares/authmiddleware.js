import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError} from "../utils/Apierror.js";
import jwt from "jsonwebtoken"
import {user} from "../models/user.model.js"

export const verifyjwt=asyncHandler(async(req,res,next)=>{
try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unathorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const fetch_user = await user.findById(decodedToken?._id).
        select("-password" ,"-refreshToken")
        if(!fetch_user){
            throw new ApiError(401,"INVALID ACCESS")
        }
        req.user=fetch_user 
        next()
} catch (error) {
    throw new ApiError(401,error?.message||"INVALID TOKEN")
}
})