import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createTeam, joinTeam, listTeams } from "../controllers/teamController.js";

const router = express.Router();
router.use(authenticate);

router.post("/", createTeam);
router.post("/join", joinTeam);
router.get("/", listTeams);

export default router;
