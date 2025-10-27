import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { createTask, getTask, listTasks, updateTask, deleteTask, addComment, uploadAttachment } from "../controllers/taskController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createTask);
router.get("/", listTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.post("/:id/comments", addComment);
router.post("/:id/attachments", upload.array("files", 6), uploadAttachment);

export default router;
