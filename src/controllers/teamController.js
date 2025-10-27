import Team from "../models/Team.js";
import User from "../models/User.js";

export const createTeam = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const team = await Team.create({ ...req.body, owner, members: [owner] });
    // add team to owner's teams
    await User.findByIdAndUpdate(owner, { $push: { teams: team._id } });
    res.status(201).json(team);
  } catch (err) { next(err); }
};

export const joinTeam = async (req, res, next) => {
  try {
    const { teamId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (!team.members.includes(req.user._id)) {
      team.members.push(req.user._id);
      await team.save();
      await User.findByIdAndUpdate(req.user._id, { $push: { teams: team._id } });
    }
    res.json(team);
  } catch (err) { next(err); }
};

export const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ members: req.user._id });
    res.json(teams);
  } catch (err) { next(err); }
};

