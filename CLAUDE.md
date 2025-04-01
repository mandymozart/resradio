# CLAUDE.md - ResRadio Codebase Guidelines

## Commands
- Build: `yarn build` (CI= react-scripts build)
- Start: `yarn start` or `netlify dev`
- Test: `yarn test` (all tests)
- Single test: `yarn test -t "test name"`
- Lint: Uses default React-Scripts ESLint config

## Code Style
- **React Components**: Use functional components with hooks
- **Imports**: Group imports (React, libraries, local components, styles)
- **State Management**: Use Zustand stores (see `/src/Stores`)
- **Styling**: Emotion styled-components with CSS-in-JS
- **Naming**: PascalCase for components, camelCase for functions/variables
- **File Structure**: Components grouped by feature
- **Error Handling**: Use react-error-boundary for component errors
- **Formatting**: Use 2-space indentation
- **API Calls**: Use SWR for data fetching
- **TypeScript**: No types (JS only)
- **Database**: MySQL with prepared statements for queries