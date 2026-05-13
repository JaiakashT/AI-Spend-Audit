// ============================================================
// OpenAI helper — generates personalized audit summaries
// ============================================================

import OpenAI from 'openai';
import type { AuditResult } from '@/types/audit';

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[OpenAI] Missing API key — will use fallback summaries');
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Generate a ~100-word personalized audit summary
 */
export async function generateAuditSummary(
  audit: AuditResult
): Promise<string> {
  const client = getClient();

  if (!client) {
    return generateFallbackSummary(audit);
  }

  try {
    const prompt = buildPrompt(audit);
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a concise financial advisor specializing in AI/SaaS cost optimization for startups. Write in a direct, professional tone.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      generateFallbackSummary(audit)
    );
  } catch (error) {
    console.error('[OpenAI] Summary generation failed:', error);
    return generateFallbackSummary(audit);
  }
}

function buildPrompt(audit: AuditResult): string {
  const toolList = audit.input.tools
    .map((t) => `${t.toolName} (${t.plan}, $${t.monthlySpend}/mo, ${t.seats} seats)`)
    .join(', ');

  const recList = audit.recommendations
    .map((r) => `${r.toolName}: ${r.recommendedAction} (saves $${r.monthlySavings}/mo)`)
    .join('; ');

  return `Write a ~100-word personalized audit summary for a ${audit.input.teamSize}-person team using AI tools for ${audit.input.useCase}.

Current tools: ${toolList}
Total monthly spend: $${audit.totalCurrentSpend}
Recommendations: ${recList}
Total monthly savings: $${audit.totalMonthlySavings}
Total annual savings: $${audit.totalAnnualSavings}

Be specific, mention the biggest savings opportunity, and end with an actionable next step. Do not use markdown formatting.`;
}

/**
 * Template-based fallback when OpenAI is unavailable
 */
export function generateFallbackSummary(audit: AuditResult): string {
  if (audit.recommendations.length === 0) {
    return `Your ${audit.input.teamSize}-person team is spending $${audit.totalCurrentSpend}/month across ${audit.input.tools.length} AI tool(s). Your spending looks well-optimized — no significant savings opportunities were identified. Keep monitoring your usage as your team grows.`;
  }

  const topRec = audit.recommendations.reduce((a, b) =>
    a.monthlySavings > b.monthlySavings ? a : b
  );

  return `Your ${audit.input.teamSize}-person team spends $${audit.totalCurrentSpend}/month on ${audit.input.tools.length} AI tool(s). We found $${audit.totalMonthlySavings}/month in potential savings ($${audit.totalAnnualSavings}/year). The biggest opportunity: ${topRec.recommendedAction} for ${topRec.toolName}, saving $${topRec.monthlySavings}/month. ${audit.recommendations.length > 1 ? `Plus ${audit.recommendations.length - 1} more recommendation(s).` : ''} Take action today to optimize your AI spend.`;
}
