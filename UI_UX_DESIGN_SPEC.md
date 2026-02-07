# Us and Ours - UI/UX Design Specification

## 🎨 Design Philosophy

**Us and Ours** is designed to feel premium, romantic, and intimate. Every element should evoke warmth, connection, and love.

### Core Design Principles

1. **Premium & Polished**: Glass morphism, smooth animations, high-quality visuals
2. **Romantic & Warm**: Soft pinks, gradients, heart motifs
3. **Private & Intimate**: Secure feeling, personal space for two
4. **Simple & Intuitive**: Easy to use, no learning curve
5. **Real-Time & Live**: Instant updates, always in sync

---

## 🎨 Color System

### Primary Palette

```
Rose/Pink Family (Primary Brand Colors)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
rose-50:  #fff1f2    ░░░░ Backgrounds, very light accents
rose-100: #ffe4e6    ░░░░ Light backgrounds, subtle highlights
rose-200: #fecdd3    ████ Borders, dividers, soft accents
rose-300: #fda4af    ████ Hover states, secondary buttons
rose-400: #fb7185    ████ Primary pink, active states
rose-500: #f43f5e    ████ Vibrant pink, call-to-action buttons
rose-900: #4a0416    ████ Dark text, headings, high contrast
```

### Secondary Palette

```
Lavender (Supporting Colors)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
lavender-100: #f3e8ff    ░░░░ Light purple backgrounds
lavender-200: #e9d5ff    ████ Soft purple accents
lavender-300: #d8b4fe    ████ Medium purple
lavender-400: #c084fc    ████ Vibrant purple highlights
```

### Neutral Colors

```
Warm Neutrals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cream:       #fffdd0    ░░░░ Warm off-white
paper:       #fdfbf7    ░░░░ Soft paper-like background
white:       #ffffff    ░░░░ Pure white for glass effects
background:  #fff0f3    ░░░░ Page background (light pink)
foreground:  #4a0416    ████ Body text (dark brown)
```

### Mood-Specific Colors

```
Mood Indicators
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Happy:     #FFD700 (Gold)     with bg #FFF8DC
Romantic:  #F43F5E (Rose)     with bg #FFE4E6
Sad:       #3B82F6 (Blue)     with bg #DBEAFE
Excited:   #F59E0B (Amber)    with bg #FEF3C7
Tired:     #8B5CF6 (Purple)   with bg #EDE9FE
Angry:     #EF4444 (Red)      with bg #FEE2E2
Chill:     #10B981 (Green)    with bg #D1FAE5
```

---

## ✍️ Typography

### Font Families

**Headings (Nunito):**
- Professional yet friendly
- Soft, rounded edges
- Great readability at large sizes
- Weights: 400, 600, 700, 800

**Body (Quicksand):**
- Clean, modern sans-serif
- Excellent for body text
- Friendly appearance
- Weights: 400, 500, 600, 700

### Font Scale

```
Display Text (App title, hero text)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4xl:  36px / 40px line height   Font: Nunito 800
3xl:  30px / 36px line height   Font: Nunito 700

Headings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2xl:  24px / 32px line height   Font: Nunito 700
xl:   20px / 28px line height   Font: Nunito 600
lg:   18px / 28px line height   Font: Nunito 600

Body Text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
base: 16px / 24px line height   Font: Quicksand 500
sm:   14px / 20px line height   Font: Quicksand 400
xs:   12px / 16px line height   Font: Quicksand 400
```

### Typography Usage

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component           Size    Weight  Font        Color
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App Title           3xl     800     Nunito      rose-900
Page Heading        2xl     700     Nunito      rose-900
Section Heading     xl      600     Nunito      rose-800
Card Title          lg      600     Nunito      rose-900
Body Text           base    500     Quicksand   rose-900
Secondary Text      sm      400     Quicksand   rose-600
Caption/Meta        xs      400     Quicksand   rose-500
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🖼️ Glass Morphism System

### Primary Glass Card

The signature design element of Us and Ours.

