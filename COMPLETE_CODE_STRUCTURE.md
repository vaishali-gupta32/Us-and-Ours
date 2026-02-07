# Us and Ours - Complete Code Structure & Missing Details

## 📁 Actual Codebase Structure

This document provides **exact** file-by-file details discovered from the actual codebase.

---

## 🏗️ Repository Structure

```
Us-and-Ours/
├── README.md                    # Project overview
├── client/                      # Next.js Frontend
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   └── src/
│       ├── app/
│       │   ├── layout.tsx              # Root layout with fonts
│       │   ├── globals.css             # Global styles
│       │   ├── page.tsx                # Landing page
│       │   ├── login/
│       │   │   └── page.tsx            # Login/Signup screen
│       │   ├── dashboard/
│       │   │   ├── layout.tsx          # Dashboard wrapper with Sidebar/Navbar
│       │   │   └── page.tsx            # Main dashboard
│       │   ├── write/
│       │   │   └── page.tsx            # Create/edit post screen
│       │   ├── timeline/
│       │   │   └── page.tsx            # Timeline milestones
│       │   ├── calendar/
│       │   │   └── page.tsx            # Calendar events
│       │   ├── gallery/
│       │   │   └── page.tsx            # Photo gallery
│       │   ├── movies/
│       │   │   └── page.tsx            # Movie watchlist
│       │   └── playlist/
│       │       └── page.tsx            # Music playlist
│       ├── components/
│       │   ├── AddMomentModal.tsx      # Timeline moment creation modal
│       │   ├── Countdown.tsx           # Countdown timer component
│       │   ├── GenericListPage.tsx     # Reusable list (movies/playlist)
│       │   ├── Navbar.tsx              # Bottom navigation bar
│       │   ├── Sidebar.tsx             # Side navigation (desktop)
│       │   ├── TimelineNode.tsx        # Timeline moment card
│       │   └── ui/
│       │       ├── Button.tsx          # Button component
│       │       └── GlassCard.tsx       # Glass morphism card
│       ├── lib/
│       │   ├── api.ts                  # API fetch wrapper
│       │   ├── db.ts                   # MongoDB connection (client-side models)
│       │   └── utils.ts                # Utility functions (cn)
│       ├── middleware.ts               # Next.js middleware
│       └── models/                     # Client-side TypeScript models
│           ├── Couple.ts
│           ├── Event.ts
│           ├── ListItem.ts
│           ├── Post.ts
│           └── User.ts
└── server/                      # Express.js Backend
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app.ts                      # Express app entry
        ├── config/
        │   ├── db.ts                   # MongoDB connection
        │   └── passport.ts             # Passport Google OAuth config
        ├── controllers/
        │   ├── authController.ts       # Auth logic (register, login, logout)
        │   ├── coupleController.ts     # Couple data management
        │   ├── eventController.ts      # Calendar events CRUD
        │   ├── itemController.ts       # Movies/playlist CRUD
        │   ├── postController.ts       # Posts CRUD
        │   └── timelineController.ts   # Timeline moments CRUD
        ├── middleware/
        │   └── authMiddleware.ts       # JWT authentication middleware
        ├── models/
        │   ├── Couple.ts               # Couple schema
        │   ├── Event.ts                # Event schema
        │   ├── ListItem.ts             # Movie/song schema
        │   ├── Post.ts                 # Post schema
        │   ├── TimelineMoment.ts       # Timeline moment schema
        │   └── User.ts                 # User schema
        ├── routes/
        │   ├── auth.routes.ts          # Auth endpoints
        │   ├── couple.routes.ts        # Couple endpoints
        │   ├── events.routes.ts        # Events endpoints
        │   ├── items.routes.ts         # Items endpoints
        │   ├── posts.routes.ts         # Posts endpoints
        │   └── timeline.routes.ts      # Timeline endpoints
        ├── services/
        │   └── calendarService.ts      # Google Calendar integration
        └── types/
            └── express.d.ts            # TypeScript type extensions
```

---

## 🔍 Critical Implementation Details

### 1. CORS Configuration (server/src/app.ts)

**Actual Implementation:**
```typescript
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.CLIENT_URL,
    'https://us-and-ours.vercel.app',
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list OR matches Vercel preview pattern
        if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true
}));
```

