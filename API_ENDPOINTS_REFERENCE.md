# Us and Ours - Complete API Endpoints Reference

## 📋 Quick Reference

**Base URL:** `https://your-api-domain.com`

**Authentication:** JWT Bearer Token in `Authorization` header or cookie

---

## 🔐 Authentication Endpoints

### 1. POST `/auth/register`

Create a new user account and either create a new couple room or join an existing one.

**Request Body:**
```json
{
  "name": "string (required, max 20 chars)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "action": "string (required: 'create' or 'join')",
  "secretCode": "string (required only if action is 'join')"
}
```

**Success Response (201 - Create Room):**
```json
{
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "secretCode": "A3F5E2",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (201 - Join Room):**
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
- `400 Bad Request`: Missing required fields
- `400 Bad Request`: User already exists (email conflict)
- `400 Bad Request`: Secret code required (when joining)
- `400 Bad Request`: Invalid action (not 'create' or 'join')
- `404 Not Found`: Invalid secret code
- `403 Forbidden`: Room is full (already has 2 partners)

---

### 2. POST `/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
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
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

### 3. GET `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
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

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

---

### 4. POST `/auth/logout`

Log out the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. GET `/auth/cloudinary-sign`

Get a signature for uploading images to Cloudinary.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "signature": "1a2b3c4d5e6f...",
  "timestamp": 1234567890,
  "cloudName": "your-cloud-name",
  "apiKey": "123456789012345"
}
```

**Usage:** Use this signature to upload images directly to Cloudinary from the client.

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Cloudinary configuration issue

---

### 6. GET `/auth/google`

Initiate Google OAuth flow for calendar integration.

**No Request Body**

**Response:** Redirects to Google OAuth consent screen

**Scopes Requested:**
- `profile`
- `email`
- `https://www.googleapis.com/auth/calendar`

---

### 7. GET `/auth/google/callback`

Google OAuth callback handler.

**Query Parameters:**
- `code`: Authorization code from Google
- `error`: Error message (if authentication failed)

**Success Response:** Redirects to `{CLIENT_URL}/dashboard?success=calendar_connected`

**Error Response:** Redirects to `{CLIENT_URL}/dashboard?error={error_message}`

---

### 8. GET `/auth/google-status`

Check if user has connected Google Calendar.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "connected": true,
  "hasRefreshToken": true,
  "hasAccessToken": true,
  "googleEmail": "user@gmail.com"
}
```

---

## 📝 Posts Endpoints

### 1. GET `/posts`

Get all posts for the authenticated user's couple.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:** None

**Success Response (200):**
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
      "images": ["https://res.cloudinary.com/..."],
      "date": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "currentUser": "507f1f77bcf86cd799439012"
}
```

**Notes:**
- Returns maximum 50 posts
- Sorted by date (newest first)
- Includes author information (populated)
- If user not in couple, returns only user's own posts

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Database error

---

### 2. POST `/posts`

Create a new post (journal entry/memory).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string (required)",
  "mood": "string (optional: happy|sad|excited|tired|romantic|angry|chill)",
  "images": ["string (array of Cloudinary URLs, optional)"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "author": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "avatar": "https://..."
    },
    "content": "Had an amazing day!",
    "mood": "happy",
    "images": ["https://res.cloudinary.com/..."],
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User not in a couple
- `400 Bad Request`: Missing content
- `500 Server Error`: Database error

---

### 3. PUT `/posts/:id`