**CSS Properties:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.01);
}
```

**Hover State:**
```css
.glass-card:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-4px) scale(1.01);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 20px 40px -5px rgba(255, 100, 150, 0.3);
}
```

**Shine Overlay:**
```css
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  pointer-events: none;
}
```

### Glass Variants

**Light Glass (More transparent):**
```css
background: rgba(255, 255, 255, 0.35);
backdrop-filter: blur(15px);
```

**Dark Glass (For overlays):**
```css
background: rgba(0, 0, 0, 0.3);
backdrop-filter: blur(20px);
```

**Colored Glass (Gradient):**
```css
background: linear-gradient(
  to bottom right,
  rgba(255, 255, 255, 0.6),
  rgba(255, 255, 255, 0.2)
);
backdrop-filter: blur(25px);
```

---

## 🌈 Animated Background

### Gradient Flow Animation

**CSS:**
```css
body {
  background: linear-gradient(
    -45deg,
    #ff9a9e,  /* Soft coral */
    #fad0c4,  /* Peach */
    #fad0c4,  /* Peach (repeated for smooth flow) */
    #fbc2eb,  /* Light pink */
    #a18cd1   /* Soft purple */
  );
  background-size: 400% 400%;
  animation: gradient-flow 15s ease infinite;
}

@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Mobile Implementation:**
- Use same gradient but consider battery impact
- Option: Static gradient on low battery mode
- Consider reduced motion preferences

---

## 📐 Spacing System

### Scale

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Unit    Pixels    Usage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
xs      4px       Tight spacing, icon padding
sm      8px       Small gaps, list item padding
base    16px      Standard gaps, card padding
md      24px      Section spacing
lg      32px      Large section gaps
xl      48px      Major section divisions
2xl     64px      Page-level spacing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Component Spacing

```
Card Padding:         24px (base)
Button Padding:       12px vertical, 24px horizontal
Input Padding:        12px vertical, 16px horizontal
List Item Padding:    16px
Section Gap:          32px (lg)
Grid Gap:             16px (base)
```

---

## 🔘 Button Styles

### Primary Button

**Visual:**
```
┌─────────────────────────────────┐
│         Post Memory             │  ← Rose-500, White text
└─────────────────────────────────┘
  Gradient, Shadow, Rounded
```

**CSS:**
```css
.button-primary {
  background: linear-gradient(135deg, #F43F5E, #FB7185);
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
  transition: all 0.3s ease;
  border: none;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(244, 63, 94, 0.4);
}

.button-primary:active {
  transform: translateY(0);
}
```

### Secondary Button

**Visual:**
```
┌─────────────────────────────────┐
│          Cancel                 │  ← Glass, Rose text
└─────────────────────────────────┘
  Glass effect, Subtle border
```

**CSS:**
```css
.button-secondary {
  background: rgba(255, 255, 255, 0.7);
  color: #4a0416;
  padding: 12px 24px;
  border-radius: 16px;
  border: 1px solid rgba(244, 63, 94, 0.2);
  backdrop-filter: blur(10px);
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.button-secondary:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(244, 63, 94, 0.4);
}
```

### Icon Button

**Visual:**
```
┌────┐
│ ❤️  │  ← Small, circular or rounded square
└────┘
```

**CSS:**
```css
.button-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.button-icon:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}
```

---

## 📦 Card Designs

### Post Card

**Layout:**
```
┌────────────────────────────────────┐
│  👤 John Doe              😊       │  ← Header with avatar & mood
│  ────────────────────────────      │
│                                    │
│  Missing you so much today! ❤️     │  ← Content
│  Can't wait to see you soon.      │
│                                    │
│  [Image if present]                │  ← Optional image
│                                    │
│  Jan 15, 2024           ⋮          │  ← Footer with date & menu
└────────────────────────────────────┘
```

**Specs:**
- Background: Glass morphism
- Padding: 24px
- Border radius: 24px
- Shadow: Soft, elevation 2
- Max width: 500px (mobile full width)

