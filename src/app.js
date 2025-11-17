import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('public'))
app.use(cookieParser())


// import routers
import userRoutes from './routes/user.routes.js'
import todoRoutes from './routes/todo.routes.js'
import subTodoRoutes from './routes/subTodo.routes.js'
import { varifyJWT } from './middlewares/auth.middleware.js';

// routers declaration
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/users/todo', varifyJWT, todoRoutes)
app.use('/api/v1/users/todo/subTodos', varifyJWT, subTodoRoutes)

export { app };
