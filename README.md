# 🏏 Cricket Registry

Next.js 14 · Neon PostgreSQL · Cloudinary · Vercel

---

## Setup (copy-paste)

### 1. Install
```bash
npm install
```

### 2. Create `.env.local` in project root
```
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/cricket_db?sslmode=require"
ADMIN_USERNAME="rsb@sullia"
ADMIN_PASSWORD="your_password"
CLOUDINARY_CLOUD_NAME="your_cloud"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"
```

### 3. Run DB migration (once)
```bash
node scripts/migrate.js
```

### 4. Start dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at vercel.com/new
3. Add the same 6 env vars in Vercel → Settings → Environment Variables
4. Deploy — done!

---

## Pages

| URL | Access | Description |
|-----|--------|-------------|
| `/` | Public | Register players |
| `/admin/login` | Public | Admin login |
| `/admin` | Admin only | Dashboard, players, teams |

## Admin credentials
- Username: `rsb@sullia`  
- Password: whatever you set in `ADMIN_PASSWORD`

## Features
- Register players with photo, name, phone, previous team, current team, type
- Only admin can view players
- Admin can filter players by team / type / search
- Admin can mark/unmark players as ⭐ Featured (moderated list)
- Admin can add teams, assign C / VC / WK roles
- Auto-creates team when new name is typed
- Cloudinary for image hosting (free 25GB)
- Neon for serverless Postgres (free 0.5GB)
