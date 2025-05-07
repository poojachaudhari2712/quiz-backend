import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
  duration: { type: Number, default: 30 }
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: [questionSchema]
});

const quizSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  sections: [sectionSchema]
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
