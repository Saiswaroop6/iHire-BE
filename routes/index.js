import express from "express";
import authRoutes from "./signup.js";
import usersRoutes from "./users.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.use("/signup", authRoutes);
router.use("/users", checkAuth, usersRoutes);

export default router;
