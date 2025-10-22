import express from "express";
import { verifyToken } from "../middleware/authMiddleWare.js";
import { CreateJob, deleteJob, listJobs, updateJob } from "../controller/jobController.js";
import { verifyAdminOnly } from "../middleware/roleMiddleWare.js";

const router = express.Router();

router.get("/", verifyToken, listJobs);
router.post("/", verifyToken, verifyAdminOnly, CreateJob);
router.put("/:id",verifyToken,verifyAdminOnly,updateJob);
router.delete("/:id",verifyToken,verifyAdminOnly,deleteJob);

export default router;
