# Us and Ours - Mobile App Development Documentation

## 📱 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [API Reference](#api-reference)
4. [Data Models & Schema](#data-models--schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Features & User Flows](#features--user-flows)
7. [UI/UX Design System](#uiux-design-system)
8. [Real-Time Updates](#real-time-updates)
9. [Image & Media Handling](#image--media-handling)
10. [Environment Configuration](#environment-configuration)
11. [Mobile-Specific Considerations](#mobile-specific-considerations)

---

## 📖 Project Overview

**Us and Ours** is a premium, private digital space designed for couples in long-distance relationships. It provides a secure, beautiful platform for couples to share memories, plan events, and maintain their connection.

### Core Concept
- **Private Rooms**: Each couple gets their own isolated space
- **Secret Code System**: One partner creates a room and receives a 6-character code; the other joins using this code
- **Real-Time Updates**: Changes sync across devices with 3-second polling intervals
- **Data Isolation**: All data is strictly scoped to each couple's unique ID

### Key Value Propositions
- Beautiful, premium glassmorphic UI
- Real-time synchronization
- Complete privacy and data isolation
- Rich media support (photos, mood tracking)
- Comprehensive couple tools (journal, calendar, countdown, watchlists)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│  (React Native / Flutter / Swift / Kotlin - Your Choice)   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS / REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Backend API Server                          │
│              (Express.js + TypeScript)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes → Controllers → Models → Services             │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌────▼────┐   ┌───▼────┐
    │ MongoDB │   │Cloudinary│   │ Google │
    │  Atlas  │   │  (CDN)   │   │  APIs  │
    └─────────┘   └──────────┘   └────────┘
```

### Tech Stack

**Backend:**
- **Framework**: Express.js 5.2 (Node.js)
- **Language**: TypeScript 5+
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) + Google OAuth 2.0
- **Image Storage**: Cloudinary
- **Session**: Express-session with Passport.js

**Frontend (Current Web App):**
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR (with 3-second polling)
- **Animation**: Framer Motion
- **Icons**: Lucide React

### API Architecture

The backend follows a standard MVC pattern:

```
src/
├── app.ts                  # Express app entry point
├── config/
│   ├── db.ts              # MongoDB connection
│   └── passport.ts        # Google OAuth config
├── controllers/           # Business logic
│   ├── authController.ts
│   ├── postController.ts
│   ├── coupleController.ts
│   ├── eventController.ts
│   ├── timelineController.ts
│   └── itemController.ts
├── models/                # Mongoose schemas
│   ├── User.ts
│   ├── Couple.ts
│   ├── Post.ts
│   ├── Event.ts
│   ├── TimelineMoment.ts
│   └── ListItem.ts
├── routes/                # API routes
│   ├── auth.routes.ts
│   ├── posts.routes.ts
│   ├── couple.routes.ts
│   ├── events.routes.ts
│   ├── timeline.routes.ts
│   └── items.routes.ts
├── middleware/
│   └── authMiddleware.ts  # JWT verification
├── services/
│   └── calendarService.ts # Google Calendar integration
└── types/
    └── express.d.ts       # TypeScript definitions
```

---

## 🔌 API Reference

### Base URL
```
Production: https://your-backend-url.com
Development: http://localhost:5000
```

### Authentication Headers

All protected endpoints require authentication via either:

1. **Bearer Token** (Recommended for mobile):
```http
Authorization: Bearer <jwt_token>
```

2. **Cookie** (Used in web app):
```http
Cookie: token=<jwt_token>
```

---

### 🔐 Authentication Endpoints

#### 1. Register (Signup)

Create a new user and either create a new room or join an existing one.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "action": "create",  // or "join"
  "secretCode": "ABC123"  // Required only if action is "join"
}
```

**Response (action: "create"):**
```json
{
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "secretCode": "ABC123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (action: "join"):**
```json
{
  "success": true,
  "user": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing required fields
- `400`: User already exists
- `404`: Invalid secret code (when joining)
- `403`: Room is full (already has 2 partners)

---

#### 2. Login

Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "coupleId": "507f1f77bcf86cd799439011"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing credentials
- `401`: Invalid credentials

---

#### 3. Get Current User

Fetch the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/...",
    "coupleId": "507f1f77bcf86cd799439012"
  }
}
```

---

#### 4. Logout

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 5. Google OAuth (Optional)

**Initiate OAuth Flow:**
```
GET /auth/google
```
Redirects to Google consent screen.

**Callback:**
```
GET /auth/google/callback
```
Handles OAuth callback and redirects to app with success/error parameter.

**Note:** For mobile apps, consider using Google Sign-In SDKs for better UX.

---

#### 6. Cloudinary Signature (For Image Upload)

Get a signature to securely upload images to Cloudinary.

**Endpoint:** `GET /auth/cloudinary-sign`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "signature": "abcdef123456",
  "timestamp": 1234567890,
  "cloudName": "your-cloud-name",
  "apiKey": "your-api-key"
}
```

---

### 📝 Posts (Journal/Memories) Endpoints

#### 1. Get All Posts

Fetch all posts for the user's couple.

**Endpoint:** `GET /posts`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "coupleId": "507f1f77bcf86cd799439013",
      "content": "Missing you so much today! ❤️",
      "mood": "romantic",
      "images": [
        "https://res.cloudinary.com/..."
      ],
      "date": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "currentUser": "507f1f77bcf86cd799439012"
}
```

---

#### 2. Create Post

Create a new journal entry/memory.

**Endpoint:** `POST /posts`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Had an amazing day thinking about you!",
  "mood": "happy",
  "images": [
    "https://res.cloudinary.com/your-uploaded-image.jpg"
  ]
}
```

**Mood Options:**
- `happy`
- `sad`
- `excited`
- `tired`
- `romantic`
- `angry`
- `chill`

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "author": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe"
    },
    "content": "Had an amazing day thinking about you!",
    "mood": "happy",
    "images": ["https://res.cloudinary.com/..."],
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 3. Update Post

**Endpoint:** `PUT /posts/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Updated content",
  "mood": "excited"
}
```

**Response:**
```json
{
  "success": true,
  "post": { /* Updated post object */ }
}
```

---

#### 4. Delete Post

**Endpoint:** `DELETE /posts/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

### 💑 Couple Endpoints

#### 1. Get Couple Data

Fetch couple information including partners and secret code.

**Endpoint:** `GET /couple`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "secretCode": "ABC123",
  "partner1": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "avatar": "https://..."
  },
  "partner2": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "avatar": "https://..."
  },
  "nextMeetingDate": "2024-02-14T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** If `partner2` is `null`, the couple is waiting for the second partner to join.

---

#### 2. Update Couple Data

Update couple information (e.g., next meeting date).

**Endpoint:** `PATCH /couple`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nextMeetingDate": "2024-02-14T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "couple": { /* Updated couple object */ }
}
```

**Side Effects:**
- Creates a calendar event titled "Next Date ❤️"
- Syncs to Google Calendar for both partners (if connected)

---

### 📅 Calendar Events Endpoints

#### 1. Get Events

Fetch all calendar events for the couple.

**Endpoint:** `GET /events`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Anniversary Dinner",
      "date": "2024-02-14",
      "coupleId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 2. Create Event

**Endpoint:** `POST /events`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Movie Night",
  "date": "2024-01-20"
}
```

**Date Format:** `YYYY-MM-DD`

**Response:**
```json
{
  "success": true,
  "event": { /* Created event object */ }
}
```

---

#### 3. Delete Event

**Endpoint:** `DELETE /events/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

### 📖 Timeline Moments Endpoints

Timeline moments represent significant milestones in the relationship.

#### 1. Get Timeline Moments

**Endpoint:** `GET /timeline`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "moments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "coupleId": "507f1f77bcf86cd799439012",
      "title": "First Date",
      "description": "The day we first met at the coffee shop",
      "date": "2023-06-15T00:00:00.000Z",
      "image": "https://res.cloudinary.com/...",
      "iconType": "heart",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Icon Types:**
- `heart` - Love/Romance
- `ring` - Engagement/Marriage
- `plane` - Travel/Trips
- `home` - Moving in together
- `star` - Special moments
- `camera` - Photo memories

---

#### 2. Create Timeline Moment

**Endpoint:** `POST /timeline`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "First Kiss",
  "description": "Under the stars at the beach",
  "date": "2023-06-20T00:00:00.000Z",
  "image": "https://res.cloudinary.com/...",
  "iconType": "heart"
}
```

**Response:**
```json
{
  "success": true,
  "moment": { /* Created moment object */ }
}
```

---

#### 3. Update Timeline Moment

**Endpoint:** `PATCH /timeline/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

---

#### 4. Delete Timeline Moment

**Endpoint:** `DELETE /timeline/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

### 🎬 List Items Endpoints (Movies & Playlist)

List items are used for both movie watchlist and music playlist.

#### 1. Get List Items

**Endpoint:** `GET /items?type=movie` or `GET /items?type=song`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type`: `movie` or `song` (optional, returns all if not specified)

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Notebook",
      "type": "movie",
      "status": "pending",
      "link": "https://www.imdb.com/title/tt0332280/",
      "addedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Values:**
- `pending` - Not watched/listened yet
- `completed` - Watched/listened

---

#### 2. Create List Item

**Endpoint:** `POST /items`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Before Sunrise",
  "type": "movie",
  "link": "https://www.imdb.com/title/tt0112471/"
}
```

**Response:**
```json
{
  "success": true,
  "item": { /* Created item object */ }
}
```

---

#### 3. Update List Item

**Endpoint:** `PUT /items/:id` or `PATCH /items/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "item": { /* Updated item object */ }
}
```

---

#### 4. Delete List Item

**Endpoint:** `DELETE /items/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

