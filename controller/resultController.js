import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";

// Submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, studentId } = req.body;
    console.log(req.body);

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const resultSections = [];
    let totalScore = 0;

    for (const section of quiz.sections) {
      const submittedSection = answers.find(
        (a) => a.sectionName === section.name
      );
      if (!submittedSection) continue;

      let sectionScore = 0;
      const sectionAnswers = [];

      for (const question of section.questions) {
        const submittedQ = submittedSection.answers.find(
          (a) => a.question === question.question
        );
        if (!submittedQ) continue;

        const selected = submittedQ.selectedAnswers.sort();
        const correct = question.correctAnswers.sort();
        const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);

        if (isCorrect) sectionScore++;

        sectionAnswers.push({
          question: question.question,
          selectedAnswers: selected,
          correctAnswers: correct,
          isCorrect,
        });
      }

      resultSections.push({
        sectionName: section.name,
        score: sectionScore,
        totalQuestions: section.questions.length,
        answers: sectionAnswers,
      });

      totalScore += sectionScore;
    }
    console.log("Total Score => ",answers[0].score);
  
    const newResult = new Result({
      student: studentId,  
      quiz: quiz._id,
      sections: resultSections,
      totalScore: answers[0].score,
    });

    await newResult.save();
    res.status(201).json({ message: "Result saved successfully", result: newResult });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Failed to submit quiz", error: error.message });
  }
};



export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id }).populate(
      "quiz",
      "subject"
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

export const getAllResultsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.query;
    if (!quizId)
      return res.status(400).json({ message: "Quiz ID is required" });

    const results = await Result.find({ quiz: quizId })
      .populate("student", "name email")
      .populate("quiz", "subject");

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results for admin:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const topResults = await Result.find({ quiz: quizId })
      .sort({ totalScore: -1 })
      .limit(5)
      .populate("student", "name email");

    res.status(200).json(topResults);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
