import express from "express";
import { verifyToken } from "../middleware/authMiddleWare.js";
import { applyToJob, getApplicationForAdmin, getMyApplications } from "../controller/applicationController.js";
import { verifyAdminOnly } from "../middleware/roleMiddleWare.js";

const router = express.Router();

router.post("/apply",verifyToken,applyToJob);
router.get("/me",verifyToken,getMyApplications);
router.get("/admin",verifyToken,verifyAdminOnly,getApplicationForAdmin);

export default router;