# 📅 SubsRemind

Track your subscriptions and never miss a renewal. Get Telegram notifications 2 days and 1 day before each subscription renews.

![SubsRemind Dashboard](https://via.placeholder.com/800x400?text=SubsRemind+Dashboard)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password login with NextAuth.js
- ➕ **Add Subscriptions** - Track name, price, card, renewal date
- 📊 **Spending Dashboard** - See monthly/yearly totals at a glance
- 🔔 **Telegram Reminders** - D-2 and D-1 notifications
- ⏰ **Automatic Cron Jobs** - Daily checks at 9 AM UTC
- 💳 **Card Tracking** - Know which card is charged
- 📱 **Mobile Friendly** - Works great on all devices

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone <your-repo-url>
cd subsremind

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Setup database
npx prisma migrate dev

# 5. Start development
npm run dev
```

## 📖 Full Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup instructions.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React Framework |
| TypeScript | Type Safety |
| NextAuth.js | Authentication |
| Prisma | Database ORM |
| PostgreSQL | Database (Neon) |
| Tailwind CSS | Styling |
| Telegram Bot API | Notifications |
| Vercel Cron | Scheduled Jobs |

## 📝 Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
TELEGRAM_BOT_TOKEN="bot-token-from-botfather"
CRON_SECRET="cron-job-secret"
```

## 🔔 Telegram Setup

1. Message [@BotFather](https://t.me/botfather) to create a bot
2. Message [@userinfobot](https://t.me/userinfobot) to get your Chat ID
3. Enter Chat ID in app settings after login

## 📄 License

MIT License - feel free to use and modify!

---

Built with ❤️ using Next.js and deployed on Vercel