## 🗄️ Data Models & Schema

### User Model

```typescript
{
  _id: ObjectId,
  name: string,              // Max 20 characters
  email: string,             // Unique
  password: string,          // Bcrypt hashed
  avatar: string,            // Cloudinary URL (optional)
  coupleId: ObjectId,        // Reference to Couple
  googleId: string,          // Google OAuth ID (optional)
  googleAccessToken: string, // For Calendar API (optional)
  googleRefreshToken: string,// For Calendar API (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Validation:**
- `name`: Required, max 20 characters
- `email`: Required, unique, valid email format
- `password`: Required, minimum 6 characters (hashed with bcrypt)

---

### Couple Model

```typescript
{
  _id: ObjectId,
  partner1: ObjectId,        // Reference to User (creator)
  partner2: ObjectId | null, // Reference to User (joiner), null if not joined
  secretCode: string,        // 6-character hex code (uppercase), unique
  nextMeetingDate: Date | null,
  createdAt: Date
}
```

**Secret Code:**
- Format: 6 uppercase hexadecimal characters (e.g., "A3F5E2")
- Generated using: `crypto.randomBytes(3).toString('hex').toUpperCase()`
- Used for pairing couples

---

### Post Model

```typescript
{
  _id: ObjectId,
  author: ObjectId,          // Reference to User
  coupleId: ObjectId,        // Reference to Couple
  content: string,           // Required
  mood: string,              // Enum: happy, sad, excited, tired, romantic, angry, chill
  images: string[],          // Array of Cloudinary URLs
  date: Date,                // User-selectable date (can be backdated)
  createdAt: Date,
  updatedAt: Date
}
```

**Notes:**
- `date` field allows users to journal about past events
- Images stored as Cloudinary URLs (not base64)
- Max 50 posts returned per request (sorted by date, descending)

---

### Event Model

```typescript
{
  _id: ObjectId,
  title: string,             // Required
  date: string,              // Format: YYYY-MM-DD
  coupleId: ObjectId,        // Reference to Couple
  createdAt: Date,
  updatedAt: Date
}
```

---

### TimelineMoment Model

```typescript
{
  _id: ObjectId,
  coupleId: ObjectId,        // Reference to Couple
  title: string,             // Required
  description: string,       // Optional
  date: Date,                // Required
  image: string,             // Cloudinary URL (optional)
  iconType: string,          // Enum: heart, ring, plane, home, star, camera
  createdAt: Date,
  updatedAt: Date
}
```

---

### ListItem Model

```typescript
{
  _id: ObjectId,
  title: string,             // Required
  type: string,              // Enum: movie, song
  status: string,            // Enum: pending, completed
  link: string,              // Optional URL (e.g., IMDb, Spotify)
  addedBy: ObjectId,         // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure

**Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe",
  "coupleId": "507f1f77bcf86cd799439012",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Expiry:** 30 days

### Password Security

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Never stored in plain text
- Never returned in API responses

### Token Storage (Mobile App)

**Recommended Approach:**
1. Store JWT token in secure storage (e.g., iOS Keychain, Android Keystore)
2. Include token in `Authorization: Bearer <token>` header for all authenticated requests
3. Handle token expiry gracefully (redirect to login)

**Example:**
```javascript
// Store token after login
await SecureStore.setItemAsync('auth_token', token);

// Retrieve token for API calls
const token = await SecureStore.getItemAsync('auth_token');
```

### Authorization Rules

**Data Isolation:**
- All posts, events, timeline moments are scoped to `coupleId`
- Users can only access data belonging to their couple
- Secret code ensures only intended partners can join

**Permissions:**
- Both partners have equal access to all shared data
- Any partner can create, edit, or delete shared content
- Google Calendar sync is per-user (requires individual OAuth)

---

## 🎯 Features & User Flows

### 1. Onboarding Flow

#### Option A: Create New Room

```
1. User signs up with name, email, password
2. Selects "Create Room" action
3. Backend generates 6-character secret code
4. User receives secret code on dashboard
5. User shares code with partner (outside app)
6. Partner joins using the code
```

**Mobile UI Screens:**
1. Welcome/Landing screen
2. Sign up form (name, email, password)
3. Action selection: "Create Room" or "Join Room"
4. Success screen showing secret code (create) or confirmation (join)

#### Option B: Join Existing Room

```
1. User signs up with name, email, password
2. Selects "Join Room" action
3. Enters secret code received from partner
4. Backend validates code and links users
5. Both partners now see each other's content
```

---

### 2. Dashboard Flow

**Dashboard Components:**
1. **Header:**
   - App logo/title
   - Partner status indicator (solo vs. paired)

2. **Couple Status Card:**
   - Partner names and avatars
   - Days together (calculated from couple creation date)
   - Secret code (for inviting partner if solo)

3. **Countdown Timer:**
   - Displays countdown to `nextMeetingDate`
   - Editable by tapping
   - Shows "No date set" if null

4. **Posts Feed:**
   - Masonry/card grid layout
   - Real-time updates (poll every 3 seconds)
   - Each post shows:
     - Author name and avatar
     - Content text
     - Mood indicator (icon/color)
     - Images (if any)
     - Date
     - Edit/Delete buttons (for own posts)

5. **Quick Action Buttons:**
   - Add new memory
   - View timeline
   - Check calendar
   - Browse gallery

---

### 3. Journal/Memory Creation Flow

```
1. User taps "Write" or "Add Memory"
2. Opens editor screen with:
   - Text input for content
   - Mood selector (happy, romantic, sad, etc.)
   - Image picker (optional)
   - Date picker (defaults to today)
3. User writes content and selects mood
4. Optional: User uploads photo (compressed to 800px width, 70% quality)
5. User taps "Post"
6. Image uploaded to Cloudinary (if present)
7. Post created via API
8. User redirected to dashboard
9. New post appears in feed (via SWR revalidation)
```

**Image Compression Logic:**
- Max width: 800px
- Quality: 70% JPEG
- Convert to base64 → upload to Cloudinary → store URL

---

### 4. Timeline Flow

**Purpose:** Showcase relationship milestones chronologically

**UI:**
- Vertical timeline with nodes
- Each node has:
  - Icon (based on iconType)
  - Date
  - Title
  - Description
  - Optional image
- Sorted by date (oldest to newest)

**Actions:**
- Add new milestone
- Edit existing milestone
- Delete milestone

---

### 5. Calendar Flow

**Features:**
- Monthly calendar view
- Events displayed on dates
- Tap date to add event
- Tap event to view/delete

**Google Calendar Integration:**
- OAuth button in settings
- Syncs `nextMeetingDate` to Google Calendar
- Creates event titled "Next Date: Us & Ours"

---

### 6. Gallery Flow

**Implementation:** 
- Aggregate all images from posts
- Display in grid layout
- Tap to view full-screen
- Show post content and date as caption

---

### 7. Movie Watchlist Flow

**Features:**
- Two tabs: "To Watch" (pending) and "Watched" (completed)
- Each item shows:
  - Movie title
  - Added by (user name)
  - Optional IMDb link
- Actions:
  - Add new movie
  - Mark as watched
  - Delete

---

### 8. Playlist Flow

**Same as movie watchlist but for songs:**
- "To Listen" vs. "Listened"
- Optional Spotify/YouTube link

---

## 🎨 UI/UX Design System

### Color Palette

**Primary Colors:**
```css
--rose-50:  #fff1f2   /* Lightest backgrounds */
--rose-100: #ffe4e6   /* Light backgrounds */
--rose-200: #fecdd3   /* Borders, dividers */
--rose-300: #fda4af   /* Subtle accents */
--rose-400: #fb7185   /* Primary pink */
--rose-500: #f43f5e   /* Vibrant pink (buttons) */
--rose-900: #4a0416   /* Dark text */
```

**Secondary Colors:**
```css
--lavender-100: #f3e8ff
--lavender-200: #e9d5ff
--lavender-300: #d8b4fe
--lavender-400: #c084fc
```

**Neutrals:**
```css
--cream:  #fffdd0
--paper:  #fdfbf7
--white:  #ffffff
--background: #fff0f3  /* Light pink */
--foreground: #4a0416  /* Dark brown */
```

---

### Typography

**Font Families:**
- **Headings:** Nunito (weights: 400, 600, 700, 800)
- **Body:** Quicksand (weights: 400, 500, 600, 700)

**Font Sizes:**
```css
xs:   12px
sm:   14px
base: 16px
lg:   18px
xl:   20px
2xl:  24px
3xl:  30px
4xl:  36px
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

---

### Glass Morphism Effect

**Primary Glass Card Style:**
```css
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(25px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.6);
border-radius: 24px;
box-shadow: 
  0 10px 30px -5px rgba(0, 0, 0, 0.05),
  0 4px 6px -2px rgba(0, 0, 0, 0.01);
```

**Hover Effect:**
```css
background: rgba(255, 255, 255, 0.75);
transform: translateY(-4px) scale(1.01);
transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
box-shadow: 0 20px 40px -5px rgba(255, 100, 150, 0.3);
```

**Shine Effect Overlay:**
```css
background: linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0.2),
  transparent
);
```

---

### Animated Background

**Gradient Animation:**
```css
background: linear-gradient(
  -45deg,
  #ff9a9e, #fad0c4, #fad0c4, #fbc2eb, #a18cd1
);
background-size: 400% 400%;
animation: gradient-flow 15s ease infinite;

