import express from 'express';
import { createQuestion, createTest, getTest, submitTest } from '../controllers/testControllers.js';
import { authenticateJwt } from '../middleware/authorization.js';

const router = express.Router();

router.post('/createtest', createTest);
router.post('/createquestion', createQuestion);
router.get('/writetest/:id', getTest);
router.post('/writetest/submittest', submitTest)

export default router;
