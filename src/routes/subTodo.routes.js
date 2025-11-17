import { Router } from "express";
import { createSubTodo, deleteSubTodo, updateSubTodo } from "../controllers/subTodo.controller.js";

const router = Router();

router.route("/create").post(createSubTodo);
router.route("/delete").post(deleteSubTodo);
router.route("/update").post(updateSubTodo);


export default router;