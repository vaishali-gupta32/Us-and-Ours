# Us and Ours - Business Logic & Workflows

## 📘 Overview

This document details the business logic, user workflows, and feature specifications for "Us and Ours" - a private digital space for couples.

---

## 🎯 Core Business Model

### Value Proposition

**For Long-Distance Couples:**
- Private space to share daily moments
- Real-time connection despite physical distance
- Digital scrapbook of relationship memories
- Tools for planning and staying organized

**Key Features:**
1. **Privacy-First**: Each couple has isolated data
2. **Real-Time**: Instant updates, always in sync
3. **Rich Media**: Photos, moods, timeline
4. **Planning Tools**: Calendar, countdown, watchlists

---

## 👥 User Roles & Permissions

### Role: Partner

**There are only 2 roles, both equal:**
- Partner 1 (Creator)
- Partner 2 (Joiner)

**Permissions (Equal for Both):**
- ✅ View all couple data
- ✅ Create posts/memories
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Add timeline moments
- ✅ Edit timeline moments
- ✅ Delete timeline moments
- ✅ Add calendar events
- ✅ Delete calendar events
- ✅ Add movies/songs
- ✅ Mark items as completed
- ✅ Update next meeting date
- ✅ View secret code

**No admin/owner hierarchy - complete equality**

---

## 🔄 Complete User Flows

### 1. Onboarding Flow

#### Scenario A: Creating a New Room

```
Step 1: User opens app for first time
  ↓
Step 2: User taps "Get Started"
  ↓
Step 3: User fills signup form:
  - Name
  - Email
  - Password
  - Selects "Create Room"
  ↓
Step 4: Backend creates:
  - User account
  - Couple record with unique secret code
  - Links user as partner1
  ↓
Step 5: User sees dashboard with:
  - Welcome message
  - Secret code prominently displayed
  - "Waiting for partner" indicator
  - Copy code button
  ↓
Step 6: User shares code with partner
  (via SMS, WhatsApp, etc.)
```

**Business Rules:**
- Secret code is 6 characters (hex, uppercase)
- Code must be unique across all couples
- User can view code anytime from dashboard
- Dashboard shows "solo mode" until partner joins

---

#### Scenario B: Joining Existing Room

```
Step 1: User opens app for first time
  ↓
Step 2: User receives secret code from partner
  ↓
Step 3: User taps "Get Started"
  ↓
Step 4: User fills signup form:
  - Name
  - Email
  - Password
  - Selects "Join Room"
  - Enters secret code
  ↓
Step 5: Backend validates:
  - Code exists
  - Room not full (partner2 is null)
  - If valid, links user as partner2
  ↓
Step 6: User sees dashboard with:
  - Partner's name and avatar
  - Existing posts/memories
  - Full access to all features
  ↓
Step 7: Partner 1 sees automatic update:
  - "Your partner joined!"
  - Partner 2's name appears
  - Secret code becomes read-only reference
```

**Business Rules:**
- Invalid code → Error message
- Room full → Cannot join
- Once joined, cannot change couple
- Both partners immediately see each other's content

---

### 2. Daily Usage Flow

#### Morning Routine

```
User opens app
  ↓
Dashboard loads:
  - Shows recent memories (last 10)
  - Displays days together
  - Shows countdown to next meeting
  - Polls for new posts every 3 seconds
  ↓
User sees partner posted overnight
  ↓
User taps to read post
  ↓
User reacts mentally (no like/comment feature)
  ↓
User decides to post own memory
```

---

#### Creating a Memory

```
User taps "Write" or "+" button
  ↓
Write screen opens:
  - Empty text field
  - Mood selector at top
  - Camera button
  ↓
User selects mood (e.g., "Romantic")
  ↓
User types content:
  "Missing you so much today! Can't stop
   thinking about our last video call 💕"
  ↓
[Optional] User taps camera icon
  ↓
User selects photo from gallery or takes new
  ↓
Image compresses automatically (800px, 70%)
  ↓
User taps "Post"
  ↓
Upload flow:
  1. Image uploads to Cloudinary (if present)
  2. Post created with content + mood + image URL
  3. User returns to dashboard
  ↓
New post appears immediately (optimistic update)
  ↓
Partner's app fetches new posts (within 3 seconds)
  ↓
Partner sees new post appear with smooth animation
```

