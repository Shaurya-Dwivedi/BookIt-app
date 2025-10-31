# 🚀 Quick Deployment Steps

## ✅ Pre-deployment Complete!
- [x] Added `start` script to server package.json
- [x] Created environment variable examples
- [x] Updated frontend to use environment variables
- [x] All hardcoded URLs replaced

---

## 📝 Step-by-Step Deployment

### STEP 1: Deploy Backend to Render (10 minutes)

1. **Go to https://render.com and sign up/login**

2. **Click "New +" → "Web Service"**

3. **Connect GitHub repository**
   - Authorize Render to access your repo
   - Select your BookIt repository

4. **Configure the service:**
   ```
   Name: bookit-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   ```
   Key: MONGO_URI
   Value: mongodb+srv://bookitadmin:TtsU4qcJkJO0H7Ld@cluster0.j9rocrj.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority
   ```

6. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://bookit-backend-xxxx.onrender.com`
   - **COPY THIS URL! You'll need it for frontend deployment**

7. **Test the backend:**
   - Visit: `https://your-backend-url.onrender.com/api/experiences`
   - Should see JSON array of experiences

---

### STEP 2: Deploy Frontend to Vercel (5 minutes)

1. **Go to https://vercel.com and sign up/login with GitHub**

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**
   - Find your BookIt repo
   - Click "Import"

4. **Configure the project:**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
   - Replace with YOUR actual Render backend URL from Step 1
   - Select: Production, Preview, Development (all)

6. **Click "Deploy"**
   - Wait 2-5 minutes
   - You'll get a URL like: `https://bookit-xxxx.vercel.app`

---

### STEP 3: Update Backend CORS (5 minutes)

1. **Open `server/index.js` in your code editor**

2. **Find the CORS configuration (around line 17):**
   ```javascript
   app.use(cors({
     origin: '*'
   }));
   ```

3. **Replace with:**
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-frontend-url.vercel.app'  // Replace with your Vercel URL
     ],
     credentials: true
   }));
   ```

4. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

5. **Render will auto-redeploy** (check Render dashboard)

---

### STEP 4: Test Live Application (5 minutes)

Visit your Vercel URL and test:

- [ ] Home page loads with experiences
- [ ] Search works
- [ ] Can click on experience card
- [ ] Details page loads
- [ ] Can select date/time/quantity
- [ ] Checkout page works
- [ ] Can apply promo code (try SAVE10)
- [ ] Can complete booking
- [ ] Get booking confirmation

**If anything doesn't work, check browser console for errors!**

---

## 🐛 Troubleshooting

### Frontend shows blank page:
- **Check browser console** (F12)
- Check if VITE_API_URL is set correctly in Vercel
- Redeploy from Vercel dashboard

### "Network Error" or CORS issues:
- Check backend CORS settings include your Vercel URL
- Make sure backend is running (check Render dashboard)
- Verify backend URL in Vercel env variables

### Backend won't start:
- Check Render logs for errors
- Verify MONGO_URI is set in Render environment variables
- Check if build command succeeded

### Database connection fails:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Wait 1-2 minutes for changes to propagate

---

## 📋 Deployment Checklist

### Backend (Render):
- [ ] Service created
- [ ] MONGO_URI environment variable set
- [ ] Successfully deployed
- [ ] /api/experiences returns data
- [ ] URL copied for frontend

### Frontend (Vercel):
- [ ] Project imported
- [ ] VITE_API_URL environment variable set (with backend URL)
- [ ] Successfully deployed
- [ ] Can access homepage

### Final:
- [ ] CORS updated in backend
- [ ] Backend redeployed
- [ ] Full user flow tested
- [ ] No console errors

---

## 🎉 After Successful Deployment

### Update Your README:
```markdown
## 🌐 Live Demo
- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com
```

### Submit for Assignment:
- ✅ GitHub repository link
- ✅ Live application URL (Vercel)
- ✅ Backend API URL (Render)

---

## 💡 Important Notes

1. **First Request Delay:** Render free tier sleeps after inactivity. First request may take 30-60 seconds. This is normal!

2. **Environment Variables:** Any change to env variables in Vercel requires redeployment

3. **Auto-Deploy:** Both Render and Vercel auto-deploy when you push to GitHub

4. **Logs:** Check deployment logs if something fails:
   - Render: Click on service → "Logs" tab
   - Vercel: Click on deployment → "Functions" → Logs

---

## ⏰ Estimated Time: 20-30 minutes total

You're ready to deploy! Follow the steps above and you'll have a live application! 🚀
