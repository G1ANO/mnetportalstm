# 🚀 Quick Deployment Checklist

Use this as a quick reference while deploying. See `DEPLOYMENT.md` for detailed instructions.

---

## 📝 Required Information

Before you start, have these ready:

### You Need to Provide:
1. **GitHub Repository URL**: `_______________________________`
2. **Render Account**: https://render.com (sign up if needed)
3. **Vercel Account**: https://vercel.com (sign up if needed)

### You Will Receive (save these):
1. **Backend URL** (from Render): `https://__________.onrender.com`
2. **Frontend URL** (from Vercel): `https://__________.vercel.app`
3. **Database URL** (from Render): `postgresql://...` (internal use only)
4. **SECRET_KEY**: Generate with: `python3 -c "import secrets; print(secrets.token_hex(32))"`

---

## ✅ Deployment Steps

### STEP 1: Render - Create Database (5 min)
- [ ] Go to https://dashboard.render.com
- [ ] New + → PostgreSQL
- [ ] Name: `mnet-portal-db`
- [ ] Region: Oregon (or closest to you)
- [ ] Plan: Free
- [ ] Create Database
- [ ] **SAVE**: Internal Database URL

### STEP 2: Render - Deploy Backend (10 min)
- [ ] New + → Web Service
- [ ] Connect GitHub repo
- [ ] Root Directory: `server`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn app:app`
- [ ] Add Environment Variables:
  - [ ] `SECRET_KEY` = (generate with command above)
  - [ ] `DATABASE_URL` = (from Step 1)
  - [ ] `FRONTEND_URL` = (leave empty for now)
  - [ ] `PYTHON_VERSION` = `3.12.3`
- [ ] Create Web Service
- [ ] Wait for deployment
- [ ] **SAVE**: Backend URL (e.g., https://mnet-portal-backend.onrender.com)

### STEP 3: Render - Initialize Database (2 min)
- [ ] Go to your web service → Shell tab
- [ ] Run: `cd server && python3 -c "from app import app, db; app.app_context().push(); db.create_all()"`
- [ ] Run: `python3 create_admin.py`
- [ ] Test: Visit your backend URL, should see: `{"message": "Welcome to WiFi Portal"}`

### STEP 4: Vercel - Deploy Frontend (5 min)
- [ ] Go to https://vercel.com/dashboard
- [ ] Add New → Project
- [ ] Import GitHub repo
- [ ] Root Directory: `client`
- [ ] Framework: Vite
- [ ] Add Environment Variable:
  - [ ] Key: `VITE_API_URL`
  - [ ] Value: (your backend URL from Step 2)
  - [ ] Environments: All
- [ ] Deploy
- [ ] **SAVE**: Frontend URL (e.g., https://mnet-portal.vercel.app)

### STEP 5: Render - Update CORS (2 min)
- [ ] Go back to Render → Your web service
- [ ] Environment tab
- [ ] Update `FRONTEND_URL` = (your frontend URL from Step 4)
- [ ] Save Changes
- [ ] Wait for redeploy

### STEP 6: Test Everything (5 min)
- [ ] Visit frontend URL
- [ ] Register a new user
- [ ] Login with new user
- [ ] View subscription plans
- [ ] Login as admin (admin@mnet.com / admin123)
- [ ] View admin dashboard

---

## 🎯 Your Deployment URLs

Fill these in as you complete the steps:

```
Backend API:  https://__________________________________________.onrender.com
Frontend App: https://__________________________________________.vercel.app
Admin Login:  Email: admin@mnet.com | Password: admin123 (CHANGE THIS!)
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Render logs, verify requirements.txt |
| CORS errors | Verify FRONTEND_URL matches Vercel URL exactly |
| Frontend can't connect | Check VITE_API_URL in Vercel environment variables |
| Database errors | Verify DATABASE_URL is set, check database is running |
| Blank frontend page | Check Vercel deployment logs, verify build succeeded |

---

## 📞 Need Help?

1. Check detailed guide: `DEPLOYMENT.md`
2. View Render logs: Dashboard → Service → Logs
3. View Vercel logs: Dashboard → Project → Deployments
4. Render docs: https://render.com/docs
5. Vercel docs: https://vercel.com/docs

---

## ⏱️ Total Time: ~30 minutes

Good luck! 🚀

