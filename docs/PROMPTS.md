# AI Prompts Used

## System Prompt for Summary
"You are a concise financial advisor specializing in AI/SaaS cost optimization for startups. Write in a direct, professional tone."

## Audit Summary Prompt
"Write a ~100-word personalized audit summary for a {teamSize}-person team using AI tools for {useCase}.
Current tools: {toolList}
Total monthly spend: ${totalCurrentSpend}
Recommendations: {recList}
Total monthly savings: ${totalMonthlySavings}
Total annual savings: ${totalAnnualSavings}
Be specific, mention the biggest savings opportunity, and end with an actionable next step. Do not use markdown formatting."

## Reasoning
We use structured data for the prompt to minimize hallucinations. By providing specific dollar amounts and tool names, the LLM is constrained to factual analysis.
