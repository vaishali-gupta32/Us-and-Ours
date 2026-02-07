# Us and Ours 💖

**Us and Ours** is a premium, private digital space designed specifically for couples in long-distance relationships (or any couple who wants a shared digital home). 

It features a beautiful, glassmorphic UI, real-time updates, and a "Private Room" architecture that allows multiple couples to use the platform securely and separately.

![App Icon](src/app/icon.svg)

## ✨ Features

### 🔒 Private Rooms & Multi-Couple Support
- **Secret Code System**: Create a private room and get a unique 6-character code. Your partner uses this code to join your world.
- **Data Isolation**: Every memory, photo, and event is strictly scoped to your unique `CoupleID`. You only see what matters to *you*.

### 📱 Real-Time Dashboard
- **Live Updates**: The dashboard polls for changes every few seconds. When your partner posts a memory, it pops up seamlessly.
- **Vibrant UI**: Enjoy a living, breathing background with animated mesh gradients and premium "Ceramic Glass" cards.
- **Desktop First**: A full sidebar navigation and masonry grid layout optimized for web usage.

### 📝 Shared Journal & Memories
- **Timeline Feed**: Scroll through your shared history.
- **Photo Uploads**: Attach photos to your memories.
- **Mood Tracking**: Tag entries with your current mood (Happy, Romantic, Miss You, etc.).
- **Attribution**: Distinct styling for "You" vs "Partner" posts.

### 🛠️ Couple Tools
- **📅 Shared Calendar**: Plan visits, dates, and anniversaries.
- **🎬 Movie List**: A shared watchlist for your next movie night.
- **🎵 Playlist**: Keep track of "our songs".
- **⏳ Countdown**: A beautiful countdown timer to your next big day/meeting.
- **🖼️ Gallery**: A dedicated space for your photo collection.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Animations
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (Mongoose)
- **Authentication**: Custom JWT (Session-less, Secure Cookies)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [SWR](https://swr.vercel.app/) (Real-time polling)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas URI

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/vaishali-gupta32/Us-and-Ours.git
    cd Us-and-Ours
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📸 Usage

1.  **Signup**: One partner selects **"Create Room"**. They will receive a specific **Secret Code** on their dashboard.
2.  **Connect**: The second partner selects **"Join Room"** during signup and enters that code.
3.  **Enjoy**: You are now linked! Start posting memories and planning your future.

---
*Built with ❤️ for Love.*
