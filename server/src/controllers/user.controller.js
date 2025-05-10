import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt  from 'jsonwebtoken'
import mongoose from 'mongoose'



const generateAccessAndRefereshTokens = async (userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken =user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave :false})
        return{accessToken , refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    //get user detail from frontend
    //validation
    //check if user already exists: username,email
    //check for image, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response

 
    const {fullName, email, username, password} = req.body
    console.log("email",email);
    
    // if(fullName===""){
    //     throw new ApiError(400,"fullname is required")
    // }

    if([fullName,email,password,username].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"fullname is required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    console.log("existeduser" ,existedUser)

    if(existedUser){
        throw new ApiError(409,"user with email or username already exist")
    }

    
    const avatarlocalpath = req.files?.avatar[0].path;
    // const coverImagelocalpath = req.files?.coverImage[0].path;
    console.log("req.files",req.files);

    let coverImagelocalpath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImagelocalpath= req.files?.coverImage[0].path;
    }
    
    if(!avatarlocalpath){
        throw new ApiError(400,"avatar files is required")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverImagelocalpath)

    if(!avatar){
        throw new ApiError(400,"avatar files is required")
    }

    const user  = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url ||"",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    //req.body-> data
    //username or email
    //find the user
    //password check
    // access and refresh token
    //send cookie

    const {email, username, password} = req.body;


    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"inavalid user credentials")
    }

    const {refreshToken,accessToken}=await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )



})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{}, "user logged out"))



})

const refreshAccessToken = asyncHandler(async( req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired or used")
        }
    
        const options ={
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken, 
    getCurrentUser, 

}