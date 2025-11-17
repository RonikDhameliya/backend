import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { SubTodo } from "../models/subTodo.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.models.js";
import mongoose from "mongoose";




const createSubTodo = asyncHandler( async (req, res) => {

    const {title, description, complete, mainTodoId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(mainTodoId)) {
        throw new ApiError(401, "Pleace Check Main Todo Id : subTodo.controller")
    }

    if(
        [title, description, mainTodoId]
        .some((field) => field.trim() === "")
    ){
        throw new ApiError(401, 'title and description, mainTodoId is required : subTodo.controller')
    }
    if(typeof complete !== "boolean"){
        throw new ApiError(401, "check please complete isn't Boolean: subTodo.controller")
    }
   
    const existingTodoOrUser = await Todo.find({
        $and : [
            {_id : mainTodoId},
            {createdBy : req.user?._id}
        ]
    })

    if(!existingTodoOrUser.length){
        throw new ApiError(401, "Invalid credential : subTodo.controller")
    }
        
    const existSubTodo = await SubTodo.findOne({
        title
    })
    if(existSubTodo){
        throw new ApiError(409, "This Todo Title is Already Exist : subTodo.controller");
    }

    const subTodo = await SubTodo.create({
        title,
        description,
        complete,
        createdBy : req.user._id,
        mainTodo : mainTodoId,
    })

    const createdSubTodo = await SubTodo.findById(subTodo._id);

    if(!createdSubTodo) {
        throw new ApiError(500, "something Went Wrong While Make a SubTodo : subTodo.controller");
    }

    await Todo.findByIdAndUpdate(
       { _id : mainTodoId }, 
        {
            $push : { subTodos : subTodo?._id}   
        }
    ).catch(err => console.log(err))


    return res.status(200).json(new ApiResponse(200, {subTodo}, "Sub Todo Created Successfully"))
})

const deleteSubTodo = asyncHandler( async (req, res) => {
    let {deleteSubTodoIds, mainTodoId} = req.body;

    if(!Array.isArray(deleteSubTodoIds)){
        deleteSubTodoIds = [deleteSubTodoIds];
    }

    const invalidId = deleteSubTodoIds?.filter( id => 
        !mongoose.Types.ObjectId.isValid(id)
     ) 

    if(invalidId.length){
        throw new ApiResponse(400, "Pleace check Id's for delete Sub Todo : subTodo.controller")
    }

    await Todo.findByIdAndUpdate(
        {_id : mainTodoId},
        {$pull : { subTodos : { $in : deleteSubTodoIds }}},
        {new : true}
    )

    const responseDeleteSubTodo = await SubTodo.deleteMany({_id : {$in : deleteSubTodoIds}})
    const reportForDeletedSubTodo = responseDeleteSubTodo.deletedCount;
    
    res.status(200).json(new ApiResponse(
         200,
         {DeletedSubTodo : reportForDeletedSubTodo}, 
         "Delete SubTodo Successfully")
        ); 
})

const  updateSubTodo = asyncHandler( async(req, res) => {
    const {title, description, complete} = req.body
    const subTodoId = req.query?.subTodoId;
    
    const isValidId = mongoose.Types.ObjectId.isValid(subTodoId);
    if (!isValidId) {
        throw new ApiError(401, "Invalid Todo ID : subTodo.controller")
    }

    if([title, description, complete].some((field)=> field === "")){
        throw new ApiError(401, "All field are Required : subTodo.controller")
    }

    const existedTitle = await SubTodo.findOne({
        title
    })
    if(existedTitle){
        throw new ApiError(409, "This title is Existed : subTodo.controller")
    }
    
    const subTodo = await SubTodo.findById(subTodoId)

    if(title){
        subTodo.title = title;
    }
    if(description){
        subTodo.description = description;
    }
    if(complete){
        subTodo.complete = complete;
    }
    await subTodo.save({validateBeforeSave : false});
    res.status(200).json(new ApiResponse(200, {subTodo}, "subTodo update sucssfully : subTodo"))
})



export {createSubTodo, deleteSubTodo, updateSubTodo}