**Important Notes:**
- Allows **requests with no origin** (critical for mobile apps)
- Allows **all Vercel preview deployments** (`.vercel.app` domains)
- Uses `credentials: true` for cookie support

---

### 2. Session Configuration

**Express Session Setup:**
```typescript
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));
```

**Required for:**
- Google OAuth with Passport.js
- Session persistence across requests

---

### 3. Body Size Limits

**Express:**
```typescript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
```

**Next.js:**
```typescript
// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
  },
}
```

**Reason:** Support for large base64-encoded images (though deprecated in favor of Cloudinary)

---

### 4. Image Configuration

**Next.js Image Optimization:**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
}
```

**Allows:** Next.js Image component to optimize Cloudinary images

---

### 5. Middleware Behavior

**Client Middleware (client/src/middleware.ts):**
```typescript
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const publicRoutes = ['/login', '/public'];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }
    
    // Allow assets
    if (pathname.includes('.')) {
        return NextResponse.next();
    }
    
    // Let backend API handle authorization via Bearer token
    return NextResponse.next();
}
```

**Important:**
- **Does NOT enforce authentication** on client
- All auth is handled by backend via JWT
- Allows public routes: `/login`, `/public`
- Allows all asset files (`.` in pathname)

---

### 6. Google OAuth Flow Details

**Passport Configuration (server/src/config/passport.ts):**

**Key Points:**
- Uses `accessType: 'offline'` to get refresh token
- Uses `prompt: 'consent'` to force consent screen (ensures refresh token)
- Scopes requested: `profile`, `email`, `https://www.googleapis.com/auth/calendar`
- Links by **email matching** (not auto-create)
- Updates tokens on every login
- Validates email matches before linking

**Linking Logic:**
```typescript
// 1. Try to find user by googleId
let user = await User.findOne({ googleId: profile.id });

// 2. If not found, try to find by email
if (!user && email) {
    user = await User.findOne({ email });
    if (user) {
        // Validate email matches
        if (googleEmail !== user.email) {
            return done(null, false, {
                message: `Please sign in with ${user.email}`
            });
        }
        // Link Google account
        user.googleId = profile.id;
        user.googleAccessToken = accessToken;
        if (refreshToken) user.googleRefreshToken = refreshToken;
        await user.save();
        return done(null, user);
    }
}

// 3. If still not found, return error
return done(null, false, { message: 'User not found. Please register first.' });
```

---

### 7. Google Calendar Sync Implementation

**Key Features:**
```typescript
// Auto-refresh access tokens
oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
        await User.findByIdAndUpdate(userId, { 
            googleAccessToken: tokens.access_token 
        });
    }
});

// All-day event fix (must end next day)
const startDate = new Date(eventDetails.date);
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 1);  // Critical!
event.end.date = endDate.toISOString().split('T')[0];
```

