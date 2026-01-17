import { google } from 'googleapis';
import User from '../models/User';

export const addEventToGoogleCalendar = async (userId: string, eventDetails: { title: string, date: string, description?: string }) => {
    try {
        const user = await User.findById(userId);

        console.log(`[Calendar Sync] Attempting sync for user ID: ${userId}`);
        console.log(`[Calendar Sync] User found: ${!!user}`);

        if (!user || (!user.googleRefreshToken && !user.googleAccessToken)) {
            console.log(`[Calendar Sync] ❌ User ${userId} does not have Google Calendar connected. Skipping sync.`);
            console.log(`[Calendar Sync] Has refreshToken: ${!!user?.googleRefreshToken}, Has accessToken: ${!!user?.googleAccessToken}`);
            return null;
        }

        console.log(`[Calendar Sync] ✅ User has tokens. Proceeding with sync...`);

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );

        oauth2Client.setCredentials({
            refresh_token: user.googleRefreshToken,
            access_token: user.googleAccessToken
        });

        // Listen for token refresh and save new access token
        oauth2Client.on('tokens', async (tokens) => {
            console.log(`[Calendar Sync] Tokens refreshed for user ${userId}`);
            if (tokens.access_token) {
                try {
                    await User.findByIdAndUpdate(userId, { googleAccessToken: tokens.access_token });
                    console.log(`[Calendar Sync] New access token saved`);
                } catch (err) {
                    console.error(`[Calendar Sync] Failed to save new access token:`, err);
                }
            }
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            summary: `❤️ ${eventDetails.title}`,
            description: eventDetails.description || 'Planned via Us & Ours App',
            start: {
                date: eventDetails.date,
            },
            end: {
                date: eventDetails.date,
            },
        };

        // Fix End Date for All Day Event (Must be +1 day)
        const startDate = new Date(eventDetails.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        event.end.date = endDate.toISOString().split('T')[0];

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        console.log(`✅ Event created on Google Calendar for user ${user.name}: ${response.data.htmlLink}`);
        return response.data;

    } catch (error: any) {
        console.error('❌ [Calendar Sync] ERROR adding to Google Calendar');
        console.error(`[Calendar Sync] User ID: ${userId}`);
        console.error(`[Calendar Sync] Event Details:`, eventDetails);
        console.error(`[Calendar Sync] Error Message: ${error?.message}`);
        console.error(`[Calendar Sync] Error Code: ${error?.code}`);
        // Don't crash the app if sync fails
        return null;
    }
};
