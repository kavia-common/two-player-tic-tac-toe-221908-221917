# Static Analysis Report — tic_tac_toe_frontend

Scope: project-wide review of the React frontend (Create React App)
Checks performed:
- Dependency installation and unit tests
- ESLint (flat config) run
- Common React anti-patterns pass
- Basic dead code/unreferenced artifacts pass
- Prettier/formatting consistency (visual/heuristic)
- Security/dependency audit (note on CRA constraints)

Date: 2025-11-10

---

## Summary of Issues by Category and Severity

High
- Lint: no-undef in App.js for global timer APIs
  - clearTimeout and setTimeout flagged as undefined due to missing browser globals in ESLint config.
- Lint: Missing rule definition react-hooks/exhaustive-deps
  - The ruleset references react-hooks/exhaustive-deps but the react-hooks plugin is not configured.

Medium
- Tests: One failing test “Restart resets board and maintains mode/side”
  - The test cannot find the “Restart” button by role/name during its sequence. This looks like timing/logic in the test scenario (AI mode, timers). The component code does render a Restart button with correct accessible name when the game is over; the test may not force a game-over state before looking for Restart.

Low
- Formatting: Minor spacing/indentation is generally consistent; no Prettier config present. Introducing Prettier would standardize formatting.
- Dead code: No unused files detected; imports are in use. ESLint unused-var rule is configured to ignore certain names.
- Dependency audit: CRA-based projects can have audit warnings via transitive deps; see Recommendations.

---

## Detailed Findings

### 1) ESLint Errors (flat config run)

Command: `npx eslint . -f stylish`

Results:
- src/App.js
  - 39:9 error 'clearTimeout' is not defined (no-undef)
  - 51:27 error 'setTimeout' is not defined (no-undef)
  - 62:5 error Definition for rule 'react-hooks/exhaustive-deps' was not found (react-hooks/exhaustive-deps)
  - 87:7 error 'clearTimeout' is not defined (no-undef)
  - 99:7 error 'clearTimeout' is not defined (no-undef)
  - 112:7 error 'clearTimeout' is not defined (no-undef)
- src/App.test.js
  - 4:1 error 'jest' is not defined (no-undef)
  - 41:5 error 'jest' is not defined (no-undef)
  - 55:5 error 'jest' is not defined (no-undef)

Root causes and suggested fixes:
- Browser globals: The flat eslint.config.mjs sets globals for document, window, test, expect — but not for setTimeout/clearTimeout and jest.
  - Add to globals: setTimeout, clearTimeout, jest (true).
- React hooks plugin: The project references react-hooks/exhaustive-deps in a disable comment or expects this rule to exist, but the plugin is not added in the flat config.
  - Add eslint-plugin-react-hooks to the config and enable recommended rules.

Note: App.js includes an eslint-disable-next-line react-hooks/exhaustive-deps, but the plugin is missing, causing the “Definition for rule not found” error.

### 2) Unit Tests

Command: `CI=true npm test -- --watchAll=false`

- 3 tests passed
- 1 test failed: “Restart resets board and maintains mode/side”
  - Failure: Unable to find role button with name /restart/i.
  - The component renders a Restart button only when gameOver is true. In the failing test, it clicks one cell and advances timers (for AI), then immediately searches for Restart. If the board is not in a terminal state (win/draw), the button will not exist.
  - Recommendation: Update the test to force a win/draw before expecting Restart, or assert for the hint state first and then simulate a game-over sequence. Alternatively, if the intention is to show a restart button anytime, modify the UI to always show a restart button (product decision).

Current component behavior appears consistent with spec in README: restart appears after game completion.

### 3) Common React Issues

- Keys in list: Board cells map uses index as key — acceptable for static 3x3 grid that doesn’t reorder.
- Effect dependencies: One effect intentionally disables exhaustive-deps due to timer logic; with react-hooks plugin added, the suppression will be recognized. Consider refactoring AI move scheduling into a stable callback or use ref to satisfy exhaustive-deps, but current approach is acceptable given controlled environment.
- State handling: setXIsNext toggles are correct; care has been taken to clear timers on unmount and on mode/side changes.

### 4) Dead Code / Unused imports

- No unused files found.
- ESLint no-unused-vars is active with ignore pattern 'React|App' to prevent false positives. No unused imports reported.

### 5) Complexity Hotspots

- gameUtils.js minimax is simple and readable; no significant cyclomatic complexity concerns for this small board problem.
- App.js logic is centralized but manageable. If features grow, consider extracting mode/AI logic into custom hooks.

### 6) Prettier / Formatting

- No .prettierrc present. Formatting appears consistent but adding Prettier will standardize style and prevent drift. CRA supports Prettier; adding a script is straightforward.

### 7) Security / Dependency Audit

- Using react-scripts 5.x which pins a number of transitive dependencies that npm audit often flags. Remediating transitive advisories may require upgrading CRA or migrating to Vite/CRA alternatives.
- Recommendation: Run `npm audit --production` to get a current snapshot. Consider upgrading to newer tooling or lockfile maintenance. For this task, no production code calls untrusted input; risk is low.

---

## Top Actionable Fixes

1) Fix ESLint config for globals and hooks:
- Add setTimeout and clearTimeout to globals
- Add jest to globals (test files)
- Add react-hooks plugin and recommended rules

2) Add project scripts for linting and formatting:
- "lint": "eslint ."
- Optional Prettier config and script for consistent formatting.

3) Testing: Decide behavior of Restart button
- If intended only after game completion: update test to force a terminal state before expecting Restart.
- If intended to always be available: adjust UI to always show Restart and update test accordingly.

4) Optional: Add Prettier
- Include a .prettierrc and "format" script.

---

## Proposed Config Changes

- Update eslint.config.mjs:
  - Add globals: setTimeout, clearTimeout, jest
  - Add plugin: eslint-plugin-react-hooks with recommended rules

- Add Prettier configuration file and npm scripts (optional but recommended).

---

## Recommended npm Scripts

- "lint": "eslint ."
- "lint:fix": "eslint . --fix"
- "format": "prettier --write ."
- "audit": "npm audit --audit-level=moderate"

---

## Notes on Environment Variables

The app does not depend on backend or environment vars to run; no env checks in code. The provided container_env list can be ignored for this frontend.

---

## Appendix: Commands Run and Outcomes

- npm ci: success after clearing babel-loader cache files
- npm test (CI): 3 passed, 1 failed (Restart test)
- npx eslint .: 9 errors across two files (globals and missing plugin)