Update an existing post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Post ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "content": "string (optional)",
  "mood": "string (optional)",
  "images": ["string (array, optional)"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "post": {
    /* Updated post object */
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Post not found
- `500 Server Error`: Database error

---

### 4. DELETE `/posts/:id`

Delete a post.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Post ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Post not found
- `500 Server Error`: Database error

---

## 💑 Couple Endpoints

### 1. GET `/couple`

Get information about the authenticated user's couple.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "secretCode": "A3F5E2",
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

**Notes:**
- `partner2` can be `null` if second partner hasn't joined yet
- `nextMeetingDate` can be `null` if not set
- `secretCode` is always returned (for sharing/reference)

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Couple not found or user not in couple

---

### 2. PATCH `/couple`

Update couple information (currently supports next meeting date).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nextMeetingDate": "2024-02-14T00:00:00.000Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "couple": {
    /* Updated couple object */
  }
}
```

**Side Effects:**
1. Creates a calendar event titled "Next Date ❤️" on the specified date
2. Syncs event to both partners' Google Calendars (if connected)

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Couple not found
- `500 Server Error`: Database error

---

## 📅 Events Endpoints

### 1. GET `/events`

Get all calendar events for the couple.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Anniversary Dinner",
      "date": "2024-02-14",
      "coupleId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Notes:**
- Date format: `YYYY-MM-DD`
- Sorted by date (ascending)

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Database error

---

### 2. POST `/events`

Create a new calendar event.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required)",
  "date": "string (required, format: YYYY-MM-DD)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Movie Night",
    "date": "2024-01-20",
    "coupleId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Missing title or date
- `400 Bad Request`: Invalid date format
- `500 Server Error`: Database error

---

### 3. DELETE `/events/:id`

Delete a calendar event.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Event ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Event not found
- `500 Server Error`: Database error

---

## 📖 Timeline Endpoints

### 1. GET `/timeline`

Get all timeline moments for the couple.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "moments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "coupleId": "507f1f77bcf86cd799439012",
      "title": "First Date",
      "description": "Coffee shop on Main Street",
      "date": "2023-06-15T00:00:00.000Z",
      "image": "https://res.cloudinary.com/...",
      "iconType": "heart",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Icon Types:**
- `heart`: Love/Romance
- `ring`: Engagement/Marriage
- `plane`: Travel/Trips
- `home`: Moving in together
- `star`: Special moments
- `camera`: Photo memories

**Notes:**
- Sorted by date (ascending - oldest first)
- Forms a chronological story of the relationship

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Database error

---

### 2. POST `/timeline`

Create a new timeline moment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "date": "string (required, ISO 8601 format)",
  "image": "string (optional, Cloudinary URL)",
  "iconType": "string (optional: heart|ring|plane|home|star|camera, default: heart)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "moment": {
    "_id": "507f1f77bcf86cd799439011",
    "coupleId": "507f1f77bcf86cd799439012",
    "title": "First Kiss",
    "description": "Under the stars",
    "date": "2023-06-20T00:00:00.000Z",
    "image": "https://res.cloudinary.com/...",
    "iconType": "heart",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Missing required fields
- `500 Server Error`: Database error

---

### 3. PATCH `/timeline/:id`

Update an existing timeline moment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Timeline moment ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "date": "string (optional)",
  "image": "string (optional)",
  "iconType": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "moment": {
    /* Updated moment object */
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Moment not found
- `500 Server Error`: Database error

---

### 4. DELETE `/timeline/:id`

Delete a timeline moment.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Timeline moment ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Moment not found
- `500 Server Error`: Database error

---

## 🎬 List Items Endpoints (Movies & Playlist)

### 1. GET `/items`

Get list items (movies or songs).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): `movie` or `song` (returns all if not specified)

**Examples:**
- `/items` - Get all items
- `/items?type=movie` - Get only movies
- `/items?type=song` - Get only songs

**Success Response (200):**
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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Values:**
- `pending`: Not watched/listened yet
- `completed`: Watched/listened

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Server Error`: Database error

---

### 2. POST `/items`

Create a new list item (movie or song).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required)",
  "type": "string (required: movie|song)",
  "link": "string (optional, URL)",
  "status": "string (optional: pending|completed, default: pending)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "item": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Before Sunrise",
    "type": "movie",
    "status": "pending",
    "link": "https://www.imdb.com/title/tt0112471/",
    "addedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Missing required fields
- `400 Bad Request`: Invalid type or status
- `500 Server Error`: Database error

---

### 3. PUT/PATCH `/items/:id`

Update an existing list item (typically to mark as completed).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Item ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "item": {
    /* Updated item object */
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Item not found
- `500 Server Error`: Database error

---

### 4. DELETE `/items/:id`

Delete a list item.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Item ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Item not found
- `500 Server Error`: Database error

---

## 🔄 Common Patterns

### Authentication Header

All protected endpoints require one of:

**Option 1: Bearer Token (Recommended for Mobile)**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option 2: Cookie (Used in Web App)**
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Content-Type Header

For all POST, PUT, PATCH requests with JSON body:
```
Content-Type: application/json
```

---

### CORS Credentials

Web requests should include:
```javascript
fetch(url, {
  credentials: 'include'  // For cookie-based auth
})
```

---

### Error Response Format

All errors follow this structure:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

### Success Response Format

Most successful responses include:
```json
{
  "success": true,
  /* Additional data */
}
```

---

## 📊 Data Scoping

**Important:** All data (posts, events, timeline moments, list items) are scoped to `coupleId`. This ensures:
- Complete privacy between couples
- No data leakage
- Each couple has their own isolated space

**Implementation:**
- Backend automatically filters data by `req.user.coupleId`
- No need to pass `coupleId` in requests
- Derived from JWT token

---

## 🚀 Rate Limiting

**Current Status:** No rate limiting implemented

**Future Consideration:** 
- Recommended: 100 requests per minute per user
- Error code: `429 Too Many Requests`

---

## 📝 Notes

### MongoDB ObjectIds
- All IDs are MongoDB ObjectIds (24-character hex string)
- Example: `507f1f77bcf86cd799439011`

### Date Formats
- **ISO 8601** for full timestamps: `2024-01-15T10:30:00.000Z`
- **YYYY-MM-DD** for calendar events: `2024-01-15`

### Image URLs
- All images stored on Cloudinary
- Format: `https://res.cloudinary.com/{cloud_name}/{type}/{transformation}/{public_id}.{format}`

### Token Expiry
- JWT tokens expire after 30 days
- Implement refresh logic or re-login flow

---

## ✅ API Testing Checklist

- [ ] Test registration with "create" action
- [ ] Test registration with "join" action
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test token authentication
- [ ] Test CRUD operations for posts
- [ ] Test CRUD operations for events
- [ ] Test CRUD operations for timeline moments
- [ ] Test CRUD operations for list items
- [ ] Test couple data retrieval
- [ ] Test image upload signature generation
- [ ] Test error handling (401, 403, 404, 500)

---

**Last Updated:** February 2024  
**API Version:** 1.0
