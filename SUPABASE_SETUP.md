# Supabase Authentication Setup

This app uses Supabase for authentication with Google OAuth. The app uses local storage for data persistence and Supabase only for user authentication.

## 1. Environment Variables

Replace the placeholder in `.env.local` with your actual Supabase anonymous key:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://chdvrbmchmzfcrkiegnt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

## 2. Google OAuth Setup

The app is already configured to use these redirect URLs:

- Production: `https://chdvrbmchmzfcrkiegnt.supabase.co/auth/v1/callback`
- Development: `http://localhost:3000/auth/callback` or `http://localhost:3001/auth/callback`

Make sure these are added to your Google Cloud Console OAuth configuration. The app will automatically use the correct port.

## 3. Running the App

```bash
npm run dev
```

The app will:

- Show a welcome message for unauthenticated users
- Allow sign in with Google OAuth
- Persist user data to local storage (per browser)
- Show user profile information in the menu slider
- Allow users to sign out

## Features

- **Authentication**: Google OAuth integration using Supabase Auth
- **User Profile**: Display user name and avatar from Google
- **Data Persistence**: Local storage persistence (browser-specific)
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Theme persistence per browser
- **Real-time Auth State**: Automatic UI updates based on auth status

## Architecture

- **Authentication**: Handled by Supabase Auth with Google OAuth
- **User Data**: Stored in browser's localStorage using Zustand persist
- **Session Management**: Managed by Supabase with automatic token refresh
- **No Database Tables Needed**: Uses only the built-in `auth.users` table

This approach is simpler and doesn't require creating custom database tables. Each user's data is stored locally in their browser, and authentication provides personalization features like displaying the user's name and profile picture.
