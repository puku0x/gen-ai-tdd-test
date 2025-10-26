# Custom instructions for Copilot

## General

- Always respond in Japanese using JLPT N1 level vocabulary and grammar.
- Always use the framework of phrase structure grammar, compose sentences that are easy to understand.

## Technical Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: CSS
- **UI Components**: None
- **Build Tool**: Vite

## Development Tools

- **Testing**: Vitest, Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## Directory Structure

```
src/
├── assets/              # Static assets such as images and fonts
├── app.tsx              # Main application
└── app.test.tsx         # Main application test
```

### Basic Commands

```bash
# Start the application
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

You must add `--` to pass arguments to the npm scripts.

```bash
# Test with arguments
npm test -- --silent
npm test -- --coverage    # Coverage report

# Lint with fix
npm run lint -- --fix
```
