# AI Spend Audit

A production-quality SaaS MVP that audits a startup's AI software spending and recommends ways to reduce costs.

## Features
- **Rule-Based Audit Engine**: Accurate analysis of AI tool subscriptions without reliance on LLM tokens for calculations.
- **Dynamic Form**: Interactive experience for adding multiple AI tools with plan-specific pricing.
- **AI Summaries**: Personalized executive summaries generated via OpenAI.
- **Lead Capture**: Integrated email capture with Supabase and Resend.
- **Shareable URLs**: Publicly accessible, privacy-safe audit reports.
- **Premium UI**: Modern SaaS aesthetic inspired by Linear and Vercel.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **Database**: Supabase
- **Email**: Resend
- **AI**: OpenAI API
- **Testing**: Vitest

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project
- OpenAI API Key
- Resend API Key

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your keys.
4. Run the development server: `npm run dev`

### Database Setup
Run the SQL found in `supabase/schema.sql` in your Supabase SQL editor.

## Documentation
Detailed documentation can be found in the `/docs` directory:
- [Architecture](./docs/ARCHITECTURE.md)
- [Economics](./docs/ECONOMICS.md)
- [GTM Strategy](./docs/GTM.md)
- [Testing](./docs/TESTS.md)
