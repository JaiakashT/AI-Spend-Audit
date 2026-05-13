// ============================================================
// Audit Engine — Rule-based AI spend analysis
// Pure functions, no AI calls, fully deterministic & testable
// ============================================================

import { nanoid } from 'nanoid';
import type {
  AuditInput,
  AuditResult,
  AiToolEntry,
  Recommendation,
  Confidence,
} from '@/types/audit';
import { findTool, findPlan } from './audit-rules';

// ============================================================
// Main entry point
// ============================================================

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];

  // Run per-tool analysis
  for (const tool of input.tools) {
    const toolRecs = analyzeToolSpend(tool, input.teamSize, input.useCase);
    recommendations.push(...toolRecs);
  }

  // Run cross-tool analysis (overlap detection)
  const overlapRecs = detectOverlaps(input.tools, input.useCase);
  recommendations.push(...overlapRecs);

  // Calculate totals
  const totalCurrentSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalOptimizedSpend = totalCurrentSpend - totalMonthlySavings;

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings: Math.max(0, totalMonthlySavings),
    totalAnnualSavings: Math.max(0, totalMonthlySavings * 12),
  };
}

// ============================================================
// Per-tool analysis
// ============================================================

function analyzeToolSpend(
  tool: AiToolEntry,
  teamSize: number,
  useCase: string
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Rule 1: Seat overprovisioning
  const seatRec = checkSeatOverprovisioning(tool, teamSize);
  if (seatRec) recs.push(seatRec);

  // Rule 2: Plan downgrade opportunity
  const planRec = checkPlanDowngrade(tool, teamSize);
  if (planRec) recs.push(planRec);

  // Rule 3: Enterprise overkill for small teams
  const entRec = checkEnterpriseOverkill(tool, teamSize);
  if (entRec) recs.push(entRec);

  // Rule 4: API spend optimization
  const apiRec = checkApiOptimization(tool);
  if (apiRec) recs.push(apiRec);

  // If no specific rule fired, check if spend seems high
  if (recs.length === 0) {
    const generalRec = checkGeneralOverspend(tool, teamSize);
    if (generalRec) recs.push(generalRec);
  }

  return recs;
}

// ============================================================
// Rule implementations
// ============================================================

/**
 * Rule: More seats paid than team size
 */
function checkSeatOverprovisioning(
  tool: AiToolEntry,
  teamSize: number
): Recommendation | null {
  if (tool.seats <= teamSize || tool.seats <= 1) return null;

  const excessSeats = tool.seats - teamSize;
  const costPerSeat = tool.monthlySpend / tool.seats;
  const savings = excessSeats * costPerSeat;

  if (savings < 1) return null;

  return {
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    currentSeats: tool.seats,
    recommendedAction: `Reduce from ${tool.seats} to ${teamSize} seats`,
    estimatedNewSpend: tool.monthlySpend - savings,
    monthlySavings: round(savings),
    annualSavings: round(savings * 12),
    reasoning: `You're paying for ${tool.seats} seats but your team has ${teamSize} members. Removing ${excessSeats} unused seat(s) saves $${round(savings)}/mo.`,
    confidence: 'high',
  };
}

/**
 * Rule: ChatGPT Team with ≤2 users → recommend Plus
 * Rule: Cursor Business for solo dev → recommend Pro
 */
function checkPlanDowngrade(
  tool: AiToolEntry,
  teamSize: number
): Recommendation | null {
  const toolName = tool.toolName.toLowerCase();
  const plan = tool.plan.toLowerCase();

  // ChatGPT Team with ≤2 users → Plus
  if (toolName === 'chatgpt' && plan === 'team' && teamSize <= 2) {
    const currentTotal = tool.monthlySpend;
    const plusPrice = 20 * tool.seats;
    const savings = currentTotal - plusPrice;
    if (savings <= 0) return null;

    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: currentTotal,
      currentSeats: tool.seats,
      recommendedAction: 'Downgrade to ChatGPT Plus',
      recommendedPlan: 'plus',
      estimatedNewSpend: plusPrice,
      monthlySavings: round(savings),
      annualSavings: round(savings * 12),
      reasoning: `ChatGPT Team is designed for larger teams. With only ${teamSize} user(s), individual Plus plans ($20/user/mo) provide the same features at a lower cost.`,
      confidence: 'high',
    };
  }

  // Cursor Business for solo → Pro
  if (toolName === 'cursor' && plan === 'business' && teamSize <= 1) {
    const currentTotal = tool.monthlySpend;
    const proPrice = 20 * tool.seats;
    const savings = currentTotal - proPrice;
    if (savings <= 0) return null;

    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: currentTotal,
      currentSeats: tool.seats,
      recommendedAction: 'Downgrade to Cursor Pro',
      recommendedPlan: 'pro',
      estimatedNewSpend: proPrice,
      monthlySavings: round(savings),
      annualSavings: round(savings * 12),
      reasoning: `Cursor Business is built for teams with admin controls and centralized billing. As a solo developer, Cursor Pro ($20/mo) gives you the same AI features.`,
      confidence: 'high',
    };
  }

  // Claude Team with ≤2 users → Pro
  if (toolName === 'claude' && plan === 'team' && teamSize <= 2) {
    const currentTotal = tool.monthlySpend;
    const proPrice = 20 * tool.seats;
    const savings = currentTotal - proPrice;
    if (savings <= 0) return null;

    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: currentTotal,
      currentSeats: tool.seats,
      recommendedAction: 'Downgrade to Claude Pro',
      recommendedPlan: 'pro',
      estimatedNewSpend: proPrice,
      monthlySavings: round(savings),
      annualSavings: round(savings * 12),
      reasoning: `Claude Team pricing ($25/user/mo) isn't justified for ${teamSize} user(s). Individual Pro plans ($20/user/mo) offer the same model access.`,
      confidence: 'high',
    };
  }

  return null;
}

