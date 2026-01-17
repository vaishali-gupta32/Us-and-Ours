import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log('========== GOOGLE OAUTH CALLBACK ==========');
            console.log('[Passport] Profile ID:', profile.id);
            console.log('[Passport] Email:', profile.emails?.[0]?.value);
            console.log('[Passport] Has accessToken:', !!accessToken);
            console.log('[Passport] Has refreshToken:', !!refreshToken);
            if (refreshToken) {
                console.log('[Passport] ✅ refreshToken received! (length:', refreshToken.length, ')');
            } else {
                console.log('[Passport] ❌ NO refreshToken received from Google!');
            }
            console.log('==========================================');

            try {
                // Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // Update tokens
                    user.googleAccessToken = accessToken;
                    if (refreshToken) user.googleRefreshToken = refreshToken;
                    await user.save();
                    console.log(`[Passport] ✅ Tokens updated`);
                    return done(null, user);
                }

                // Link account by email
                const email = profile.emails?.[0].value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Validate email matches
                        const googleEmail = profile.emails?.[0]?.value;
                        if (googleEmail !== user.email) {
                            console.log(`[Passport] ❌ Email mismatch: ${googleEmail} !== ${user.email}`);
                            return done(null, false, {
                                message: `Please sign in with ${user.email}`
                            });
                        }

                        console.log(`[Passport] ✅ Email validated: ${googleEmail}`);
                        console.log(`[Passport] Linking Google for: ${user.email}`);
                        user.googleId = profile.id;
                        user.googleAccessToken = accessToken;
                        if (refreshToken) user.googleRefreshToken = refreshToken;
                        await user.save();
                        console.log(`[Passport] ✅ Tokens saved!`);
                        return done(null, user);
                    }
                }

                return done(null, false, { message: 'User not found. Please register first.' });

            } catch (err) {
                console.error('[Passport] Error:', err);
                done(err, undefined);
            }
        }
    ));
} else {
    console.warn("GOOGLE_CLIENT_ID or SECRET not set. Google Strategy not initialized.");
}

export default passport;
