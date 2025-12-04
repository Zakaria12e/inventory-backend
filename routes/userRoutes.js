import express from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController.js";
import { protect , verifyAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /users → only authenticated users can view users
router.get("/",protect , verifyAdminOrSuper, getUsers);

// POST /users → admin or superadmin can create
router.post("/",protect , verifyAdminOrSuper, createUser);

// DELETE /users/:id → admin or superadmin can delete
router.delete("/:id",protect , verifyAdminOrSuper, deleteUser);

export default router;
