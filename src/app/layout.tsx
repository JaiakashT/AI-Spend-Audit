import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Spend Audit — Find Hidden Waste in AI Subscriptions | Credex',
  description:
    'Free tool that audits your startup AI spending and recommends cost reductions. Analyze ChatGPT, Cursor, Copilot, Claude, and more. Save up to 40% on AI tools.',
  keywords: [
    'AI spend audit',
    'AI cost optimization',
    'ChatGPT pricing',
    'Cursor pricing',
    'AI subscription savings',
    'startup AI tools',
  ],
  authors: [{ name: 'Credex' }],
  openGraph: {
    title: 'AI Spend Audit — Find Hidden Waste in AI Subscriptions',
    description:
      'Free tool that audits your startup AI spending and recommends cost reductions. Save up to 40%.',
    type: 'website',
    siteName: 'AI Spend Audit by Credex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit — Find Hidden Waste in AI Subscriptions',
    description:
      'Free tool that audits your startup AI spending. Save up to 40%.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
