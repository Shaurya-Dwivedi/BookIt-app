# 🚀 BookIt Deployment Guide

## Overview
We'll deploy:
- **Backend (Node.js/Express)** → Render
- **Frontend (React/Vite)** → Vercel
- **Database** → MongoDB Atlas (already set up)

---

## 📋 Pre-Deployment Checklist

### ✅ Completed:
- [x] MongoDB Atlas database configured
- [x] All API endpoints working
- [x] Frontend-backend integration working locally
- [x] Environment variable files created
- [x] Production scripts added to package.json
- [x] Double-booking prevention implemented
- [x] All features tested locally

### 🔄 To Do:
- [ ] Update API URLs in frontend to use environment variables
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Test live deployment
- [ ] Update README with live links

---

## 🔧 Step 1: Prepare Frontend for Deployment

### Update API Calls to Use Environment Variables

We need to replace all hardcoded `http://localhost:3001` URLs with environment variables.

**Files to update:**
1. `client/src/pages/HomePage.tsx`
2. `client/src/pages/DetailsPage.tsx`
3. `client/src/pages/CheckoutPage.tsx`

**Replace:**
```typescript
'http://localhost:3001/api/experiences'
```

**With:**
```typescript
`${import.meta.env.VITE_API_URL}/experiences`
```

---

## 🚀 Step 2: Deploy Backend to Render

### A. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### B. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `bookit-backend` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your branch)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### C. Add Environment Variables
In Render dashboard, add:
```
MONGO_URI=mongodb+srv://bookitadmin:TtsU4qcJkJO0H7Ld@cluster0.j9rocrj.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority
PORT=3001
```

### D. Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://bookit-backend.onrender.com`)

---

## 🌐 Step 3: Deploy Frontend to Vercel

### A. Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### B. Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### C. Add Environment Variable
1. Go to "Environment Variables"
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

### D. Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Get your frontend URL (e.g., `https://bookit.vercel.app`)

---

## 🔄 Step 4: Update Backend CORS

After getting your Vercel URL, update CORS in `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Then push to GitHub to trigger Render redeployment.

---

## 🧪 Step 5: Test Deployment

### Test Checklist:
- [ ] Frontend loads without errors
- [ ] Home page shows experiences
- [ ] Search functionality works
- [ ] Can navigate to experience details
- [ ] Can add items to checkout
- [ ] Can apply promo codes
- [ ] Can complete booking
- [ ] Booking reference is displayed
- [ ] No console errors

### Common Issues:

**Issue 1: Frontend can't connect to backend**
- Check VITE_API_URL is correct
- Check CORS settings in backend
- Verify backend is running on Render

**Issue 2: CORS errors**
- Add your Vercel URL to CORS whitelist
- Redeploy backend after changes

**Issue 3: Database connection fails**
- Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)
- Verify MONGO_URI is correct in Render environment variables

---

## 📝 Step 6: Update README

Add deployment links to README:

```markdown
# BookIt - Experience Booking Platform

## 🌐 Live Demo
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend.onrender.com

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Express, MongoDB
- Hosting: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

## Local Development
[... setup instructions ...]
```

---

## 📊 Deployment Summary

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | TBD | ⏳ Pending |
| Backend | Render | TBD | ⏳ Pending |
| Database | MongoDB Atlas | Connected | ✅ Active |

---

## 🔒 Security Notes

1. **MongoDB Credentials**: Already in `.env` (not in repo - good!)
2. **Environment Variables**: Set in Render/Vercel dashboards
3. **CORS**: Restrict to your frontend domain only
4. **API Keys**: Keep all sensitive data in environment variables

---

## 💡 Tips for Free Tier

### Render (Backend):
- Free tier spins down after inactivity
- First request after idle may take 30-60 seconds
- For assignment purposes, this is perfectly fine!

### Vercel (Frontend):
- Always fast and responsive
- No cold start issues
- Automatic SSL/HTTPS

### MongoDB Atlas:
- Free tier: 512MB storage
- More than enough for this project
- Automatic backups included

---

## 🆘 Troubleshooting

### Backend won't start on Render:
1. Check build logs for errors
2. Verify `npm start` script exists
3. Check environment variables are set

### Frontend shows blank page:
1. Check browser console for errors
2. Verify VITE_API_URL is set correctly
3. Check if backend is accessible

### Database connection timeout:
1. Whitelist all IPs in MongoDB Atlas (0.0.0.0/0)
2. Verify connection string format
3. Check if cluster is active

---

## 📞 Next Steps

After successful deployment:
1. ✅ Test all features on live site
2. ✅ Update README with live links
3. ✅ Create final documentation
4. ✅ Submit GitHub repo + live links for assignment

---

## 🎉 You're Almost Done!

Follow these steps carefully and you'll have a fully deployed, production-ready application!
