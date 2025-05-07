import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllSubjects 
} from "../controller/quizController.js";

import Quiz from "../models/Quiz.js";

const router = express.Router();

// Get all subjects
router.get("/subjects", getAllSubjects);

// create quizzes
router.post("/", createQuiz);


router.get("/getquizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch quizzes error:", error.message);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

router.get("/:id", async(req, res) => {
  try{
    const quiz = await Quiz.findById(req.params.id)
    res.status(200).json(quiz)
  }catch{
    console.error("Fetch quizzes error:", error.message);
    res.status(500).json({ message: "Failed to fetch quizzes" });  }
});


router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);


router.get("/subject/:subjectName", async (req, res) => {
  try {
    const { subjectName } = req.params;
    const quizzes = await Quiz.find({ subject: subjectName });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this subject" });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch quizzes by subject error:", error.message);
    res.status(500).json({ message: "Failed to fetch quizzes by subject" });
  }
});


export default router;
