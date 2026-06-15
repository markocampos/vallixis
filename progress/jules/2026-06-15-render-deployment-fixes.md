---
date: 2026-06-15
tags:
  - changelog
  - phase0
  - deployment
  - fixes
  - vallixis
---

# Update Log — Deployment Fixes

## [[2026-06-15]] - Render Deployment & Routing Fixes
**Time:** 2026-06-15 04:00Z – 04:45Z
**Focus:** Resolving "Route not found" error on the main Render deployment.

---

### Fixes Applied

#### 1. ✅ `backend/src/app.ts` — Frontend Static File Serving
**Problem:** The Render deployment only started the backend service and didn't serve the frontend application at the root domain, causing a 404 "Route not found" error from the backend.

**Fix:**
```ts
import path from 'path'

// Serve frontend
const frontendDistPath = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDistPath))

// Catch-all
app.use((req, res, next) => {
  if (req.path.startsWith('/v1/')) {
    res.status(404).json({
      success: false,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: 'not-found' },
      errors: [{ field: 'general', message: 'Route not found' }]
    })
  } else {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
      if (err) {
        next(err)
      }
    })
  }
})
```

#### 2. ✅ `scripts/setup.sh` — Build Scripts for Render
**Problem:** Render runs the setup script which did not build the static assets, meaning `frontend/dist` didn't exist when the backend started.

**Fix:** Added explicit build steps for both the frontend and the backend.
```bash
echo "Building frontend..."
npm run build --prefix frontend

echo "Building backend..."
npm run build --prefix backend
```

#### 3. ✅ `scripts/render-start.sh` — Dedicated Start Script
**Problem:** `npm start` on the root workspace wasn't correctly spinning up the backend because it required moving into the `backend` directory first.

**Fix:** Created a script to ensure the backend starts correctly on Render.

---

### Security Note
Serving both frontend and backend from the same port via Express is a common pattern for simplified deployments like Render Starter projects. The security is maintained as long as the backend properly scopes its API routes (e.g., under `/v1/`) and does not leak sensitive static files, which is ensured since only the compiled `frontend/dist` directory is exposed.

---

### Next Phase
**Phase 1: Authentication**
- Implement requested features for Phase 1 Authentication.
