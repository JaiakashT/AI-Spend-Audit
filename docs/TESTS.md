# Testing Strategy

## Philosophy
We prioritize testing the **Audit Engine** over UI components, as the accuracy of financial recommendations is the core product value.

## Test Suite
We use **Vitest** for its speed and native ESM support in Next.js.

### Coverage
1. **Downgrade Logic**: Ensures we suggest cheaper plans when team size thresholds are met.
2. **Overlap Detection**: Checks for multiple subscriptions in the same category (e.g., two coding assistants).
3. **Calculations**: Verifies that monthly and annual savings math is correct.
4. **Edge Cases**: Handles 0-spend tools, solo users, and enterprise plans.

## Running Tests
```bash
npm run test
```

## Continuous Integration
GitHub Actions automatically runs the test suite on every Push and Pull Request to `main`.
