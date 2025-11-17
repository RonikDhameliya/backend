import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";


export const varifyJWT = asyncHandler( async(req, res, next)=>{
    const  token = req.cookies?.accessToken || 
            req.header('Authorization')?.replace("Bearer ", "");
    
    if(!token){
        throw new ApiError(401, "Unauthorized reques : auth.middelware");
    }

    const decordedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decordedToken?._id).select('-password -refreshToken');

    if(!user){
        throw new ApiError(401, "Invalid Access Token  : auth.middleware")
    }

    req.user = user;
    next()

})
