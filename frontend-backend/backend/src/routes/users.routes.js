import { Router } from "express";
//import { userModel } from "../dao/models/users.models.js";
import { getUsers, getUserById, putUserById, deleteUser  } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', putUserById)
userRouter.delete('/:id', deleteUser)

export default userRouter