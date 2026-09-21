import mongoose from "mongoose";
import { scoreModel } from "../models/scoreModel.js";
 
// ---- Helpers ----
 
// Returns an error message if the date or score is not valid, otherwise null
const validateScore = (date, score) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || isNaN(new Date(date))) {
    return "Enter a valid date.";
  }
  if (date > new Date().toISOString().slice(0, 10)) {
    return "The date can't be in the future.";
  }
  if (!Number.isInteger(Number(score)) || score < 1 || score > 45) {
    return "Score must be a whole number from 1 to 45.";
  }
  return null;
};
 
// ---- Controllers ----
 
// GET /api/user/get-scores  (all of the user's scores, newest first)
export const getScores = async (req, res) => {
  try {
    const scores = await scoreModel.find({ user: req.userId }).sort({ date: -1 });
 
    res.status(200).json({ success: true, scores });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
 
// POST /api/user/add-score   body: { date: "2026-09-15", score: 32 }
export const addScore = async (req, res) => {
  try {
    const { date, score } = req.body;
 
    const problem = validateScore(date, score);
    if (problem) {
      return res.status(400).json({ success: false, message: problem });
    }
 
    await scoreModel.create({
      user: req.userId,
      date: new Date(date),
      score: Number(score),
    });
 
    res.status(201).json({ success: true, message: "Score added" });
  } catch (error) {
    // The unique index on { user, date } throws this for a repeated date
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have a score for this date. Edit that entry instead.",
      });
    }
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
 
// PUT /api/user/update-score/:id   body: { date, score }
export const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, score } = req.body;
 
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Score not found" });
    }
 
    const problem = validateScore(date, score);
    if (problem) {
      return res.status(400).json({ success: false, message: problem });
    }
 
    // { _id, user } makes sure users can only edit their own scores
    const updated = await scoreModel.findOneAndUpdate(
      { _id: id, user: req.userId },
      { date: new Date(date), score: Number(score) },
      { new: true }
    );
 
    if (!updated) {
      return res.status(404).json({ success: false, message: "Score not found" });
    }
 
    res.status(200).json({ success: true, message: "Score updated" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have a score for this date.",
      });
    }
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
 
// DELETE /api/user/delete-score/:id
export const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Score not found" });
    }
 
    const deleted = await scoreModel.findOneAndDelete({ _id: id, user: req.userId });
 
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Score not found" });
    }
 
    res.status(200).json({ success: true, message: "Score deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
 