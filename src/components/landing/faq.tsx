// ============================================================
// FAQ section — common questions about the audit
// ============================================================

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI spend audit work?',
    answer:
      'You enter the AI tools your team uses, their plans, and monthly spend. Our rule-based engine analyzes your stack against real pricing data to identify overspending, plan mismatches, and overlap. You get instant recommendations with estimated savings.',
  },
  {
    question: 'Is this really free?',
    answer:
      'Yes, 100% free. No credit card, no signup required. We make money through Credex — our enterprise AI procurement service for larger teams. The audit helps us identify teams that could benefit from Credex.',
  },
  {
    question: 'Do you access my AI accounts or API keys?',
    answer:
      'Never. We only ask for tool names, plan types, and monthly spend — information you already know from your billing dashboard. We never request credentials, API keys, or any sensitive data.',
  },
  {
    question: 'How accurate are the recommendations?',
    answer:
      'Our recommendations are based on current published pricing from each vendor. Savings estimates are conservative — actual savings may be higher. We flag our confidence level on each recommendation so you know which ones to act on first.',
  },
  {
    question: 'Can I share the audit with my team?',
    answer:
      'Yes! Every audit generates a unique shareable URL. The public link shows tools, recommendations, and savings — but never any personal information like email addresses.',
  },
  {
    question: 'What is Credex?',
    answer:
      'Credex helps startups and growing companies negotiate better rates on AI tools and API credits. Think group purchasing power for AI subscriptions. The free audit is step one — if you want hands-on help optimizing, Credex can help.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-zinc-400">
            Everything you need to know about the AI Spend Audit.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 data-[state=open]:border-emerald-500/20"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-white hover:text-emerald-400 hover:no-underline sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
