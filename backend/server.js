import express from 'express';
import dotenv from  'dotenv';
import cors from 'cors';
import connectMongo from './database/connectMongo.js';
import './cornAndMail/cornJob.js'

// importing routers from routes
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js'

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/test', testRoutes);

app.listen('5000', () => {
    console.log('Server is running on port 5000');
    connectMongo();
})