@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

### Border Radius

```css
rounded-lg:     8px
rounded-xl:     12px
rounded-2xl:    16px
rounded-3xl:    24px
rounded-4xl:    40px
rounded-cutesy: 48px
```

---

### Shadows

**Elevation Levels:**
```css
/* Small */
0 1px 3px rgba(0, 0, 0, 0.12),
0 1px 2px rgba(0, 0, 0, 0.24)

/* Medium */
0 10px 30px -5px rgba(0, 0, 0, 0.05),
0 4px 6px -2px rgba(0, 0, 0, 0.01)

/* Large */
0 20px 40px -5px rgba(255, 100, 150, 0.3)
```

---

### Mood Colors

Each mood has an associated color for visual distinction:

```javascript
const moodColors = {
  happy:    { icon: '😊', color: '#FFD700', bg: '#FFF8DC' }, // Gold
  romantic: { icon: '💕', color: '#F43F5E', bg: '#FFE4E6' }, // Rose
  sad:      { icon: '😢', color: '#3B82F6', bg: '#DBEAFE' }, // Blue
  excited:  { icon: '🎉', color: '#F59E0B', bg: '#FEF3C7' }, // Amber
  tired:    { icon: '😴', color: '#8B5CF6', bg: '#EDE9FE' }, // Purple
  angry:    { icon: '😠', color: '#EF4444', bg: '#FEE2E2' }, // Red
  chill:    { icon: '😎', color: '#10B981', bg: '#D1FAE5' }  // Green
};
```