/**
 * Rule: Enterprise plans for teams < 10
 */
function checkEnterpriseOverkill(
  tool: AiToolEntry,
  teamSize: number
): Recommendation | null {
  const plan = tool.plan.toLowerCase();
  if (plan !== 'enterprise' || teamSize >= 10) return null;

  const toolInfo = findTool(tool.toolName);
  if (!toolInfo) return null;

  // Find the next plan down
  const plans = toolInfo.plans;
  const enterpriseIndex = plans.findIndex(
    (p) => p.name.toLowerCase() === 'enterprise'
  );
  if (enterpriseIndex <= 0) return null;

  const downgrade = plans[enterpriseIndex - 1];
  const newSpend = downgrade.pricePerSeat * tool.seats;
  const savings = tool.monthlySpend - newSpend;

  if (savings <= 0) return null;

  return {
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    currentSeats: tool.seats,
    recommendedAction: `Downgrade to ${downgrade.label}`,
    recommendedPlan: downgrade.name,
    estimatedNewSpend: newSpend,
    monthlySavings: round(savings),
    annualSavings: round(savings * 12),
    reasoning: `Enterprise plans are designed for large organizations (50+ seats) with compliance needs. A team of ${teamSize} rarely needs SSO, SCIM, or audit logs. The ${downgrade.label} plan provides the core AI features.`,
    confidence: 'medium',
  };
}

/**
 * Rule: API retail pricing → suggest Credex credits
 */
function checkApiOptimization(
  tool: AiToolEntry
): Recommendation | null {
  const toolName = tool.toolName.toLowerCase();
  if (!toolName.includes('api')) return null;
  if (tool.monthlySpend < 50) return null; // Only flag meaningful API spend

  // Estimate 25% savings through Credex bulk credits
  const savingsRate = 0.25;
  const savings = tool.monthlySpend * savingsRate;

  return {
    toolName: tool.toolName,
    currentPlan: 'Pay-as-you-go',
    currentSpend: tool.monthlySpend,
    currentSeats: tool.seats,
    recommendedAction: 'Switch to Credex bulk API credits',
    estimatedNewSpend: round(tool.monthlySpend - savings),
    monthlySavings: round(savings),
    annualSavings: round(savings * 12),
    reasoning: `Retail API pricing has significant markup. Through Credex, you can access discounted API credits and save ~25% on your ${tool.toolName} spend.`,
    confidence: 'medium',
  };
}

/**
 * Rule: General overspend detection based on per-seat cost
 */
function checkGeneralOverspend(
  tool: AiToolEntry,
  teamSize: number
): Recommendation | null {
  const toolInfo = findTool(tool.toolName);
  if (!toolInfo) return null;

  const currentPlan = findPlan(tool.toolName, tool.plan);
  if (!currentPlan) return null;

  // Check if they're paying more per seat than the listed price
  const actualPerSeat = tool.monthlySpend / Math.max(1, tool.seats);
  const listedPerSeat = currentPlan.pricePerSeat;

  if (listedPerSeat > 0 && actualPerSeat > listedPerSeat * 1.2) {
    const savings = tool.monthlySpend - listedPerSeat * tool.seats;
    if (savings < 5) return null;

    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      currentSeats: tool.seats,
      recommendedAction: `Verify billing — you may be overpaying`,
      estimatedNewSpend: round(listedPerSeat * tool.seats),
      monthlySavings: round(savings),
      annualSavings: round(savings * 12),
      reasoning: `You're paying $${round(actualPerSeat)}/seat but the listed price is $${listedPerSeat}/seat. Check for add-ons, old pricing, or billing errors.`,
      confidence: 'low',
    };
  }

  return null;
}

// ============================================================
// Cross-tool analysis
// ============================================================

/**
 * Detect overlapping tool subscriptions in the same category
 */
function detectOverlaps(
  tools: AiToolEntry[],
  useCase: string
): Recommendation[] {
  const recs: Recommendation[] = [];
  const categories: Record<string, AiToolEntry[]> = {};

  // Group tools by category
  for (const tool of tools) {
    const info = findTool(tool.toolName);
    if (!info) continue;
    const cat = info.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(tool);
  }

  // Flag categories with multiple paid tools
  for (const [category, catTools] of Object.entries(categories)) {
    const paidTools = catTools.filter((t) => t.monthlySpend > 0);
    if (paidTools.length < 2) continue;

    // Sort by spend descending
    paidTools.sort((a, b) => b.monthlySpend - a.monthlySpend);
    const keeper = paidTools[0];
    const removable = paidTools.slice(1);
    const savings = removable.reduce((sum, t) => sum + t.monthlySpend, 0);

    if (savings < 5) continue;

    const categoryLabel =
      category === 'coding'
        ? 'AI coding assistant'
        : category === 'chat'
        ? 'AI chat'
        : category === 'api'
        ? 'AI API'
        : 'AI';

    recs.push({
      toolName: removable.map((t) => t.toolName).join(', '),
      currentPlan: 'Multiple subscriptions',
      currentSpend: savings,
      currentSeats: removable.reduce((sum, t) => sum + t.seats, 0),
      recommendedAction: `Consolidate ${categoryLabel} tools — keep ${keeper.toolName}`,
      estimatedNewSpend: 0,
      monthlySavings: round(savings),
      annualSavings: round(savings * 12),
      reasoning: `You're paying for ${paidTools.length} overlapping ${categoryLabel} tools. Consider consolidating to ${keeper.toolName} (your highest-spend tool) and eliminating redundant subscriptions.`,
      confidence: 'medium' as Confidence,
    });
  }

  return recs;
}

// ============================================================
// Utility
// ============================================================

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