**Business Rules:**
- Content is required (cannot post empty)
- Mood defaults to "happy" if not selected
- Images are optional
- Multiple images NOT supported (single image per post)
- Posts dated to "now" by default
- User can edit own posts anytime
- User can delete own posts anytime
- Cannot edit/delete partner's posts

---

### 3. Timeline Management

**Purpose:** Document relationship milestones chronologically

```
User navigates to "Our Story" / Timeline
  ↓
Sees existing milestones:
  • First Date - Jun 15, 2023
  • First Kiss - Jun 20, 2023
  • Said "I Love You" - Jul 4, 2023
  • Anniversary - Jun 15, 2024
  ↓
User taps "+" to add new milestone
  ↓
Modal opens:
  - Title field
  - Description field
  - Date picker
  - Icon selector (heart, ring, plane, home, star, camera)
  - Optional image upload
  ↓
User fills:
  Title: "Met Her Parents"
  Description: "Nervous but they loved me!"
  Date: Dec 25, 2023
  Icon: Home
  Image: [Family photo]
  ↓
User taps "Save"
  ↓
Timeline updates with new moment in chronological order
  ↓
Partner sees update within 3 seconds
```

**Business Rules:**
- Timeline sorted by date (oldest first)
- Both partners can add moments
- Both partners can edit any moment
- Both partners can delete any moment
- Images optional
- Icons help categorize moments
- No limit on number of moments

---

### 4. Calendar & Event Management

**Purpose:** Plan future dates, visits, anniversaries

```
User navigates to Calendar
  ↓
Sees month view with existing events:
  • Feb 14 - Valentine's Dinner
  • Mar 1 - Flight to Visit
  • Jun 15 - Our Anniversary
  ↓
User taps a date (e.g., Mar 15)
  ↓
Modal opens to add event:
  - Title: "Spring Break Together"
  - Date: Mar 15, 2024 (pre-filled)
  ↓
User taps "Add Event"
  ↓
Event appears on calendar
  ↓
Partner sees new event within 3 seconds
```

**Business Rules:**
- Events stored as simple title + date
- No time or location (intentionally simple)
- Both partners can add events
- Both partners can delete events
- No editing (delete & recreate instead)

**Special Event: Next Meeting Date**

```
User taps countdown timer on dashboard
  ↓
Date picker modal opens
  ↓
User selects: Feb 28, 2024
  ↓
Countdown updates to show:
  "42 Days, 6 Hours, 23 Minutes"
  ↓
Backend also creates calendar event: "Next Date ❤️"
  ↓
[If Google Calendar connected]
  Backend syncs event to both partners' Google Calendars
```

**Business Rules:**
- Only one "next meeting date" at a time
- Updating it replaces the previous one
- Creates calendar event automatically
- Google Calendar sync optional

---

### 5. Movie Watchlist Workflow

**Purpose:** Track movies to watch together

```
User navigates to "Movies"
  ↓
Sees two tabs:
  - To Watch (pending)
  - Watched (completed)
  ↓
User taps "+" to add movie
  ↓
Modal opens:
  - Title: "The Notebook"
  - Link (optional): https://www.imdb.com/title/tt0332280/
  ↓
User taps "Add"
  ↓
Movie appears in "To Watch" list
  ↓
Later, after watching together:
  User taps checkbox/mark complete
  ↓
Movie moves to "Watched" tab
  ↓
Partner sees update in real-time
```

**Business Rules:**
- Type = "movie"
- Status: pending or completed
- Link optional (IMDb, streaming service)
- Either partner can add movies
- Either partner can mark as watched
- Either partner can delete movies
- Deleted items gone forever (no undo)

---

### 6. Playlist Workflow

**Identical to movies but for songs:**

```
User navigates to "Playlist"
  ↓
Adds song:
  - Title: "Our Song - Taylor Swift"
  - Link: https://open.spotify.com/track/...
  ↓
Status: To Listen / Listened
```

