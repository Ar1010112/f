# FinanceFlow

A simple and elegant personal finance tracking application built with Next.js, Prisma, and Neon DB.

## Features

- 📊 **Track Daily, Weekly & Monthly Finances** - Monitor your income and expenses across different time periods
- ➕ **Manage Transactions** - Add, edit, and delete transactions with ease
- 📈 **Interactive Dashboard** - Get visual insights into your financial activity
- 🌙 **Dark/Light Mode** - Switch between themes for a personalized experience
- 🔐 **Authentication** - Secure user authentication system

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon PostgreSQL
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Authentication**: Built-in user context system

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon database account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd financeflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Update your `.env` file with your Neon database URL:
```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/financeflow?sslmode=require"
```

5. Set up the database:
```bash
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup with Neon

1. Create a new project at [Neon](https://neon.tech)
2. Copy your connection string
3. Update your `.env` file with the connection string
4. Run `npx prisma db push` to create the database schema

## Usage

1. **Authentication**: The app uses a demo user system. Click "Sign in as Demo User" to get started.

2. **Adding Transactions**: 
   - Click the "Add Transaction" button
   - Fill in the details (description, amount, type, category, date)
   - Submit to save

3. **Managing Transactions**:
   - View all transactions in the Transactions page
   - Edit transactions by clicking the edit icon
   - Delete transactions by clicking the trash icon

4. **Analytics**:
   - View daily, weekly, and monthly analytics
   - See spending breakdowns by category
   - Track financial trends over time

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/
│   ├── dialogs/        # Modal dialogs
│   ├── layout/         # Layout components
│   └── ui/            # UI components
├── lib/
│   ├── api/           # API functions
│   ├── context/       # React contexts
│   ├── hooks/         # Custom hooks
│   └── types.ts       # TypeScript types
├── prisma/
│   └── schema.prisma  # Database schema
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.