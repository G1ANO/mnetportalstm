# 🚀 Deployment Guide - MNet Portal

This guide will walk you through deploying your WiFi Portal application with:
- **Backend**: Render (Flask API + PostgreSQL)
- **Frontend**: Vercel (React/Vite)

---

## 📋 Prerequisites

Before you begin, make sure you have:
- [ ] GitHub account (to connect repositories)
- [ ] Render account (sign up at https://render.com)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Your code pushed to a GitHub repository

---

## 🎯 PART 1: Backend Deployment on Render

### Step 1: Create PostgreSQL Database

1. **Log in to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"PostgreSQL"**
3. **Configure Database**:
   - **Name**: `mnet-portal-db` (or your preferred name)
   - **Database**: `mnet_portal`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
   - **Plan**: **Free** (or paid for better performance)
4. **Click "Create Database"**
5. **Save the connection details** - you'll need the **Internal Database URL**

### Step 2: Create Web Service for Backend

1. **Click "New +"** → Select **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service**:

   **Basic Settings:**
   - **Name**: `mnet-portal-backend` (or your preferred name)
   - **Region**: Same as your database
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `server`
   - **Runtime**: `Python 3`
   
   **Build & Deploy:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   
   **Plan:**
   - Select **Free** (or paid for no sleep/better performance)

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```
   SECRET_KEY = <generate-a-strong-random-key>
   DATABASE_URL = <your-postgres-internal-url-from-step-1>
   FRONTEND_URL = <leave-empty-for-now-will-add-after-vercel>
   PYTHON_VERSION = 3.12.3
   ```

   **To generate SECRET_KEY**, run this in your terminal:
   ```bash
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

5. **Click "Create Web Service"**

6. **Wait for deployment** (5-10 minutes for first deploy)

7. **Copy your backend URL** - it will look like:
   ```
   https://mnet-portal-backend.onrender.com
   ```
   **⚠️ SAVE THIS URL - YOU'LL NEED IT FOR VERCEL!**

### Step 3: Run Database Migrations

1. **Go to your web service** → **Shell** tab
2. **Run migrations**:
   ```bash
   cd server
   python3 -c "from app import app, db; app.app_context().push(); db.create_all()"
   ```

3. **Create admin user**:
   ```bash
   python3 create_admin.py
   ```

### Step 4: Test Backend

Visit your backend URL in a browser:
```
https://your-backend-url.onrender.com/
```

You should see:
```json
{"message": "Welcome to WiFi Portal"}
```

---

## 🎨 PART 2: Frontend Deployment on Vercel

### Step 1: Deploy to Vercel

1. **Log in to Vercel**: https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. **Configure Project**:

   **Framework Preset**: `Vite`
   
   **Root Directory**: `client`
   
   **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (from Render Step 2.7)
   - **Environments**: Select all (Production, Preview, Development)

6. **Click "Deploy"**

7. **Wait for deployment** (2-5 minutes)

8. **Copy your frontend URL** - it will look like:
   ```
   https://mnet-portal.vercel.app
   ```

### Step 2: Update Backend CORS Settings

1. **Go back to Render Dashboard**
2. **Open your backend web service**
3. **Go to "Environment"** tab
4. **Add/Update the FRONTEND_URL variable**:
   ```
   FRONTEND_URL = https://your-frontend-url.vercel.app
   ```
5. **Click "Save Changes"**
6. **Wait for automatic redeploy** (1-2 minutes)

---

## ✅ PART 3: Verification & Testing

### Test the Full Application

1. **Visit your Vercel URL**: `https://your-frontend-url.vercel.app`

2. **Test Registration**:
   - Create a new user account
   - Verify you can register successfully

3. **Test Login**:
   - Log in with the account you just created
   - Verify you're redirected to the dashboard

4. **Test Admin Login**:
   - Email: `admin@mnet.com`
   - Password: `admin123`
   - **⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

5. **Test Core Features**:
   - [ ] View subscription tiers
   - [ ] Create a subscription
   - [ ] View loyalty points
   - [ ] Submit feedback
   - [ ] Admin: View users
   - [ ] Admin: Manage tiers

---

## 🔧 PART 4: Post-Deployment Configuration

### Update Admin Password

1. Log in as admin
2. (You'll need to add a password change feature, or update directly in database)

### Monitor Your Application

**Render Monitoring:**
- Dashboard → Your Service → Metrics
- View logs: Dashboard → Your Service → Logs

**Vercel Monitoring:**
- Dashboard → Your Project → Analytics
- View deployment logs: Dashboard → Your Project → Deployments

---

## 🔄 PART 5: Making Updates

### Update Backend Code

1. Push changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```

2. Render will automatically detect and deploy changes

### Update Frontend Code

1. Push changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. Vercel will automatically detect and deploy changes

---

## 📝 Required URLs Checklist

After deployment, you should have these URLs:

- [ ] **Backend API**: `https://__________.onrender.com`
- [ ] **Frontend App**: `https://__________.vercel.app`
- [ ] **Database**: Internal URL (in Render dashboard)

---

## 🆘 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- **Solution**: Check Render logs for errors
- Verify `gunicorn app:app` command is correct
- Ensure all dependencies in requirements.txt

**Problem**: Database connection errors
- **Solution**: Verify DATABASE_URL is set correctly
- Check database is running in Render dashboard

**Problem**: CORS errors
- **Solution**: Verify FRONTEND_URL matches your Vercel URL exactly
- Check CORS configuration in app.py

### Frontend Issues

**Problem**: "Failed to fetch" or API errors
- **Solution**: Verify VITE_API_URL is set in Vercel
- Check backend is running and accessible
- Verify CORS is configured correctly

**Problem**: Blank page after deployment
- **Solution**: Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors

**Problem**: Environment variable not working
- **Solution**: Redeploy after adding environment variables
- Verify variable name starts with `VITE_`

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render Free:**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Slower performance
- ✅ PostgreSQL: 90 days free, then $7/month

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ No sleep/downtime
- ✅ Automatic HTTPS

### Paid Options (Optional)

**Render Starter ($7/month):**
- No sleep
- Better performance
- 24/7 availability

**Vercel Pro ($20/month):**
- Team features
- Better analytics
- Priority support

---

## 🎉 Success!

Your application is now deployed and accessible worldwide!

**Next Steps:**
1. Share your Vercel URL with users
2. Monitor application performance
3. Set up custom domain (optional)
4. Configure email notifications (future enhancement)
5. Set up backups for your database

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Project → Deployments → View Logs
3. Review this guide's troubleshooting section
4. Check Render docs: https://render.com/docs
5. Check Vercel docs: https://vercel.com/docs

