import express from "express";
import {
    getMembers,
    addMember,
    updateMember,
    deleteMember,
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMembers);
router.post("/", protect, addMember);
router.delete("/:id", protect, deleteMember);
router.put("/:id", protect, updateMember);

export default router;
