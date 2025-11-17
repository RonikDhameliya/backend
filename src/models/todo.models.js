import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    complete : {
        type : Boolean,
        default : false,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    subTodos : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubTodo"
    }]
},{timestamps : true}
);
todoSchema.plugin(mongooseAggregatePaginate);

export const Todo = mongoose.model('Todo', todoSchema);