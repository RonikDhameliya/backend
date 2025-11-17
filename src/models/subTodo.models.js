import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subTodoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    complete : {
        type : Boolean,
        default : false
    },
    mainTodo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Todo"
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},
{timestamps : true}
);
subTodoSchema.plugin(mongooseAggregatePaginate)

export const SubTodo = mongoose.model('SubTodo', subTodoSchema);