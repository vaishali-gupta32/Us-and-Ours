import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import coupleRoutes from './routes/couple.routes';
import postRoutes from './routes/posts.routes';
import itemRoutes from './routes/items.routes';
import eventRoutes from './routes/events.routes';
import timelineRoutes from './routes/timeline.routes';

import passport from './config/passport';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session needed for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/couple', coupleRoutes);
app.use('/posts', postRoutes);
app.use('/items', itemRoutes);
app.use('/events', eventRoutes);
app.use('/timeline', timelineRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
