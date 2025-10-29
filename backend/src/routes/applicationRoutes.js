import express from "express";
import { verifyToken } from "../middleware/authMiddleWare.js";
import {
    applyToJob,
    getApplicationForAdmin,
    getMyApplications,
    updateApplicationStatus,
} from "../controller/applicationController.js";
import { verifyAdminOnly } from "../middleware/roleMiddleWare.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: {fileSize: 10 * 1024 * 1024} });

const router = express.Router();

router.post("/apply", verifyToken, upload.single("resume"), applyToJob);
router.get("/me", verifyToken, getMyApplications);
router.get("/admin", verifyToken, verifyAdminOnly, getApplicationForAdmin);
router.put("/:id/status", verifyToken, updateApplicationStatus);

export default router;
