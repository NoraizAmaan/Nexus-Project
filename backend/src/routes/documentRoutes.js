import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import {
    uploadDocument,
    getProjectDocuments,
    deleteDocument,
} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage });

// All routes are protected
router.use(protect);

router.post("/", upload.single("file"), uploadDocument);
router.get("/:projectId", getProjectDocuments);
router.delete("/:id", deleteDocument);

export default router;
