# SubsRemind Deployment Guide

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Vercel Account](https://vercel.com/signup)
- [Neon Database](https://neon.tech/) or [Supabase](https://supabase.com/)
- [Telegram Account](https://telegram.org/)

---

## Step 1: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow prompts to name your bot (e.g., "SubsRemind Bot")
4. Save the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. To get your **Chat ID**:
   - Search for **@userinfobot** in Telegram
   - Click Start
   - It will send your Chat ID (looks like: `123456789`)

---

## Step 2: Setup Database (Neon - Recommended)

1. Go to [Neon](https://neon.tech/) and sign up
2. Create a new project
3. Copy the **Connection String** from the dashboard
4. Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

---

## Step 3: Local Development

```bash
# 1. Clone and navigate to project
cd subsremind

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your values:
# DATABASE_URL="your-neon-connection-string"
# NEXTAUTH_SECRET="generate-random-string-here"
# NEXTAUTH_URL="http://localhost:3000"
# TELEGRAM_BOT_TOKEN="your-bot-token"
# CRON_SECRET="another-random-string-for-cron"

# 5. Generate Prisma client
npx prisma generate

# 6. Run database migrations
npx prisma migrate dev --name init

# 7. Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New Project"**
4. Import your repository
5. Configure environment variables (see below)
6. Click **Deploy**

---

## Step 5: Configure Environment Variables on Vercel

Go to Project Settings → Environment Variables and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production |
| `NEXTAUTH_SECRET` | Random 32+ character string | Production |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., `https://subsremind.vercel.app`) | Production |
| `TELEGRAM_BOT_TOKEN` | From @BotFather | Production |
| `CRON_SECRET` | Random string for cron security | Production |

### Generate Secrets:
```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use any random string generator
```

---

## Step 6: Run Database Migration on Production

After first deploy, run migration:

```bash
# Using Vercel CLI
vercel --prod

# Then run:
npx prisma migrate deploy
```

Or use Neon Console's SQL Editor to run the migration manually.

---

## Step 7: Configure Cron Job (Optional Testing)

The cron job runs automatically at 9 AM UTC daily. To test manually:

```bash
# Trigger with secret
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-app.vercel.app/api/cron/reminders
```

---

## Features Summary

| Feature | Status |
|---------|--------|
| User Registration/Login | ✅ |
| Add Subscription | ✅ |
| Delete Subscription | ✅ |
| View All Subscriptions | ✅ |
| Monthly/Yearly Tracking | ✅ |
| Spending Summary | ✅ |
| Telegram D-2 Reminders | ✅ |
| Telegram D-1 Reminders | ✅ |
| Daily Cron Job (9 AM) | ✅ |

---

## Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Ensure SSL mode is enabled for Neon: `?sslmode=require`

### "Telegram not sending messages"
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Make sure you started the bot in Telegram (@BotFather → /mybots → Select Bot → Start)
- Verify your `telegramChatId` is saved in user profile

### "Cron job not working"
- Check `CRON_SECRET` is set
- Verify cron path in `vercel.json`
- Test manually with curl command above

### Build fails
- Run `npx prisma generate` locally
- Commit the `prisma/migrations` folder

---

## File Structure

```
subsremind/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── cron/reminders/route.ts
│   │   ├── register/route.ts
│   │   ├── subscriptions/route.ts
│   │   └── user/telegram/route.ts
│   ├── dashboard/
│   │   ├── new/page.tsx
│   │   └── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── navbar.tsx
│   ├── providers.tsx
│   └── telegram-setup.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── telegram.ts
├── prisma/
│   └── schema.prisma
├── types/
│   └── next-auth.d.ts
├── .env.example
├── DEPLOYMENT.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Support

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Cron Docs](https://vercel.com/docs/cron-jobs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
