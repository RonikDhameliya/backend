import { Router } from "express";
import { registerUser, loginUser, logout, updatePassword, getCurrUser, changeEmail, updateProfilePic, deleteUser } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { varifyJWT }  from "../middlewares/auth.middleware.js";
// import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";

const router = Router()
router.route("/register").post( upload.single("profilePic"), registerUser);
router.route("/login").post(upload.none(), loginUser ); // QUESTION - upload.none()
router.route("/getCurrentUser").get(varifyJWT, getCurrUser);
router.route("/update-profilepic").post(varifyJWT, upload.single("profilePic"), updateProfilePic);
//secure routes
router.route("/password-change").post(varifyJWT, updatePassword);
router.route("/change-username").post(varifyJWT, changeEmail);
router.route("/logout").post(varifyJWT, logout);
router.route("/delete").post(varifyJWT, deleteUser);


//todo routes
// router.route("/create-todo").post(varifyJWT, createTodo);
// router.route("/get-todo").get(varifyJWT, getTodos)
// router.route("/update-todo").post(varifyJWT, updateTodo)
// router.route("/delete-todo").post(deleteTodo)

export default router;