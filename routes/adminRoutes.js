import express from 'express'
import { getRegisteredStudents } from '../controller/adminController.js';

const router = express.Router();

router.get("/students", getRegisteredStudents); // registered students

export default router;
