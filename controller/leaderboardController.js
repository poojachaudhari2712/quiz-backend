import mongoose from 'mongoose';
import Result from '../models/Result.js';

export const getLeaderboard = async (req, res) => {
    try {
      const results = await Result.find()
        .populate({
          path: 'quiz',
          populate: {
            path: 'sections.questions',
          }
        })
        .populate('student');
  
      res.json(results);
    } catch (error) {
      console.error('Error fetching all results:', error);
      res.status(500).send('Server Error');
    }
  };    