**Important:**
- All-day events in Google Calendar require **end date = start date + 1**
- Automatically refreshes access tokens when they expire
- Adds heart emoji (❤️) prefix to event titles
- Syncs for **both partners** when event is created
- **Fails silently** if sync errors (doesn't break app)

---

### 8. List Items Scoping Issue

**WARNING - Potential Bug:**

In `server/src/controllers/itemController.ts`:
```typescript
export const getItems = async (req: Request, res: Response) => {
    const { type } = req.query;
    const query = type ? { type } : {};
    // ⚠️ NOT filtered by coupleId!
    const items = await ListItem.find(query).sort({ createdAt: -1 });
    res.json({ success: true, items });
};
```

**Issue:** List items (movies/playlist) are **NOT scoped to couples**

**Current Behavior:**
- All users see all items globally
- No data isolation for movies/playlist

**Should Be:**
```typescript
// Need to add coupleId to ListItem model
// Then filter: { ...query, coupleId: user.coupleId }
```

**Note for Mobile Dev:** This is a bug in the backend. You may see items from other couples. Consider filtering client-side by `addedBy` user ID as workaround.

---

### 9. Timeline Response Format Inconsistency

**Timeline GET returns array directly:**
```typescript
// server/src/controllers/timelineController.ts
const moments = await TimelineMoment.find({ coupleId: user.coupleId }).sort({ date: 1 });
res.json(moments);  // ⚠️ No wrapper object
```

**Other endpoints return:**
```json
{
  "success": true,
  "posts": [...]
}
```

**Timeline returns:**
```json
[
  { "_id": "...", "title": "..." }
]
```

**Note:** Client code expects direct array. Mobile app should handle both formats.

---

### 10. Authentication Token Handling

**Dual Support in authMiddleware:**
```typescript
let token;

// Check cookie first
if (req.cookies.token) {
    token = req.cookies.token;
// Then check Authorization header
} else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
}
```

**Order matters:**
1. Cookie checked first (for web app)
2. Bearer token checked second (for mobile app)

**Best Practice for Mobile:**
- Always use `Authorization: Bearer <token>` header
- Don't rely on cookies in mobile apps

---

### 11. Cloudinary Signature Generation

**Actual Implementation:**
```typescript
// server/src/controllers/authController.ts
export const getCloudinarySignature = async (req: Request, res: Response): Promise<void> => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: req.query.folder as string || 'us-and-ours'
            },
            process.env.CLOUDINARY_API_SECRET as string
        );

        res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
```

**Query Parameters:**
- `folder` (optional): Cloudinary folder path
- Default: `us-and-ours`
- Can specify subfolder: `/auth/cloudinary-sign?folder=us-and-ours/timeline`

---

### 12. Database Connection (Client vs Server)

**Client has its own db.ts:**
```typescript
// client/src/lib/db.ts
// Used for API Routes in Next.js (if any)
// Caches connection in global.mongoose
```

**Server has separate db.ts:**
```typescript
// server/src/config/db.ts
// Used for Express backend
// Connects once at startup
```

**Important:** Client `db.ts` is **NOT used in mobile app** - only relevant for Next.js

---

### 13. Font Configuration

**Actual Fonts Used:**
```typescript
// client/src/app/layout.tsx
import { Nunito, Quicksand } from "next/font/google";

const nunito = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  weights: ['400', '600', '700', '800'],
});

const quicksand = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
  weights: ['400', '500', '600', '700'],
});
```

**CSS Variables:**
```css
--font-heading: Nunito
--font-body: Quicksand
```

**Usage:**
```css
font-family: var(--font-heading);  /* For headings */
font-family: var(--font-body);     /* For body text */
```

---

### 14. Tailwind CSS Configuration

**Custom Utilities:**
```css
/* client/src/app/globals.css */
.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.01);
}
```

**Custom Animations:**
```css
@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes blob-float {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -50px) scale(1.1); }
  66%  { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

---

### 15. Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.8);
}
```

---

## 🐛 Known Issues & Bugs

### 1. List Items Not Scoped to Couples
- **File:** `server/src/controllers/itemController.ts`
- **Issue:** Movies/playlist items not filtered by `coupleId`
- **Impact:** Users can see other couples' items
- **Fix:** Add `coupleId` field to ListItem model and filter

### 2. Update Item Route Uses Different Body Structure
- **File:** `server/src/controllers/itemController.ts`
- **Code:**
  ```typescript
  const { id } = req.params;
  const { status } = req.body;  // Only expects status
  ```
- **Client sends:** `{ _id: id, status: status }`
- **Backend expects:** `{ status: status }`
- **Works but:** Client sending `_id` in body is unnecessary

### 3. Timeline Returns Inconsistent Format
- **Issue:** Returns array instead of `{ success: true, moments: [] }`
- **Impact:** Client must handle different response formats
- **Fix:** Standardize all endpoints to return `{ success: true, data: ... }`

### 4. No Password Reset Flow
- **Issue:** If user forgets password, no recovery mechanism
- **Impact:** User account is permanently locked
- **Workaround:** Manual database intervention required

### 5. No Account Deletion
- **Issue:** No way for users to delete their account
- **Impact:** Data persists indefinitely
- **Privacy Concern:** GDPR compliance issue

### 6. Secret Code Collision Handling
- **Current:** Generates random 6-char hex code
- **Issue:** No retry logic if collision occurs
- **Probability:** Low (1 in 16 million) but possible
- **Fix:** Add retry loop in registration

### 7. Image Compression on Client
- **File:** `client/src/app/write/page.tsx`
- **Code:**
  ```typescript
  if (file.size > 500 * 1024) {
      const compressed = await compressImage(file);
      setPreviewUrl(compressed);
  }
  ```
- **Issue:** Compression only if > 500KB
- **Better:** Always compress to 800px width, 70% quality

---

## 🔐 Environment Variables Required

### Server (.env)

```bash
# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-super-secret-key-here

# Express Session
SESSION_SECRET=another-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.com/auth/google/callback

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Server
PORT=5000
NODE_ENV=production
```

### Client (.env.local)

```bash
# API Endpoint
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Cloudinary (Public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## 📊 Data Flow Diagrams

### Post Creation Flow

```
Mobile App
  ↓
1. User selects image from gallery
  ↓
2. Image compressed (800px, 70% quality)
  ↓
3. GET /auth/cloudinary-sign
  ← { signature, timestamp, cloudName, apiKey }
  ↓
4. POST https://api.cloudinary.com/.../upload
  ← { secure_url: "https://res.cloudinary.com/..." }
  ↓
5. POST /posts
   { content, mood, images: [cloudinary_url] }
  ← { success: true, post: {...} }
  ↓
6. UI updates with new post
  ↓
7. Partner's app polls /posts (3 seconds later)
  ← { success: true, posts: [..., new_post] }
  ↓
8. Partner sees new post appear
```

### Google Calendar Sync Flow

```
1. User taps "Connect Google Calendar"
  ↓
2. GET /auth/google
  → Redirect to Google OAuth consent screen
  ↓
3. User grants permissions
  ↓
4. GET /auth/google/callback?code=...
  ↓
5. Backend exchanges code for tokens
  → Saves googleId, accessToken, refreshToken
  ↓
6. Redirect to /dashboard?success=calendar_connected
  ↓
7. User sets next meeting date
  ↓
8. PATCH /couple { nextMeetingDate: "..." }
  ↓
9. Backend creates calendar event
  ↓
10. addEventToGoogleCalendar(partner1)
11. addEventToGoogleCalendar(partner2)
  ↓
12. Events appear in both Google Calendars
```

---

## 🎯 Mobile App Implementation Priority

### Phase 1: MVP (Week 1-2)
1. Authentication (login, signup, token storage)
2. Dashboard with posts feed
3. Post creation (text + mood)
4. Image upload to Cloudinary
5. Real-time polling (5 seconds)

### Phase 2: Core Features (Week 3-4)
6. Timeline milestones
7. Calendar events
8. Countdown timer
9. Couple status card
10. Gallery (aggregate images from posts)

### Phase 3: Extended Features (Week 5-6)
11. Movies watchlist
12. Music playlist
13. Google Calendar OAuth
14. Profile settings
15. Navigation polish

### Phase 4: Polish (Week 7-8)
16. Push notifications
17. Offline support
18. Animations
19. Error handling
20. Performance optimization

---

## ✅ Final Checklist for Mobile Developers

### Before Starting
- [ ] Set up development environment (React Native/Flutter)
- [ ] Install all required dependencies
- [ ] Configure API base URL (dev vs prod)
- [ ] Set up secure token storage (Keychain/Keystore)
- [ ] Test API connectivity

### Core Features
- [ ] Authentication screens
- [ ] JWT token management
- [ ] Dashboard with posts
- [ ] Create post with image
- [ ] Real-time polling
- [ ] Timeline screen
- [ ] Calendar screen
- [ ] Countdown component
- [ ] Gallery screen
- [ ] Movies/playlist screens

### Integration
- [ ] Cloudinary image upload
- [ ] Google OAuth (optional)
- [ ] Push notifications setup (future)
- [ ] Deep linking (future)

### Testing
- [ ] Test on real devices (iOS + Android)
- [ ] Test with slow network
- [ ] Test offline behavior
- [ ] Test image uploads
- [ ] Test real-time updates
- [ ] Test edge cases

### Polish
- [ ] Implement loading states
- [ ] Implement error handling
- [ ] Add empty states
- [ ] Add animations
- [ ] Optimize performance
- [ ] Add haptic feedback

### Deployment
- [ ] Configure production API URL
- [ ] Set up app store assets
- [ ] Submit to App Store / Play Store

---

**Last Updated:** February 2024  
**Based on:** Actual codebase analysis  
**Status:** Complete - No assumptions made
