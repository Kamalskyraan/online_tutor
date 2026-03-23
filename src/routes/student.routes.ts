import { Router } from "express";
import { StudentController } from "../controller/student.controller";

const router = Router();

router.post("/nearby-tutors", StudentController.getNearbyTutors);
export default router;