---

### Icon Library

Use **Lucide** icons (or equivalent in mobile):
- Home
- PenTool (Journal)
- Image (Gallery)
- Calendar
- Film (Movies)
- Music (Playlist)
- Heart (Love/Timeline)
- Plus (Add)
- Trash (Delete)
- Edit (Edit)
- Camera (Photo)
- LogOut

---

### Animations

**Page Transitions:**
```javascript
// Fade in from bottom
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5 }
```

**Stagger Children:**
```javascript
container: {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

**Float Animation:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
animation: float 6s ease-in-out infinite;
```

**Heartbeat Animation:**
```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}
animation: heartbeat 1.5s ease-in-out infinite;
```

---

### Button Styles

**Primary Button:**
```css
background: linear-gradient(135deg, #F43F5E, #FB7185);
color: white;
padding: 12px 24px;
border-radius: 16px;
font-weight: 700;
box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(244, 63, 94, 0.4);
```

**Secondary Button:**
```css
background: rgba(255, 255, 255, 0.7);
color: #4A0416;
padding: 12px 24px;
border-radius: 16px;
border: 1px solid rgba(244, 63, 94, 0.2);
backdrop-filter: blur(10px);
```

---

### Mobile Spacing

```css
px-4:  16px horizontal padding
py-3:  12px vertical padding
gap-4: 16px gap between elements
mb-6:  24px margin bottom
mt-8:  32px margin top
```

