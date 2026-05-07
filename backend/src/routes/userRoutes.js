import express from "express";
import { getUsers, deleteUser, getGraphData } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/graph", protect, getGraphData);
router.get("/", protect, getUsers);
router.delete("/:id", protect, deleteUser);

export default router;
