import { asyncHandler } from "../utils/asynchandler";

const registeruser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})

export {registeruser}