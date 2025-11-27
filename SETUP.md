# Thames Water Site Locations - Setup Guide

## Overview
This is a mobile-friendly web application that displays Thames Water site locations on an interactive map with Google OAuth authentication.

## Prerequisites
- Node.js 18+ installed
- Google Cloud Console account (for OAuth setup)
- Netlify account

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://uie.digital/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the values:
   ```
   NEXTAUTH_URL=https://uie.digital
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```

### 3. Netlify Environment Variables

Add the same environment variables in your Netlify dashboard:

1. Go to Site settings > Build & deploy > Environment
2. Add:
   - `NEXTAUTH_URL` = `https://uie.digital`
   - `NEXTAUTH_SECRET` = (your generated secret)
   - `GOOGLE_CLIENT_ID` = (from Google Cloud Console)
   - `GOOGLE_CLIENT_SECRET` = (from Google Cloud Console)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Netlify

This app is configured to automatically deploy to Netlify when pushed to the main branch.

### First Time Setup:

1. Connect your GitHub repository to Netlify
2. Set the build command: `npm run build`
3. Set the publish directory: `.next`
4. Add environment variables (see above)
5. Deploy!

The app will be available at: **https://uie.digital**

## Features

- **Google Authentication**: Secure login with Google accounts
- **Interactive Map**: Powered by Leaflet with marker clustering
- **Mobile Responsive**: Works on all device sizes
- **Search & Filter**: Find sites by name, region, or sub-region
- **Site Details**: View postal codes, regions, and navigation links
- **What3Words Integration**: Precise location links
- **Google Maps Integration**: Direct navigation support

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: NextAuth.js with Google OAuth
- **Mapping**: Leaflet + React Leaflet
- **Hosting**: Netlify
- **Styling**: Inline styles + CSS modules

## Support

For issues or questions, please contact the development team.