---

### Responsive Breakpoints (for reference)

```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

---

## ⚡ Real-Time Updates

### Polling Strategy

The web app uses **SWR** with 3-second polling for real-time updates.

**For Mobile Apps:**

**Option 1: Polling (Simple)**
```javascript
// Fetch posts every 3 seconds
const interval = setInterval(() => {
  fetchPosts();
}, 3000);
```

**Option 2: WebSockets (Advanced)**
- Backend doesn't currently support WebSockets
- Would require backend modification
- More efficient for battery/data

**Option 3: Firebase Cloud Messaging (Recommended)**
- Push notifications for new posts/events
- Less battery drain
- Better UX

**Recommended Approach:**
- Use polling every 5-10 seconds when app is active
- Use push notifications when app is in background
- Implement pull-to-refresh

---

## 📸 Image & Media Handling

### Image Upload Flow

1. **User selects image** from camera/gallery
2. **Compress image** (max 800px width, 70% quality)
3. **Get Cloudinary signature** from API
   ```
   GET /auth/cloudinary-sign
   ```
4. **Upload to Cloudinary** directly from mobile
   ```
   POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
   ```
5. **Receive Cloudinary URL**
6. **Include URL in post** creation
   ```
   POST /posts
   {
     "content": "...",
     "images": ["https://res.cloudinary.com/..."]
   }
   ```

### Cloudinary Configuration

**Upload Endpoint:**
```
https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
```

**Required Parameters:**
- `file`: Image file or base64 data
- `timestamp`: Unix timestamp
- `signature`: HMAC SHA256 signature
- `api_key`: Your Cloudinary API key

**Example Upload (React Native):**
```javascript
const uploadImage = async (imageUri) => {
  // Get signature from backend
  const { signature, timestamp, cloudName, apiKey } = 
    await fetchCloudinarySignature();
  
  // Prepare form data
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg'
  });
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);
  
  // Upload to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  const data = await response.json();
  return data.secure_url; // Cloudinary URL
};
```

### Image Compression Guidelines

**Before Upload:**
- Max width: 800px
- Max height: 800px (maintain aspect ratio)
- Format: JPEG
- Quality: 70%
- Max file size: 500KB (recommended)

**Libraries:**
- React Native: `react-native-image-picker` + `react-native-image-resizer`
- Flutter: `image_picker` + `flutter_image_compress`

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/us-and-ours

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

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

### Mobile App Configuration

**API Base URL:**
```javascript
const API_BASE_URL = 
  __DEV__ 
    ? 'http://localhost:5000'  // Development
    : 'https://api.your-domain.com';  // Production
