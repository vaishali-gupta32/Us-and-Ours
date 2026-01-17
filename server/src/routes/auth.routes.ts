import express from 'express';
import { register, login, logout, getMe, getCloudinarySignature } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import passport from 'passport';

const router = express.Router();

router.post('/register', register); // Mapped from Client /api/auth/signup
router.post('/login', login);
router.post('/logout', logout); // usually POST for state change
router.get('/me', protect, getMe);
router.get('/cloudinary-sign', protect, getCloudinarySignature);

// Google Auth Routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent'
}));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err: any, user: any, info: any) => {
        if (err) {
            console.error('[Auth] Google callback error:', err);
            return res.redirect(`${process.env.CLIENT_URL}/dashboard?error=Authentication failed`);
        }

        if (!user) {
            // Failed authentication - pass error message
            const message = info?.message || 'Authentication failed';
            console.log('[Auth] Google auth failed:', message);
            return res.redirect(`${process.env.CLIENT_URL}/dashboard?error=${encodeURIComponent(message)}`);
        }

        // Success - log in user
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('[Auth] Login error:', loginErr);
                return res.redirect(`${process.env.CLIENT_URL}/dashboard?error=Login failed`);
            }
            console.log('[Auth] ✅ Google login successful');
            res.redirect(`${process.env.CLIENT_URL}/dashboard?success=calendar_connected`);
        });
    })(req, res, next);
});

// Debug route to check Google Calendar connection status
router.get('/google-status', protect, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const User = (await import('../models/User')).default;
        const user = await User.findById(userId).select('+googleId +googleRefreshToken +googleAccessToken');

        res.json({
            connected: !!user?.googleId,
            hasRefreshToken: !!user?.googleRefreshToken,
            hasAccessToken: !!user?.googleAccessToken,
            googleEmail: user?.email || 'N/A'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check status' });
    }
});

export default router;
