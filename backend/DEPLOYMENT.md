# Deployment Guide

## Quick Start: Push to DB and Deploy

### Step 1: Generate Database Migrations
```bash
cd backend
npm run db:generate
```
This creates SQL migration files based on your schema changes.

### Step 2: Apply Migrations to Local Database (Testing)
```bash
npm run db:migrate:local
```
Test your migrations locally before deploying to production.

### Step 3: Apply Migrations to Remote Database (Production)
```bash
npm run db:migrate:remote
```
This applies all pending migrations to your Cloudflare D1 database.

### Step 4: Set Environment Variables
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to: Workers & Pages → Your Worker → Settings → Variables
3. Add these secrets:
   - `JWT_SECRET`: A random secret string for JWT signing
   - `GEMINI_API_KEY`: Your Google Gemini API key

### Step 5: Deploy the Backend
```bash
npm run deploy
```

This will:
- Build and minify your code
- Upload to Cloudflare Workers
- Deploy to: `https://aura.bkumar-be23.workers.dev`

## Verification

### Check Deployment Status
```bash
wrangler deployments list
```

### Test the API
```bash
curl https://aura.bkumar-be23.workers.dev/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T07:04:43.214Z"
}
```

## Database Management

### View All Migrations
```bash
wrangler d1 migrations list auth-db
```

### Execute SQL Query (Local)
```bash
wrangler d1 execute auth-db --local --command "SELECT * FROM users"
```

### Execute SQL Query (Remote)
```bash
wrangler d1 execute auth-db --remote --command "SELECT * FROM users"
```

## Troubleshooting

### Migration Fails
1. Check if database exists: `wrangler d1 list`
2. Verify migration files exist: `ls drizzle/migrations/`
3. Try applying migrations one by one

### Deployment Fails
1. Check TypeScript errors: `npx tsc --noEmit`
2. Verify wrangler.toml configuration
3. Check Cloudflare account limits

### API Returns 500 Errors
1. Check Cloudflare Workers logs
2. Verify environment variables are set
3. Check database connection

## Complete Deployment Checklist

- [ ] Code is tested locally
- [ ] Migrations generated (`npm run db:generate`)
- [ ] Migrations tested locally (`npm run db:migrate:local`)
- [ ] Environment variables set in Cloudflare
- [ ] Migrations applied to remote DB (`npm run db:migrate:remote`)
- [ ] Backend deployed (`npm run deploy`)
- [ ] Health endpoint tested
- [ ] Authentication endpoints tested
- [ ] Protected routes tested with token

