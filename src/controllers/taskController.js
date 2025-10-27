import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import Attachment from "../models/Attachment.js";
import User from "../models/User.js";

export const createTask = async (req, res, next) => {
  try {
    const payload = { ...req.body, creator: req.user._id };
    if (payload.assignees && !Array.isArray(payload.assignees)) payload.assignees = [payload.assignees];
    const task = await Task.create(payload);
    // TODO: notify assignees (use notifications util)
    res.status(201).json(task);
  } catch (err) { next(err); }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignees creator team attachments");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) { next(err); }
};

export const listTasks = async (req, res, next) => {
  try {
    const { page=1, limit=20, status, assignee, team, q, sortBy="createdAt", order="desc" } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assignee) filter.assignees = assignee;
    if (team) filter.team = team;
    // only tasks visible to the user: either assigned to them, created by them, or in their teams
    const teams = (await User.findById(req.user._id).select("teams")).teams || [];
    filter.$or = [
      { assignees: req.user._id },
      { creator: req.user._id },
      { team: { $in: teams } }
    ];
    if (q) filter.$text = { $search: q };
    const tasks = await Task.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page-1)*limit).limit(Number(limit))
      .populate("assignees creator team");
    const total = await Task.countDocuments(filter);
    res.json({ data: tasks, meta: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
};

export const updateTask = async (req, res, next) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const t = await Task.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

// comments + attachments on a task
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({ task: req.params.id, author: req.user._id, text });
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

export const uploadAttachment = async (req, res, next) => {
  try {
    // multer puts files in req.files (multiple) or req.file (single)
    const files = req.files || (req.file ? [req.file] : []);
    const attachments = [];
    for (const f of files) {
      const att = await Attachment.create({
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`,
        uploader: req.user._id
      });
      attachments.push(att);
    }
    // associate attachments with task
    await Task.findByIdAndUpdate(req.params.id, { $push: { attachments: { $each: attachments.map(a=>a._id) } } });
    res.status(201).json(attachments);
  } catch (err) { next(err); }
};