```

**Cloudinary:**
- Cloud name: Provided by `/auth/cloudinary-sign` endpoint
- API key: Provided by `/auth/cloudinary-sign` endpoint
- Signature: Generated by backend for secure uploads

---

## 📱 Mobile-Specific Considerations

### 1. Navigation Structure

**Recommended Tab Bar:**
```
┌────────┬────────┬────────┬────────┬────────┐
│  Home  │Timeline│Journal │Calendar│ More   │
│   🏠   │   📖   │   ✏️   │   📅   │   ⋯    │
└────────┴────────┴────────┴────────┴────────┘
```

**"More" Tab:**
- Gallery
- Movies
- Playlist
- Settings
- Logout

---

### 2. Authentication Persistence

**Flow:**
1. User logs in → Receive JWT token
2. Store token in secure storage (Keychain/Keystore)
3. On app launch, check for stored token
4. If token exists, validate with `/auth/me`
5. If valid, navigate to Dashboard
6. If invalid/expired, navigate to Login

---

### 3. Offline Support

**Considerations:**
- Cache posts/events locally using AsyncStorage or SQLite
- Queue write operations when offline
- Sync when connection restored
- Show offline indicator in UI

---

### 4. Push Notifications (Future Enhancement)

**Use Cases:**
- Partner posted a new memory
- Upcoming event reminder
- Partner marked movie as watched
- New timeline moment added

**Implementation:** Requires backend integration with FCM/APNs (not currently implemented)

---

### 5. Deep Linking

**Suggested Deep Links:**
- `usandours://invite/{secretCode}` - Share invite link
- `usandours://post/{postId}` - Share specific post
- `usandours://timeline/{momentId}` - Share timeline moment

