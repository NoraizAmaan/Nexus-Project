import express from "express";
import {
    getPhases,
    createPhase,
    updatePhase,
    deletePhase,
} from "../controllers/phaseController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getPhases).post(createPhase);
router.route("/:id").put(updatePhase).delete(deletePhase);

export default router;
