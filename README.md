# Medication Reminder System

A comprehensive, multilingual elderly care system designed to help manage medication schedules and reminders effectively. This project consists of a modern React frontend and a robust Node.js/Express backend.

## Features

- **User Authentication**: Secure login and registration for caregivers/users.
- **Dashboard Overview**: Centralized view of all activities and statuses.
- **Elder Management**: Create and manage profiles for elders receiving care.
- **Medication Tracking**: Add and organize medications with dosage details.
- **Automated Reminders**: Accurate scheduling system using cron jobs to ensure timely medication intake.
- **Statistics & Adherence**: Visual reports on medication adherence.
- **Multilingual Support**: Designed to support multiple languages for broader accessibility.

##  Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS 4, Shadcn UI
- **Routing**: React Router 7
- **State/Forms**: React Hook Form, Context API
- **Animations/3D**: GSAP, Three.js, OGL

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcrypt
- **Scheduling**: Node-cron
- **Logging**: Winston

##  Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd bright-medication-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root and configure your environment variables (PORT, MONGO_URI, JWT_SECRET, etc.).
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd bright-medication-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