**Business Rules:**
- Same as movies, just type = "song"
- Use for "our songs" collection

---

### 7. Gallery Workflow

**Purpose:** View all photos in one place

```
User navigates to Gallery
  ↓
App fetches all posts with images
  ↓
Displays images in grid/masonry layout
  ↓
User taps image
  ↓
Full-screen view opens with:
  - Image
  - Associated post content
  - Date
  - Author
```

**Business Rules:**
- Gallery auto-aggregates from posts
- No separate upload (must be part of post)
- Chronological or reverse chronological
- Images link back to original post

---

## 🔐 Data Privacy & Security

### Privacy Guarantees

1. **Complete Isolation:**
   - Each couple's data is filtered by `coupleId`
   - Impossible to access another couple's data
   - Backend enforces on every query

2. **Secret Code Security:**
   - 6-character hex = 16^6 = 16,777,216 combinations
   - Unique constraint prevents duplicates
   - Code shown only to room creator
   - Cannot be changed after creation

3. **Authentication Security:**
   - Passwords hashed with bcrypt (10 salt rounds)
   - JWT tokens expire after 30 days
   - Tokens stored securely (Keychain/Keystore)
   - No password reset flow (out of scope for v1)

---

## 📊 Data Ownership

### What Happens If...

**Partner leaves/deletes account:**
- Currently: No delete account feature
- Future: Consider soft delete, keep data

**Couple breaks up:**
- No mechanism to "divorce" couple
- Data remains linked
- Would need manual intervention

**Account recovery:**
- No forgot password flow in v1
- Consider adding email verification

---

## 🚀 Feature Prioritization

### MVP (Minimum Viable Product)

**Must-Have:**
- ✅ Authentication (create/join)
- ✅ Posts with mood and images
- ✅ Real-time updates (polling)
- ✅ Timeline milestones
- ✅ Calendar events
- ✅ Basic couple info

**Nice-to-Have (v1.1):**
- Push notifications
- Google Calendar sync
- Movie/playlist management

**Future (v2):**
- Video support
- Voice messages
- Shared to-do lists
- Photo filters/editing
- Export memories (PDF/book)

---

## 🎯 Key User Metrics (KPIs)

### Engagement Metrics

1. **Daily Active Users (DAU)**
   - Target: 70% of couples use daily

2. **Posts per User per Day**
   - Target: 1-2 posts average

3. **Session Duration**
   - Target: 5-10 minutes per session

4. **Retention Rate**
   - 7-day: 60%
   - 30-day: 40%

### Quality Metrics

1. **Time to First Post**
   - Target: <5 minutes after signup

2. **Partner Join Rate**
   - Target: 80% of created rooms get joined

3. **Churn Rate**
   - Target: <5% monthly

---

## 🎨 User Experience Principles

### 1. Simplicity First

- No complex navigation
- One action per screen
- Obvious primary action

### 2. Emotional Design

- Warm colors (rose, pink)
- Soft, rounded shapes
- Mood-based theming

### 3. Real-Time Feel

- 3-second polling
- Optimistic updates
- Smooth animations

### 4. Privacy-Focused

- No public profiles
- No social features
- Just the two of you

---

## 📱 Mobile-First Considerations

### Network Handling

**Online:**
- Normal operation
- 3-second polling

**Offline:**
- Show offline indicator
- Queue writes (posts, etc.)
- Sync when back online
- Cache read data locally

**Slow Network:**
- Show loading states
- Compress images aggressively
- Prioritize text over images

### Battery Optimization

**Active Use:**
- Poll every 3 seconds
- Full animations

**Background:**
- Stop polling
- Use push notifications instead

**Low Battery Mode:**
- Increase polling interval (10 seconds)
- Reduce animations
- Skip non-essential updates

---

## 🧪 Edge Cases & Error Handling

### 1. Secret Code Collision

**Scenario:** Generated code already exists

**Resolution:**
- Regenerate new code
- Keep trying until unique
- Extremely rare (1 in 16 million)

---

### 2. Partner Tries to Join Full Room