### Couple Status Card

**Layout:**
```
┌────────────────────────────────────┐
│            Us & Ours               │  ← Title
│                                    │
│   👤 John        👤 Jane           │  ← Avatars
│   ────────❤️─────────              │  ← Connector
│                                    │
│   Together for 247 days            │  ← Stats
│                                    │
│   Secret Code: ABC123              │  ← Code (if solo)
│   [Copy Code]                      │
└────────────────────────────────────┘
```

### Countdown Card

**Layout:**
```
┌────────────────────────────────────┐
│      Next Meeting In               │  ← Title
│                                    │
│         45 Days                    │  ← Large number
│      12 Hours 34 Min               │  ← Additional precision
│                                    │
│   Feb 14, 2024 | Edit              │  ← Date & action
└────────────────────────────────────┘
```

---

## 🎭 Mood Indicators

### Visual Representation

Each mood has an icon, color, and background:

```
Happy 😊
  Icon: Smile
  Color: #FFD700 (Gold)
  Background: #FFF8DC (Cornsilk)
  Usage: Bright, cheerful posts

Romantic 💕
  Icon: Heart
  Color: #F43F5E (Rose)
  Background: #FFE4E6 (Rose-100)
  Usage: Love, affection, missing partner

Sad 😢
  Icon: Frown
  Color: #3B82F6 (Blue)
  Background: #DBEAFE (Blue-50)
  Usage: Feeling down, loneliness

Excited 🎉
  Icon: Sparkles
  Color: #F59E0B (Amber)
  Background: #FEF3C7 (Amber-50)
  Usage: Happy news, anticipation

Tired 😴
  Icon: Moon
  Color: #8B5CF6 (Purple)
  Background: #EDE9FE (Purple-50)
  Usage: Exhaustion, need rest

Angry 😠
  Icon: Alert
  Color: #EF4444 (Red)
  Background: #FEE2E2 (Red-50)
  Usage: Frustration, anger

Chill 😎
  Icon: Coffee
  Color: #10B981 (Green)
  Background: #D1FAE5 (Green-50)
  Usage: Relaxed, calm
```

### Implementation

**Mood Badge:**
```css
.mood-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.mood-happy {
  background: #FFF8DC;
  color: #B8860B;
}

.mood-romantic {
  background: #FFE4E6;
  color: #C11C3A;
}
/* etc. */
```

---

## 📱 Mobile Screen Layouts

### Dashboard Screen

```
┌─────────────────────────────────┐
│  ≡  Us and Ours          [❤️]  │  ← Header with menu & profile
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │   Couple Status Card      │ │  ← Pinned at top
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Countdown Timer         │ │  ← Second card
│  └───────────────────────────┘ │
│                                 │
│  Quick Actions                  │
│  [Write] [Timeline] [Gallery]  │  ← Action buttons
│                                 │
│  Recent Memories                │  ← Section header
│                                 │
│  ┌───────────────────────────┐ │
│  │   Post Card 1             │ │  ← Feed
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │   Post Card 2             │ │
│  └───────────────────────────┘ │
│  ...                            │
│                                 │
└─────────────────────────────────┘
│  [Home] [Timeline] [+] [Cal]  │  ← Bottom tab bar
└─────────────────────────────────┘
```

### Write/Journal Screen

```
┌─────────────────────────────────┐
│  [←] New Memory          [Post] │  ← Header
├─────────────────────────────────┤
│                                 │
│  [Mood Selector]                │  ← Horizontal scroll
│  [😊][💕][😢][🎉][😴][😠][😎] │
│                                 │
│  ┌─────────────────────────────┐│
│  │ How are you feeling?        ││  ← Text area
│  │                             ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  [📷 Add Photo]                 │  ← Photo button
│                                 │
│  [Attached Image Preview]       │  ← If image selected
│                                 │
└─────────────────────────────────┘
```

### Timeline Screen

