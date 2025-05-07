import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: String,
  selectedAnswers: [String],
  correctAnswers: [String],
  isCorrect: Boolean
});

const sectionResultSchema = new mongoose.Schema({
  sectionName: String,
  score: Number,
  totalQuestions: Number,
  answers: [answerSchema]
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  sections: [sectionResultSchema],
  totalScore: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', resultSchema);
