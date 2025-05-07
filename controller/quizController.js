import Quiz from '../models/Quiz.js';

// new quiz
export const createQuiz = async (req, res) => {
  try {
    console.log("Incoming quiz data:", JSON.stringify(req.body, null, 2));

    const { subject, sections } = req.body;

    if (!subject || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ message: "Invalid quiz data" });
    }

    const newQuiz = new Quiz({
      subject,
      sections: sections.map(section => ({
        name: section.name,
        questions: section.questions.map(q => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswers: q.correctAnswers,
          duration: q.duration || 30
        }))
      }))
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Quiz creation error:", error.message);
    res.status(500).json({ message: "Failed to create quiz", error: error.message });
  }
};

// Get quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch quizzes error:", error.message);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Fetch quiz by ID error:", error.message);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

// Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ message: 'Failed to update quiz' });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const subjects = [
      ...new Set(
        quizzes.map(q => q.subject?.trim()).filter(Boolean)
      )
    ];
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};
