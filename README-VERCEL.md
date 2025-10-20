# Deploying Electric Grid Equipment Database to Vercel

This guide walks you through deploying the Electric Grid Equipment Database to Vercel from GitHub.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon Database** - Your PostgreSQL database (already configured)
4. **Environment Variables** - You'll need your `DATABASE_URL`

---

## 🏗️ Architecture Changes

This app has been restructured for Vercel's serverless architecture:

- **Frontend**: Vite-built React app (served as static files)
- **Backend**: Express API converted to serverless functions in `/api` directory
- **Database**: Neon HTTP driver (serverless-compatible, already configured)
 
---

## 📝 Step 1: Update package.json

Before pushing to GitHub, you need to add one script to `package.json`:

1. Open `package.json`
2. In the `"scripts"` section, add:
   ```json
   "vercel-build": "vite build"
   ```

Your scripts section should look like:
```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "vercel-build": "vite build",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

---

## 🚀 Step 2: Push to GitHub

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Electric Grid Equipment Database"
   ```

2. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com) → "New repository"
   - Name it (e.g., `electric-grid-database`)
   - Choose "Private" for private repository
   - Do NOT initialize with README (your code already has files)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

   **For private repositories**, you'll need a Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Use token as password when pushing

---

## ⚙️ Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 3.2 Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:

**Framework Preset:** Vite

**Build & Development Settings:**
- **Build Command:** `npm run vercel-build` (or leave as `vite build`)
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Root Directory:** `.` (leave as default)

### 3.3 Add Environment Variables

**CRITICAL:** Add your database URL before deploying!

1. In the Vercel deployment screen, scroll to **"Environment Variables"**
2. Add these variables:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string | Production, Preview, Development |

   **Example DATABASE_URL format:**
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

3. Click **"Deploy"**

---

## 🎉 Step 4: First Deployment

Vercel will now:
1. ✅ Install dependencies (`npm install`)
2. ✅ Build your frontend (`vite build` → `/dist`)
3. ✅ Deploy your serverless API functions from `/api/index.ts`
4. ✅ Configure routing (frontend + API)

**Deployment takes 1-3 minutes.**

---

## 🔍 Step 5: Verify Deployment

Once deployed, Vercel gives you a URL like: `https://your-app-name.vercel.app`

### Test Your API:

1. **Check equipment list:**
   ```
   https://your-app-name.vercel.app/api/equipment
   ```

2. **Check equipment types:**
   ```
   https://your-app-name.vercel.app/api/equipment-types
   ```

3. **Open the app:**
   ```
   https://your-app-name.vercel.app
   ```

---

## 🔧 Troubleshooting

### Issue: 404 on API Routes

**Solution:** Verify `vercel.json` routing configuration exists and looks like this:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Issue: Database Connection Errors

**Solutions:**
1. Verify `DATABASE_URL` environment variable is set in Vercel
2. Ensure your Neon database allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
3. Check that `?sslmode=require` is in your connection string
4. Redeploy after adding environment variables

### Issue: 404 on Page Refresh

**Solution:** The `vercel.json` routing handles this. Make sure the file exists with the routes configuration above.

### Issue: Build Fails

**Check:**
1. `vercel-build` script exists in package.json
2. All dependencies are in `package.json` (not just dev environment)
3. TypeScript compilation passes (`npm run check`)

### Issue: CORS Errors

**Solution:** The `/api/index.ts` file includes CORS headers. If you still get errors, check browser console and verify the API URL.

---

## 🔄 Continuous Deployment

Once set up, **every push to your `main` branch triggers automatic redeployment**!

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel automatically:
- Builds your app
- Runs tests (if configured)
- Deploys to production
- Gives you a unique preview URL for each commit

---

## 📊 Monitoring

**Vercel Dashboard** shows:
- ✅ Build logs
- ✅ Runtime logs (serverless function execution)
- ✅ Performance metrics
- ✅ Error tracking
- ✅ Analytics (page views, performance)

Access at: [vercel.com/dashboard](https://vercel.com/dashboard)

---

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `grid.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit `DATABASE_URL` or secrets to GitHub
2. **Database Access**: Use Neon's connection pooling for serverless
3. **API Rate Limiting**: Consider adding rate limiting for production
4. **CORS**: Update CORS settings in `/api/index.ts` for production domains

---

## 📦 What Was Changed for Vercel

### New Files Created:
- `/api/index.ts` - Serverless Express handler
- `vercel.json` - Vercel routing configuration
- `.vercelignore` - Files to exclude from deployment
- `README-VERCEL.md` - This deployment guide

### Architecture Changes:
- ✅ Backend split into serverless functions
- ✅ Database already using Neon HTTP driver (serverless-compatible)
- ✅ Frontend builds to static files
- ✅ API routes work as serverless functions

### What Still Works Locally:
- ✅ `npm run dev` - Development server (uses `/server/index.ts`)
- ✅ Database migrations (`npm run db:push`)
- ✅ All existing features

---

## 🆘 Support

**Vercel Documentation:**
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

**Common Issues:**
- [Serverless Function Timeout](https://vercel.com/docs/concepts/limits/overview#serverless-function-execution-timeout) - Max 10s on Hobby plan
- [Build Time Limit](https://vercel.com/docs/concepts/limits/overview#build-time) - Increase if needed

---

## ✅ Success Checklist

Before deploying, ensure:

- [ ] `vercel-build` script added to package.json
- [ ] Code pushed to GitHub repository
- [ ] Vercel account created and linked to GitHub
- [ ] `DATABASE_URL` environment variable configured
- [ ] All files committed (including `vercel.json`, `/api/index.ts`)
- [ ] TypeScript compiles without errors (`npm run check`)

After deployment:

- [ ] App loads at Vercel URL
- [ ] API endpoints return data (`/api/equipment`)
- [ ] Frontend features work (search, map, forms)
- [ ] Database operations succeed (create/update/delete)
- [ ] Settings page accessible (username: bahamas, password: equipment@2025)

---

**You're all set!** 🚀

Your Electric Grid Equipment Database is now running on Vercel's global edge network with automatic HTTPS, CDN, and serverless scaling.
