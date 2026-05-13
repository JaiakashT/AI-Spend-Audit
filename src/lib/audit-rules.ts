// ============================================================
// AI tool database — plans, pricing, and alternatives
// Used by the audit engine for rule-based recommendations
// ============================================================

import type { ToolName, PlanTier } from '@/types/audit';

export interface PlanInfo {
  name: PlanTier | string;
  label: string;
  pricePerSeat: number; // monthly per seat
}

export interface ToolInfo {
  name: ToolName;
  category: 'coding' | 'chat' | 'api' | 'design';
  plans: PlanInfo[];
  alternatives?: string[];
}

// ============================================================
// Tool definitions with real-world pricing (as of 2025)
// ============================================================

export const TOOL_DATABASE: ToolInfo[] = [
  {
    name: 'Cursor',
    category: 'coding',
    plans: [
      { name: 'free', label: 'Hobby (Free)', pricePerSeat: 0 },
      { name: 'pro', label: 'Pro', pricePerSeat: 20 },
      { name: 'business', label: 'Business', pricePerSeat: 40 },
    ],
    alternatives: ['GitHub Copilot', 'Windsurf'],
  },
  {
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'pro', label: 'Pro', pricePerSeat: 10 },
      { name: 'business', label: 'Business', pricePerSeat: 19 },
      { name: 'enterprise', label: 'Enterprise', pricePerSeat: 39 },
    ],
    alternatives: ['Cursor', 'Windsurf'],
  },
  {
    name: 'ChatGPT',
    category: 'chat',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'plus', label: 'Plus', pricePerSeat: 20 },
      { name: 'team', label: 'Team', pricePerSeat: 25 },
      { name: 'enterprise', label: 'Enterprise', pricePerSeat: 60 },
    ],
    alternatives: ['Claude', 'Gemini'],
  },
  {
    name: 'Claude',
    category: 'chat',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'pro', label: 'Pro', pricePerSeat: 20 },
      { name: 'team', label: 'Team', pricePerSeat: 25 },
      { name: 'enterprise', label: 'Enterprise', pricePerSeat: 30 },
    ],
    alternatives: ['ChatGPT', 'Gemini'],
  },
  {
    name: 'Gemini',
    category: 'chat',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'pro', label: 'Advanced', pricePerSeat: 20 },
      { name: 'business', label: 'Business', pricePerSeat: 24 },
      { name: 'enterprise', label: 'Enterprise', pricePerSeat: 30 },
    ],
    alternatives: ['ChatGPT', 'Claude'],
  },
  {
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { name: 'api', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
    alternatives: ['Anthropic API'],
  },
  {
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { name: 'api', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
    alternatives: ['OpenAI API'],
  },
  {
    name: 'Windsurf',
    category: 'coding',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'pro', label: 'Pro', pricePerSeat: 15 },
      { name: 'team', label: 'Team', pricePerSeat: 35 },
    ],
    alternatives: ['Cursor', 'GitHub Copilot'],
  },
  {
    name: 'v0',
    category: 'design',
    plans: [
      { name: 'free', label: 'Free', pricePerSeat: 0 },
      { name: 'pro', label: 'Premium', pricePerSeat: 20 },
      { name: 'team', label: 'Team', pricePerSeat: 30 },
    ],
    alternatives: [],
  },
];

/**
 * Look up a tool by name (case-insensitive)
 */
export function findTool(name: string): ToolInfo | undefined {
  return TOOL_DATABASE.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Look up a specific plan for a tool
 */
export function findPlan(toolName: string, planName: string): PlanInfo | undefined {
  const tool = findTool(toolName);
  if (!tool) return undefined;
  return tool.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
}

/**
 * Get the list of available tool names
 */
export function getToolNames(): ToolName[] {
  return TOOL_DATABASE.map((t) => t.name);
}

/**
 * Get plans for a tool
 */
export function getPlansForTool(toolName: string): PlanInfo[] {
  const tool = findTool(toolName);
  return tool?.plans ?? [];
}
