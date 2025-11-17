import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js" 
import { User } from '../models/user.models.js'
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import { Todo } from '../models/todo.models.js';
import { SubTodo } from '../models/subTodo.models.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log('user', user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While Token Generating")
    }
}


const registerUser = asyncHandler( async (req, res) => {

    // check all field are fiiled
    // check user are already exitst or not if already exist then throw err
    // create user and check user document/record is create or not 
    // send a message user create successfully


    const {userName, email, password} = req.body
    if([userName, email, password].some((field) => field.trim() === "")){
        throw new ApiError(400, 'All Field is required')
    }
    // console.log(req.body, "<-- req.body");

    const existedUser = await User.findOne({
        $or : [{ userName }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "Already Account Created for this UserName Or E-mail.");
    }

    const profilePicLocalPath = req?.file?.filename;
    // console.log(req?.file, "<-- req.file");

    if (!profilePicLocalPath) {
        throw new ApiError(400, "profilePic is Must be required")
    }
    const dest = req?.file?.destination;
    const profilePic = await uploadOnCloudinary(dest+'/'+profilePicLocalPath);
    // console.log(profilePic);

    if(!profilePic){
        throw new ApiError(400, "profilePic is Must be required")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        profilePic: profilePic.url
    })
    // console.log(user, "<---- user ");

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, 'something went wrong while Signing')
    }


    return res.status(201).json(
        new ApiResponse(200, {createdUser}, "user registred successfully")
    )

})

const loginUser = asyncHandler( async (req, res) => {
    // console.log("req", req); 
    const {email, password } = req.body
    if([email, password].some( field => field.trim() === "")){
        throw new ApiError(401, "Username and Passwrod Must be Required")
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(404, 'Email does not Exist');
    }

    const varifiedUser = await user.isPasswordCorrect(password);

    if(!varifiedUser){
        throw new ApiError(401, "Email or Password is Wrong")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,
    }

    res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
        new ApiResponse(200, {loggedInUser, refreshToken, accessToken},
        "User Logged In" 
        )
    )

})

const logout = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            refreshToken : undefined
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(
        new ApiResponse(200, {}, "User Logged Out")
    )

})

const updatePassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body

    if(
        [newPassword, oldPassword]
        .some((field)=> field.trim() === "")
    ){
        throw new ApiError(401, 'Password Field is Required')
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid Old Password');
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false})

    res.status(200).json( new ApiResponse(200, {}, "Password Change Successfully"))

})

const getCurrUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if(!user){
        new ApiError(401, 'Email does not exist');
    }

    res.status(200).json( new ApiResponse(200, { user }, "User Fetche Successfully"));

})

const changeEmail = asyncHandler( async (req, res) => {
    const {userName} = req.body;

    if(userName.trim() === ""){
        throw new ApiError('userName filed is Required');
    }
    const existedUser = await User.findOne({userName});
    
    if (existedUser) {
        throw new ApiError(409, "this Username Already Exist Please Change Your Username.")
    }
    // const user = await User.findById(req.user?._id);
    // user.userName = userName;
    // await user.save({validateBeforeSave : false});

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            userName
        },
        {
            new : true
        }   
    ).select("-password -refreshToken");

    res
    .status(200)
    .json( new ApiResponse(200, { user }, "Username Changed Successfully"))
})

const updateProfilePic = asyncHandler( async (req, res) => {

    const profilePicLocalPath =  req.file?.path 

    if(!profilePicLocalPath){
        throw new ApiError(400, "Profile iamge is missing")
    }
    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    if (!profilePic) {
        throw new ApiError(400, 'Error while file uploading.')
    }
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    const oldPath = user.profilePic;
    deleteOnCloudinary(oldPath);

    user.profilePic = profilePic.url;
    user.save({validateBeforeSave : false});

    res
    .status(200)
    .json(new ApiResponse(200, {user} , "profile pic Update Succssfully"))

})

const deleteUser = asyncHandler( async (req, res) => { 
    const userId = req.user?._id;

    const todos = await Todo.find({
        createdBy : userId
    })
    const todoIds = todos.map(todo => todo._id)

    const allSubtodoId = todos.flatMap(todo => todo.subTodos)

    const responseDltSubTodo = await SubTodo.deleteMany({_id : {$in : allSubtodoId}})
    const countDltSubTodo = responseDltSubTodo.deletedCount;

    const responseDltTodo = await Todo.deleteMany({_id : { $in : todoIds }});
    const countDeleteTodo = responseDltTodo.deletedCount;

    await User.deleteOne({_id : req.user?._id})
    res.status(200).json(new ApiResponse(200, {userHaveBeenTodo : countDeleteTodo, UserHaveBeenTotalSubTodo : countDltSubTodo}, "Sucesss : user.controller"))
})

export { registerUser, loginUser, logout, updatePassword, getCurrUser, changeEmail, updateProfilePic, deleteUser}