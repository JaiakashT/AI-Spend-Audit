// ============================================================
// Core type definitions for AI Spend Audit
// ============================================================

export type UseCase = 'coding' | 'writing' | 'research' | 'data' | 'mixed';

export type ToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'Anthropic API'
  | 'OpenAI API'
  | 'Gemini'
  | 'Windsurf'
  | 'v0';

export type PlanTier =
  | 'free'
  | 'pro'
  | 'plus'
  | 'team'
  | 'business'
  | 'enterprise'
  | 'api'
  | 'custom';

export interface AiToolEntry {
  id: string;
  toolName: ToolName | string;
  plan: PlanTier | string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: AiToolEntry[];
}

export type Confidence = 'high' | 'medium' | 'low';

export interface Recommendation {
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  currentSeats: number;
  recommendedAction: string;
  recommendedPlan?: string;
  estimatedNewSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  confidence: Confidence;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
}

export interface LeadInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
}
