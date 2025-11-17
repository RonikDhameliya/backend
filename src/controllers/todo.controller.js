import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.models.js";
import { User } from '../models/user.models.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { SubTodo } from "../models/subTodo.models.js";



const createTodo = asyncHandler( async (req, res) => {
    const {title, description, complete } = req.body;

    if([title, description].some((field)=> field.trim() === "")){
        throw new ApiError(400, "title and description is required : todo.controller");
    }

    const existTodo = await Todo.findOne({
        title
    })

    if(existTodo){
        throw new ApiError(409, "This Todo Title is Already Exist : todo.controller");
    }

    const todo = await Todo.create({
        title,
        description,
        complete,
        createdBy: req.user._id ,
    })

    const createdTodo = await Todo.findById(todo?._id);
    console.log(createdTodo);
    if(!createdTodo) {
        throw new ApiError(500, "something Went Wrong While Make a Todo : todo.controller");
    }

    return res.status(200).json(new ApiResponse(200, {todo}, "Todo Created Successfully"))
})

const getTodos = asyncHandler( async (req, res) => {

    const loggedInUser = req.user?._id;

    const todos = await Todo.find({
        createdBy : loggedInUser,
    })

    if(!todos.length){
        res.status(200).json( new ApiResponse(200, {}, "No Todo for this User ID"))
    }
    
    res.status(200).json( new ApiResponse(200, todos, "todo fetched successfully"));
});

const updateTodo = asyncHandler( async (req, res) => {
    const todoId = req.query?.todoid;

    const isValidTodoId = mongoose.Types.ObjectId.isValid(todoId)

    if(!isValidTodoId){
        throw new ApiError(401, "Invalid Todo ID : todo.controller")
    }

    const {title, description, complete} = req.body
    if([title, description, complete].some((field)=> field === "")){
        throw new ApiError(401, "All field are Required : todo.controller")
    }

    const todo = await Todo.findById(todoId)

    const existedTitle = await Todo.findOne({
        title
    })
    if(existedTitle){
        throw new ApiError(409, "This title is Existed : todo.controller")
    }
    if(title){
        todo.title = title;
    }
    if(description){
        todo.description = description;
    }
    if(complete){
        todo.complete = complete;
    }
    
    todo.save({validateBeforeSave : false});
    res.status(200).json(new ApiResponse(200, {todo}, "successfull update : todo"))
})


const deleteTodo = asyncHandler( async (req, res) => {
    let {deleteTodoIds} = req.body;
    
    if(!Array.isArray(deleteTodoIds)){
       deleteTodoIds = [deleteTodoIds];
    }

    // const invalidTodoId = await Todo.find({
    //     $and : [
    //         {_id : {$in : deleteTodoIds}},
    //         {createdBy : {$ne : req.user?._id}}
    //     ]
    // })
    // // console.log(invalidTodoId , "------------- invalidTodoId");
     
    // if(invalidTodoId.length){
    //     throw new ApiError(401, `Invalid todo id please check ID array: todo.controller`)
    // }
    
    const invalidId = deleteTodoIds?.filter((todoId)=>{
         if (!mongoose.Types.ObjectId.isValid(todoId)) {
             return todoId;
         }
     })

    if(invalidId.length){
        throw new ApiError(400, 'Invalid Id from Todo, for Deleting Todo')
    }

    const todos = await Todo.find({
        $and : [
            { createdBy : req.user?._id },
            { _id : {$in : deleteTodoIds}}
        ]
    });   
    const allSubtodoId = todos.flatMap(todo => todo.subTodos)
    console.log(allSubtodoId);
    const todoIds = todos.map((todo) => todo._id);
    console.log(todoIds);

    const responseDltSubTodo = await SubTodo.deleteMany({_id : {$in : allSubtodoId}})
    const countDltSubTodo = responseDltSubTodo.deletedCount;

    const responseDltTodo = await Todo.deleteMany({_id : { $in : todoIds }});
    const countDeleteTodo = responseDltTodo.deletedCount;
    res.status(200).json( new ApiResponse(200, {countDeleteTodo, countDltSubTodo}, "Delete Todo Successfully"))

})

export { createTodo, getTodos, deleteTodo, updateTodo }