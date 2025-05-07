import express from 'express';
import { submitQuiz } from '../controller/resultController.js';
import { authenticate} from '../middleware/authMiddleware.js';
import { getMyResults } from '../controller/resultController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { getAllResultsByQuiz } from '../controller/resultController.js';
import { getLeaderboard } from '../controller/resultController.js';

const router = express.Router();


router.post('/submit', submitQuiz);
router.get('/mine', authenticate, getMyResults);
router.get('/all', authenticate, isAdmin, getAllResultsByQuiz);
router.get('/leaderboard/:quizId', authenticate, getLeaderboard);

export default router;
