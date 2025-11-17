import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";


const router = Router()

router.route("/create-todo").post(createTodo);
router.route("/get-todo").get(getTodos)
router.route("/update-todo").post(updateTodo)
router.route("/delete-todo").post(deleteTodo)

export default router;