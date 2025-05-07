
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

export const getRegisteredStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }); 
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students." });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Quiz.aggregate([
      { $group: { _id: "$subject", topStudents: { $push: { name: "$studentName", score: "$score" } } } },
      { $sort: { "topStudents.score": -1 } }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard." });
  }
};

