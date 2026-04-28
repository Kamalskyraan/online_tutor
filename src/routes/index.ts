import { Request, Response, Router } from "express";
import authRoutes from "./auth.routes";
import helpRoutes from "./support.routes";
import sourceRoutes from "./source.routes";
import userRoutes from "./user.routes";
import eduRoutes from "./education.routes";
import subjectRoutes from "./subject.routes";
import profileRoutes from "./profile.routes";
import studentRoutes from "./student.routes";
import reviewRoutes from "./review.routes";
import commonRoutes from "./common.routes";
import noteRoutes from "./notification.routes";
import tutorRoutes from "./tutor.routes";
import { upload } from "../config/multer";
import leadsRoutes from "./leads.routes";
import { AuthController } from "../controller/auth.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/edu", eduRoutes);
router.use("/subject", subjectRoutes);
router.use("/help", helpRoutes);
router.use("/source", sourceRoutes);
router.use("/tutor", tutorRoutes);
router.use("/student", studentRoutes);
router.use("/review", reviewRoutes);
router.use("/cmn", commonRoutes);
router.use("/leads", leadsRoutes);
router.use("/notify", noteRoutes);
// common

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  res.json({
    message: "File uploaded",
    file: req.file,
  });
});

router.post("/upload-multiple", upload.array("files", 5), (req, res) => {
  res.json({
    message: "Files uploaded",
    // files: req.files,
  });
});

// justify

router.post("/add-appeal", AuthController.addAppeal);
router.post("/check-appeal", AuthController.checkAlreadyAppeal);
export default router;
