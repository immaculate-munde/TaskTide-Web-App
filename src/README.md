# TaskTide - Educational Platform
TaskTide is a comprehensive educational platform that facilitates collaboration between lecturers, class representatives, and students. It provides features for course management, group assignments, resource sharing, scheduling, and real-time communication.
## Features
- **Authentication**: Sign up/in with Google, Apple, Email/Password, Phone (SMS)
- **Role-based Access**: Different permissions for Lecturers, ClassReps, Students, Contractors, and Admins
- **Course Management**: Create and manage units/subjects
- **Group Management**: Create and join assignment groups
- **Resource Sharing**: Upload/download lecture notes and materials
- **Calendar & Scheduling**: Shared class events and personal events
- **Task Management**: Create, edit, and complete tasks
- **Collaboration Hub**: Real-time chat for courses and groups
## Getting Started
### Prerequisites
- Node.js (v14 or later)
- npm or yarn
### Installation
1. Clone the repository
   ```
   git clone https://github.com/your-username/tasktide.git
   cd tasktide
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start the development server
   ```
   npm run dev
   ```
## Supabase Setup
### 1. Create a new Supabase project
1. Go to [supabase.com](https://supabase.com/) and sign up/in
2. Create a new project
3. Copy the URL and anon key from the API settings page
### 2. Set up Authentication
1. Go to Authentication > Settings
2. Enable Email/Password, Google, Apple, and Phone auth providers
3. Configure OAuth providers:
   - For Google: Create a project in [Google Cloud Console](https://console.cloud.google.com/), set up OAuth credentials, and add them to Supabase
   - For Apple: Follow the [Apple Sign-In documentation](https://supabase.com/docs/guides/auth/auth-apple) to set up
### 3. Set up Database Tables
Create the following tables in the Supabase SQL editor: