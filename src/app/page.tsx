import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { SavingsExamples } from '@/components/landing/savings-examples';
import { SocialProof } from '@/components/landing/social-proof';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <SavingsExamples />
      <SocialProof />
      <FAQ />
      <Footer />
    </main>
  );
}
