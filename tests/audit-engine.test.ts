// ============================================================
// Audit Engine Tests — rule-based logic validation
// ============================================================

import { describe, it, expect } from 'vitest';
import { runAudit } from '@/lib/audit-engine';
import type { AuditInput, AiToolEntry } from '@/types/audit';

// Helper to create a tool entry
function tool(
  toolName: string,
  plan: string,
  monthlySpend: number,
  seats: number = 1
): AiToolEntry {
  return { id: `test-${toolName}`, toolName, plan, monthlySpend, seats };
}

// Helper to create audit input
function input(
  tools: AiToolEntry[],
  teamSize: number = 5,
  useCase: 'coding' | 'writing' | 'research' | 'data' | 'mixed' = 'coding'
): AuditInput {
  return { teamSize, useCase, tools };
}

describe('Audit Engine', () => {
  // ============================================================
  // Test 1: ChatGPT Team ≤2 users → recommends Plus (downgrade)
  // ============================================================
  it('should recommend ChatGPT Plus when Team plan has ≤2 users', () => {
    const result = runAudit(
      input([tool('ChatGPT', 'team', 50, 2)], 2)
    );

    const rec = result.recommendations.find(
      (r) => r.toolName === 'ChatGPT' && r.recommendedPlan === 'plus'
    );

    expect(rec).toBeDefined();
    expect(rec!.monthlySavings).toBeGreaterThan(0);
    expect(rec!.recommendedAction).toContain('Plus');
    expect(rec!.confidence).toBe('high');
  });

  // ============================================================
  // Test 2: Correct savings calculation for multiple tools
  // ============================================================
  it('should calculate total savings across multiple tools', () => {
    const result = runAudit(
      input(
        [
          tool('ChatGPT', 'team', 50, 2),
          tool('Cursor', 'business', 40, 1),
        ],
        1
      )
    );

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
    expect(result.totalCurrentSpend).toBe(90);
    expect(result.totalOptimizedSpend).toBe(
      result.totalCurrentSpend - result.totalMonthlySavings
    );
  });

  // ============================================================
  // Test 3: Invalid/empty input handling
  // ============================================================
  it('should return zero savings when no optimization is possible', () => {
    const result = runAudit(
      input([tool('ChatGPT', 'plus', 20, 1)], 1)
    );

    // Already on the right plan, correct seats — no savings expected
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(0);
  });

  // ============================================================
  // Test 4: Solo Cursor Business → recommends Pro (edge case)
  // ============================================================
  it('should recommend Cursor Pro for solo developer on Business', () => {
    const result = runAudit(
      input([tool('Cursor', 'business', 40, 1)], 1)
    );

    const rec = result.recommendations.find(
      (r) => r.toolName === 'Cursor' && r.recommendedPlan === 'pro'
    );

    expect(rec).toBeDefined();
    expect(rec!.monthlySavings).toBe(20);
    expect(rec!.annualSavings).toBe(240);
  });

  // ============================================================
  // Test 5: Overlap detection for multiple coding tools
  // ============================================================
  it('should detect overlapping coding tool subscriptions', () => {
    const result = runAudit(
      input([
        tool('Cursor', 'pro', 20, 1),
        tool('GitHub Copilot', 'pro', 10, 1),
        tool('Windsurf', 'pro', 15, 1),
      ])
    );

    const overlapRec = result.recommendations.find(
      (r) => r.recommendedAction.includes('Consolidate')
    );

    expect(overlapRec).toBeDefined();
    expect(overlapRec!.monthlySavings).toBeGreaterThan(0);
    expect(overlapRec!.confidence).toBe('medium');
  });

  // ============================================================
  // Test 6: Seat overprovisioning detection
  // ============================================================
  it('should flag excess seats when seats > team size', () => {
    const result = runAudit(
      input([tool('GitHub Copilot', 'business', 190, 10)], 5)
    );

    const seatRec = result.recommendations.find(
      (r) => r.recommendedAction.includes('Reduce')
    );

    expect(seatRec).toBeDefined();
    expect(seatRec!.monthlySavings).toBe(95); // 5 excess × $19/seat
    expect(seatRec!.confidence).toBe('high');
  });

  // ============================================================
  // Test 7: Enterprise overkill for small teams
  // ============================================================
  it('should recommend downgrade from Enterprise for small teams', () => {
    const result = runAudit(
      input([tool('ChatGPT', 'enterprise', 300, 5)], 5)
    );

    const rec = result.recommendations.find(
      (r) => r.toolName === 'ChatGPT' && r.recommendedAction.includes('Downgrade')
    );

    expect(rec).toBeDefined();
    expect(rec!.confidence).toBe('medium');
  });

  // ============================================================
  // Test 8: API optimization with Credex credits
  // ============================================================
  it('should suggest Credex credits for API spend > $50', () => {
    const result = runAudit(
      input([tool('OpenAI API', 'api', 200, 1)])
    );

    const rec = result.recommendations.find(
      (r) => r.recommendedAction.includes('Credex')
    );

    expect(rec).toBeDefined();
    expect(rec!.monthlySavings).toBe(50); // 25% of $200
    expect(rec!.confidence).toBe('medium');
  });

  // ============================================================
  // Test 9: Result structure validity
  // ============================================================
  it('should return a valid audit result structure', () => {
    const result = runAudit(
      input([tool('ChatGPT', 'team', 50, 2)], 2)
    );

    expect(result.id).toBeDefined();
    expect(result.id.length).toBeGreaterThan(0);
    expect(result.createdAt).toBeDefined();
    expect(result.input).toBeDefined();
    expect(result.recommendations).toBeInstanceOf(Array);
    expect(result.totalCurrentSpend).toBeGreaterThanOrEqual(0);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.totalAnnualSavings).toBeGreaterThanOrEqual(0);
  });
});
