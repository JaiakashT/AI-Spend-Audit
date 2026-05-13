# Project Reflection

## Technical Tradeoffs
- **Rule-Based vs. AI Engine**: We chose a rule-based engine for calculations to ensure 100% accuracy and trust. We used AI only for the qualitative summary.
- **Session Storage vs. Permanent Auth**: We prioritized a "no-friction" UX by allowing audits without signup, using Supabase for persistence and sessionStorage for immediate navigation.

## Future Improvements
- **Direct CSV Import**: Allow users to upload their credit card statements to auto-detect AI spend.
- **Price Tracking**: Real-time alerts when AI vendors change their pricing.
- **Integration**: Browser extension to detect AI tool usage in real-time.

## Successes
- Achieved a premium look and feel with minimal external dependencies.
- Strong type safety across the entire data flow (Input -> Engine -> DB).
- Extremely fast performance due to Next.js Turbopack and localized logic.
