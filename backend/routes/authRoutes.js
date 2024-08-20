import express from 'express';
import { Login, logout, signUp } from '../controllers/authControllers.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', Login);
router.get('/verifyToken', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token is required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        res.json(user);
    });
});

router.get('/logout', logout)



export default router;
