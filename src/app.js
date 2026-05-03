import express from 'Express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.urlencoded({ extended: true,limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Import routes
import userRoutes from './routes/user.routes.js';

// Use routes
app.use('/api/v1/users', userRoutes);

export default app;