```
┌─────────────────────────────────┐
│  [←] Our Story           [+]    │  ← Header
├─────────────────────────────────┤
│                                 │
│    ● First Date                 │  ← Timeline node
│    │ Jun 15, 2023               │
│    │ Coffee shop on Main St     │
│    │ [Image]                    │
│    │                            │
│    ● First Kiss                 │  ← Node
│    │ Jun 20, 2023               │
│    │ Under the stars            │
│    │                            │
│    ● Anniversary                │  ← Node
│    │ Jun 15, 2024               │
│    │ One year together!         │
│    │                            │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 Icon Usage

### Primary Icons (Lucide)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Icon            Usage                   Context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Home            Dashboard               Navigation
BookHeart       Timeline/Our Story      Navigation
PenTool         Write/Journal           Navigation
Image           Gallery                 Navigation
Calendar        Calendar/Events         Navigation
Film            Movies                  Navigation
Music           Playlist                Navigation
Heart           Love, Like              Actions
Plus            Add new                 Actions
Trash           Delete                  Actions
Edit            Edit content            Actions
Camera          Photo capture           Actions
LogOut          Sign out                Settings
UserCircle      Profile                 Header
MoreHorizontal  More options            Menus
ArrowLeft       Back navigation         Navigation
Upload          Upload file             Actions
X               Close, Remove           Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Icon Sizing

```
Small:   16px × 16px  (Inline with text)
Medium:  20px × 20px  (Navigation, cards)
Large:   24px × 24px  (Headers, emphasis)
XLarge:  32px × 32px  (Hero elements)
```

---

## ✨ Animations

### Page Transitions

**Fade in from bottom:**
```javascript
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

**Slide in from right:**
```javascript
{
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}
```

### Card Animations

**Staggered Children:**
```javascript
{
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }
}
```

### Micro-Interactions

**Float (for subtle breathing effect):**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}
```

**Heartbeat (for heart icon):**
```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}