**Scenario:** Room already has 2 partners

**Resolution:**
- Show error: "This room is full"
- Suggest creating new room
- No way to force join

---

### 3. User Loses Token

**Scenario:** Token expired or deleted

**Resolution:**
- Auto-redirect to login
- User must log in again
- All data preserved

---

### 4. Image Upload Fails

**Scenario:** Cloudinary error or network issue

**Resolution:**
- Retry upload (3 attempts)
- If all fail, post without image
- Show error toast
- User can edit post later to add image

---

### 5. Polling Fails

**Scenario:** API unreachable

**Resolution:**
- Show cached data
- Display "Offline" indicator
- Retry with exponential backoff
- Resume normal polling when back

---

### 6. Both Partners Delete Same Post

**Scenario:** Race condition

**Resolution:**
- Server handles: first delete wins
- Second delete returns 404
- Client ignores 404 (already gone)

---

## 📈 Scalability Considerations

### Current Architecture

- Designed for hundreds of couples
- Single MongoDB instance
- No caching layer

### At Scale (Thousands of Couples)

**Database:**
- Index on `coupleId` for fast queries
- Index on `secretCode` for lookups
- Consider sharding by `coupleId`

**Caching:**
- Redis for frequently accessed data
- Cache couple info, user profiles
- Invalidate on writes

**Real-Time:**
- Move from polling to WebSockets
- More efficient at scale
- Better battery life

**Media:**
- Cloudinary handles CDN
- No server-side image processing
- Already optimized

---

## 🎓 User Education

### Onboarding Tips

**For Partner 1 (Creator):**
1. "Share your secret code with your partner"
2. "Your partner will need this code to join your space"
3. "You can find your code anytime in settings"

**For Partner 2 (Joiner):**
1. "Ask your partner for the secret code"
2. "Enter the 6-character code to join"
3. "You'll instantly see all your shared memories"

### Feature Discovery

**In-App Tips:**
- First login: "Start by sharing your first memory!"
- After first post: "Add a special moment to your timeline"
- After 1 week: "Did you know you can add movies to watch together?"

---

## 🎯 Success Criteria

### For MVP Launch

1. ✅ Users can create and join rooms
2. ✅ Users can post memories with photos
3. ✅ Real-time updates work consistently
4. ✅ Data privacy is guaranteed
5. ✅ Mobile app matches web design aesthetic

### For v1.0

1. Push notifications working
2. Google Calendar sync functional
3. 80% user satisfaction score
4. <2 second average API response time
5. 99.9% uptime

---

## 📋 Launch Checklist

### Pre-Launch

- [ ] All core features implemented
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Beta testing with real couples
- [ ] Privacy policy finalized
- [ ] Terms of service drafted
- [ ] App store assets prepared

### Launch Day

- [ ] Submit to App Store
- [ ] Submit to Google Play
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Enable analytics
- [ ] Announce to early adopters

### Post-Launch

- [ ] Monitor crash reports
- [ ] Respond to user feedback
- [ ] Track KPIs daily
- [ ] Iterate based on data

---

## 💡 Future Feature Ideas

### Short-Term (3-6 months)

1. **Push Notifications**
   - "Your partner posted a memory"
   - "Upcoming event tomorrow"

2. **Rich Text Editing**
   - Bold, italic, emoji picker
   - Better formatting

3. **Voice Messages**
   - Record and attach voice notes
   - Alternative to text

### Medium-Term (6-12 months)

1. **Video Support**
   - Upload short videos
   - Bigger file sizes

2. **Themes**
   - Dark mode
   - Color customization
   - Custom backgrounds

3. **Export**
   - Download all memories as PDF
   - Print photo book

### Long-Term (1+ years)

1. **Games**
   - Couple quizzes
   - Would you rather?
   - Shared challenges

2. **AI Features**
   - Memory recap (weekly/monthly)
   - Relationship insights
   - Photo enhancement

3. **Social (Optional)**
   - Share select moments publicly
   - Anniversary announcements
   - Opt-in only

---

**Last Updated:** February 2024  
**Version:** 1.0