---

### 6. Image Caching

**Libraries:**
- React Native: `react-native-fast-image`
- Flutter: `cached_network_image`

**Strategy:**
- Cache images indefinitely (posts are not frequently deleted)
- Clear cache on logout

---

### 7. Date Handling

**Library:** Use `date-fns` or `moment.js`

**Timezone Considerations:**
- All dates stored as UTC in database
- Convert to user's local timezone for display
- Use `toISOString()` when sending dates to API

**Example:**
```javascript
import { format } from 'date-fns';

// Display date
const displayDate = format(new Date(post.date), 'MMM dd, yyyy');

// Send to API
const apiDate = new Date().toISOString();
```

---

### 8. Error Handling

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (e.g., trying to join full room)
- `404`: Not found (e.g., invalid secret code)
- `500`: Server error

**Recommended Error Messages:**
```javascript
const errorMessages = {
  400: "Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you're looking for.",
  500: "Something went wrong on our end. Please try again later.",
  network: "Please check your internet connection."
};
```

---

### 9. Loading States

**Best Practices:**
- Show skeleton screens while loading data
- Use pull-to-refresh for manual updates
- Show progress indicator during uploads
- Disable buttons during submission to prevent double-posting

---

### 10. Empty States

**When to Show:**
- No posts yet: "Start by sharing your first memory!"
- No events: "Add your first event to the calendar"
- No timeline moments: "Create your first milestone"
- Partner not joined yet: "Share your secret code with your partner"

---

## 🔄 Data Synchronization

### Initial Load

1. **App Launch:**
   - Validate stored JWT
   - Fetch `/auth/me` (user data)
   - Fetch `/couple` (couple data)

2. **Dashboard:**
   - Fetch `/posts` (recent memories)
   - Fetch `/events` (calendar events)

3. **Other Screens:**
   - Fetch data on navigation (lazy loading)

### Real-Time Sync

**Polling Intervals:**
- Dashboard posts: Every 3-5 seconds
- Couple data: On focus (no polling needed)
- Events: On focus
- Timeline: On focus

**Optimistic Updates:**
- Update UI immediately when user creates/deletes content
- Revert if API call fails
- Show success/error toast

---

## 🧪 Testing Recommendations

### Test Scenarios

1. **Authentication:**
   - Create room and receive secret code
   - Join room with valid code
   - Join room with invalid code
   - Login with correct credentials
   - Login with incorrect credentials
   - Token expiry handling

2. **Posts:**
   - Create post without image
   - Create post with image
   - Edit own post
   - Delete own post
   - View partner's posts
   - Real-time post updates

3. **Couple:**
   - Solo user sees invite prompt
   - Paired users see each other's info
   - Update next meeting date
   - Countdown timer accuracy

4. **Timeline:**
   - Create milestone with different icons
   - Edit milestone
   - Delete milestone
   - Chronological sorting

5. **Events:**
   - Create calendar event
   - Delete event
   - View events by date

6. **Lists:**
   - Add movie/song
   - Mark as completed
   - Delete item
   - Filter by type

7. **Edge Cases:**
   - Network failures
   - Slow connections
   - Expired tokens
   - Empty states
   - Large images

---

## 📝 API Rate Limiting (Future Consideration)

**Current Implementation:** No rate limiting

**Recommendation for Production:**
- Implement rate limiting on backend (e.g., 100 requests per minute per user)
- Handle `429 Too Many Requests` gracefully in mobile app
- Show user-friendly message: "You're going too fast! Take a breather."

---

## 🔒 Security Best Practices

### For Mobile App

1. **Store tokens securely:**
   - Use Keychain (iOS) or Keystore (Android)
   - Never store in AsyncStorage/SharedPreferences

2. **Use HTTPS:**
   - Always use HTTPS for API calls
   - Pin SSL certificates (advanced)

3. **Validate inputs:**
   - Client-side validation before API calls
   - Sanitize user inputs

4. **Handle tokens carefully:**
   - Don't log tokens
   - Clear tokens on logout
   - Refresh expired tokens gracefully

5. **Protect sensitive data:**
   - Don't cache sensitive data unnecessarily
   - Clear caches on logout

---

