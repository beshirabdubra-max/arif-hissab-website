# Arif Hissab Website - Deployment Guide

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Prepare Your Firebase Credentials

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your existing Arif Hissab project
3. Go to Project Settings
4. Copy these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### Step 2: Create .env.local File

1. In your project root directory, create a file called `.env.local`
2. Add your Firebase credentials (from Step 1):

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test Locally

```bash
npm start
```

Visit http://localhost:3000 to test

### Step 5: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
npm install -g vercel
vercel
```

**Option B: Using GitHub (Recommended)**

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Vercel will detect React and configure automatically
6. Add Environment Variables:
   - Go to Project Settings → Environment Variables
   - Add all REACT_APP_* variables from .env.local
7. Click "Deploy"

### Step 6: Connect Your Domain (arifhissab.com)

1. In Vercel Project Settings, go to "Domains"
2. Add your domain: arifhissab.com
3. Update your STRATO DNS settings:
   - Go to STRATO Domain Management
   - Add Vercel's nameservers (Vercel will provide them)
   - OR add A record pointing to Vercel's IP

**Option: Keep on STRATO Hosting**

If you prefer to use STRATO WordPress instead:
1. Use WordPress installation via STRATO panel
2. Install React theme or use traditional WordPress

---

## 📁 Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── styles/
│   │   └── App.css
│   ├── App.jsx
│   ├── firebase-config.js
│   └── index.js
├── public/
│   ├── index.html
│   └── favicon.ico
├── .env.local (create this)
├── package.json
└── vercel.json (optional)
```

---

## 🔐 Firebase Setup

### Enable Authentication Methods

1. In Firebase Console, go to Authentication
2. Enable:
   - Email/Password
   - Google (optional)

### Create Firestore Database

1. Go to Firestore Database
2. Create database in production mode
3. Update security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🔄 Update Your Existing Arif Hissab App

To integrate with this website:

1. **Both use same Firebase project** - No changes needed!
2. Users can:
   - Register on website
   - Login on website dashboard
   - Use mobile app with same account
   - All data syncs via Firebase

---

## 🎯 Features Included

✅ Bilingual (Amhariska + English)
✅ Firebase Authentication
✅ 14-day Free Trial
✅ Payment Instructions (Telebirr + CBE + BoA)
✅ Plan Selection
✅ Responsive Design (Mobile + Desktop)
✅ Dashboard
✅ Social Media Links

---

## 📞 Support

For questions:
- Email: support@arifhissab.com
- Telegram: @Arifhissabbot
- WhatsApp: wa.me/message/N4ACJHXPNPCYD1

---

## ✅ Deployment Checklist

- [ ] Firebase credentials copied to .env.local
- [ ] Dependencies installed (`npm install`)
- [ ] Tested locally (`npm start`)
- [ ] Code pushed to GitHub (if using GitHub deployment)
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Domain connected to Vercel
- [ ] DNS updated on STRATO
- [ ] Website live and working
- [ ] Login/Register tested
- [ ] Links to mobile app working

---

Good luck! 🚀
