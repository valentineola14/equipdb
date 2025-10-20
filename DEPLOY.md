# Deploy to Vercel - Quick Start Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Your DATABASE_URL from Replit Secrets

---

## Step 1: Push to GitHub

### Create a New Repository
1. Go to [GitHub.com](https://github.com/new)
2. Create a **new repository** (can be private or public)
3. **DON'T** initialize with README, .gitignore, or license

### Push Your Code
In your Replit terminal or Git panel, run:

```bash
git remote remove origin  # Remove old remote if exists
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git add .
git commit -m "Initial commit for Vercel deployment"
git push -u origin main
```

If you get authentication errors, use a **Personal Access Token** instead of password.

---

## Step 2: Deploy to Vercel

### Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Click **"Import"**

### Configure Settings
Vercel should auto-detect most settings. **Verify these:**

- ✅ **Framework Preset:** Vite (or Other)
- ✅ **Build Command:** `vite build` (should be auto-detected)
- ✅ **Output Directory:** `dist/public`
- ✅ **Install Command:** `npm install`

### Add Environment Variable
**CRITICAL:** Before deploying, add your database connection:

1. Click **"Environment Variables"**
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** (paste your Neon PostgreSQL connection string)
   - **Environment:** Check ✅ **Production** (and Preview if you want)
3. Click **"Add"**

### Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

## Step 3: Test Your Deployment

### Frontend Test
Visit: `https://your-app.vercel.app`
- Should load the equipment dashboard

### API Test
Visit: `https://your-app.vercel.app/api/equipment`
- Should return JSON data (might be empty array `[]` if no equipment exists)

### Settings Page
Visit: `https://your-app.vercel.app/settings`
- Login with: `bahamas` / `equipment@2025`
- Test CRUD operations

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`

### API Returns 500 Error
- Check that `DATABASE_URL` environment variable is set correctly
- View function logs in Vercel dashboard

### Frontend 404
- Verify Output Directory is set to `dist/public`
- Check that build completed successfully

---

## Files Configured for Vercel

- ✅ `vercel.json` - Routing and build configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `api/index.ts` - Serverless API handler
- ✅ `api/storage.ts` - Database layer for serverless functions
- ✅ `package.json` - Has `vercel-build` script

---

## After Successful Deployment

Your app supports **two deployment modes**:

| Platform | Server Type | Database | URL |
|----------|-------------|----------|-----|
| **Replit** | Traditional Express | Neon PostgreSQL | `your-app.replit.app` |
| **Vercel** | Serverless Functions | Same Neon DB | `your-app.vercel.app` |

Both deployments share the same database, so data syncs automatically! 🎉