## 🎯 Key Differentiators for Mobile App

### Must-Have Features

1. **Push Notifications:**
   - "Your partner shared a new memory!"
   - "Upcoming: [Event Name] in 1 day"

2. **Biometric Authentication:**
   - Face ID / Touch ID for app unlock
   - Adds privacy layer

3. **Camera Integration:**
   - Capture photo directly in app
   - Apply filters/effects

4. **Widget Support:**
   - Countdown timer widget
   - Latest memory widget

5. **Share Extension:**
   - Share photos from gallery directly to app
   - Share URLs to movie/music list

6. **Haptic Feedback:**
   - Subtle feedback on interactions
   - Enhances premium feel

---

## 📞 API Testing

### Using cURL

**Login:**
```bash
curl -X POST https://api.your-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Posts:**
```bash
curl -X GET https://api.your-domain.com/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Post:**
```bash
curl -X POST https://api.your-domain.com/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Missing you today!",
    "mood": "romantic",
    "images": []
  }'
```

---

## 🚀 Deployment Information

### Backend Deployment

**Recommended Platforms:**
- **Railway:** Easy deployment, automatic HTTPS
- **Render:** Free tier available
- **Heroku:** Simple, well-documented
- **AWS/GCP/Azure:** Production-grade, scalable

**Required:**
- Node.js 18+
- MongoDB Atlas connection
- Environment variables configured

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

---

### Database (MongoDB Atlas)

**Current Setup:**
- Cloud-hosted MongoDB
- Connection string in environment variable
- Automatic backups recommended

**Collections:**
- `users`
- `couples`
- `posts`
- `events`
- `timelinemoments`
- `listitems`

---

## 📚 Additional Resources

### Web App Repository
- GitHub: `vaishali-gupta32/Us-and-Ours`
- Frontend: `/client` directory (Next.js)
- Backend: `/server` directory (Express.js)

### Technologies to Research
- **JWT Authentication:** jsonwebtoken.io
- **MongoDB Mongoose:** mongoosejs.com
- **Cloudinary:** cloudinary.com/documentation
- **Google OAuth:** developers.google.com/identity
- **SWR:** swr.vercel.app

---

## ✅ Implementation Checklist for Mobile Developers

### Phase 1: Authentication & Core
- [ ] Implement authentication screens (login, signup)
- [ ] Implement secure token storage
- [ ] Create room flow (generate/display secret code)
- [ ] Join room flow (input secret code)
- [ ] Auto-login with stored token

### Phase 2: Dashboard & Posts
- [ ] Dashboard layout with navigation
- [ ] Posts feed (cards, masonry layout)
- [ ] Post creation (text + mood + image)
- [ ] Image upload to Cloudinary
- [ ] Post edit/delete
- [ ] Real-time polling (3-5 seconds)

### Phase 3: Additional Features
- [ ] Timeline screen (milestones)
- [ ] Calendar screen (events)
- [ ] Gallery screen (image aggregation)
- [ ] Movies watchlist
- [ ] Playlist
- [ ] Countdown timer

### Phase 4: Couple Management
- [ ] Couple status card
- [ ] Partner info display
- [ ] Secret code sharing
- [ ] Next meeting date picker

### Phase 5: Polish & Enhancement
- [ ] Push notifications
- [ ] Offline support
- [ ] Biometric authentication
- [ ] Deep linking
- [ ] Widgets
- [ ] Share extensions
- [ ] Error handling & empty states
- [ ] Loading states & animations

---

## 💬 Support & Contact

For questions or clarifications about this documentation:
- **Repository Owner:** vaishali-gupta32
- **Repository:** https://github.com/vaishali-gupta32/Us-and-Ours

---

## 📄 License & Usage

This documentation is provided to facilitate mobile app development for the "Us and Ours" platform. The code and design remain proprietary to the original creators.

---

**Last Updated:** February 2024  
**Version:** 1.0  
**Documentation Status:** Complete

---

## 🎉 Good Luck!

This documentation contains everything you need to build an amazing mobile experience for "Us and Ours". Focus on the premium, romantic feel—every interaction should make couples feel special and connected.

**Key Principles:**
1. **Privacy First:** Data isolation is paramount
2. **Beautiful UI:** Glass morphism, smooth animations, premium feel
3. **Real-Time:** Keep couples connected with instant updates
4. **Simple Yet Powerful:** Easy to use, rich in features

Happy coding! 💖