.heartbeat-animation {
  animation: heartbeat 1.5s ease-in-out infinite;
}
```

**Scale on tap:**
```javascript
{
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1 }
}
```

---

## 🎯 Interactive States

### Button States

```
Default:  Resting state, gradient or glass
Hover:    Slight elevation, brighter
Active:   Pressed down, scale(0.95)
Disabled: Opacity 0.5, no interaction
Loading:  Spinner, disabled
```

### Input States

```
Empty:    Placeholder text, light border
Focused:  Rose-400 border, subtle shadow
Filled:   Rose-500 border
Error:    Red border, error message below
Disabled: Gray background, no interaction
```

### Card States

```
Default:  Glass effect, subtle shadow
Hover:    Elevated, stronger shadow
Selected: Rose-200 border, subtle highlight
```

---

## 📸 Image Handling

### Aspect Ratios

```
Post Images:     16:9 or original (max 800px width)
Avatars:         1:1 (circular, 40px or 48px)
Timeline Images: 3:2 preferred
Gallery:         Dynamic (masonry layout)
```

### Placeholders

**Avatar Placeholder:**
```
┌─────┐
│ 👤  │  ← Gray circle with user icon
└─────┘
```

**Image Placeholder:**
```
┌──────────────────┐
│                  │
│       📷         │  ← Camera icon, light gray background
│   Loading...     │
│                  │
└──────────────────┘
```

---

## 🧭 Navigation Patterns

### Bottom Tab Bar (Mobile)

```
┌────┬────┬────┬────┬────┐
│Home│Story│ +  │ Cal│More│
│ 🏠 │ 📖 │    │ 📅 │ ⋯  │
└────┴────┴────┴────┴────┘
```

**Active State:**
- Rose-500 background
- White icon
- Subtle shadow

**Inactive State:**
- Transparent background
- Rose-400 icon
- No shadow

### Side Drawer (Mobile Alternative)

```
┌─────────────────┐
│  Us and Ours    │  ← Header
├─────────────────┤
│  🏠 Home        │  ← Active (rose background)
│  📖 Our Story   │
│  ✏️ Journal     │
│  🖼️ Gallery     │
│  📅 Calendar    │
│  🎬 Movies      │
│  🎵 Playlist    │
├─────────────────┤
│  ⚙️ Settings    │
│  🚪 Logout      │
└─────────────────┘
```

---

## 🎨 Empty States

### No Posts Yet

```
┌─────────────────────────────────┐
│                                 │
│           📝                    │  ← Large icon
│                                 │
│    No memories yet              │  ← Heading
│                                 │
│  Start by sharing your first    │  ← Description
│  memory together!               │
│                                 │
│  [Write First Memory]           │  ← CTA button
│                                 │
└─────────────────────────────────┘
```

### Partner Not Joined

```
┌─────────────────────────────────┐
│                                 │
│           💌                    │
│                                 │
│  Waiting for your partner       │
│                                 │
│  Share this code:               │
│                                 │
│  ┌─────────────────────────┐   │
│  │      ABC123             │   │  ← Code box
│  └─────────────────────────┘   │
│                                 │
│  [Copy Code]                    │
│                                 │
└─────────────────────────────────┘
```

---

## 🔔 Notifications (Future)

### Push Notification Design

**Banner:**
```
┌─────────────────────────────────┐
│  💕 Us and Ours                 │  ← App icon & name
│  ────────────────────────────   │
│  John posted a new memory       │  ← Message
│  "Missing you so much today!"   │  ← Preview
│                                 │
│  2 minutes ago                  │  ← Time
└─────────────────────────────────┘
```

---

## ✅ Design Implementation Checklist

### Colors
- [ ] Implement primary rose palette
- [ ] Add lavender secondary colors
- [ ] Configure mood-specific colors
- [ ] Set up neutral warm tones

### Typography
- [ ] Integrate Nunito font (headings)
- [ ] Integrate Quicksand font (body)
- [ ] Set up type scale
- [ ] Configure font weights

### Components
- [ ] Glass card component
- [ ] Primary button
- [ ] Secondary button
- [ ] Icon button
- [ ] Post card layout
- [ ] Mood selector
- [ ] Avatar component

### Animations
- [ ] Page transition animations
- [ ] Card stagger animations
- [ ] Float animation
- [ ] Heartbeat animation
- [ ] Gradient flow background

### Layouts
- [ ] Dashboard layout
- [ ] Journal/Write layout
- [ ] Timeline layout
- [ ] Calendar layout
- [ ] Gallery layout

### Navigation
- [ ] Bottom tab bar (or drawer)
- [ ] Tab active/inactive states
- [ ] Back navigation
- [ ] Deep linking structure

---

## 📐 Design Assets Needed

### Icons
- [ ] App icon (1024×1024)
- [ ] Mood emoji set
- [ ] Navigation icons
- [ ] Timeline milestone icons

### Illustrations
- [ ] Empty state illustrations
- [ ] Onboarding graphics
- [ ] Error state illustrations

### Images
- [ ] Placeholder avatars
- [ ] Image loading placeholders
- [ ] Background patterns (optional)

---

## 🎨 Accessibility

### Color Contrast

Ensure WCAG AA compliance:
- **Text on background**: Minimum 4.5:1 ratio
- **Large text (18px+)**: Minimum 3:1 ratio
- **Interactive elements**: 3:1 ratio

**Check:**
- Rose-900 on white: ✅ (High contrast)
- Rose-500 on white: ✅ (Good contrast)
- Rose-300 on white: ⚠️ (Use for non-essential)

### Touch Targets

**Minimum sizes:**
- Buttons: 44×44 px
- Icons: 40×40 px
- List items: 48px height

### Motion

**Respect reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎯 Key Design Differentiators

1. **Glass Morphism**: Unique, premium aesthetic
2. **Animated Gradient**: Living, breathing background
3. **Mood-Based Design**: Emotional color coding
4. **Warm Palette**: Romantic, inviting colors
5. **Smooth Animations**: Polished, high-quality feel

---

**Last Updated:** February 2024  
**Design Version:** 1.0
