# Custom instructions for Copilot

## General

- Always respond in Japanese using JLPT N1 level vocabulary and grammar.

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

## React guide

- Use function components for all components
- Memoize functions with `useCallback`
- Memoize values with `useMemo`

## Testing guide

- Always implement using the `setup` pattern
- The type of `setup` arguments should basically be `Partial<ComponentProps<typeof XxxComponent>>`
- Do not give default value `={}` to `setup` arguments (strictly call as `setup({})`)

  ```tsx
  const setup = ({
    userEventOptions, // Arguments should be listed in alphabetical order
    value = generateMockXxx(), // Set default value for required props
    ...rest // Optional props such as onClick should be included in rest
  }: Partial<ComponentProps<typeof XxxComponent>> & {
    userEventOptions?: Options;
  }) => {
    const user = userEvent.setup(userEventOptions);
    const utils = render(<XxxComponent value={value} {...rest} />);

    return {
      ...utils,
      user,
    } as const;
  };
  ```

- Always define `setup` outside of `describe()`
- Import `act`, `render`, and `screen` from `@testing-library/react`
- Import `userEvent` from `@testing-library/user-event`
  ```ts
  // Example
  import type { Options } from '@testing-library/user-event';
  import { userEvent } from '@testing-library/user-event';
  ```
- For readability, insert a blank line following the AAA (Arrange, Act, Assert) pattern

  ```ts
  describe('...', () => {
    it('should ...', () => {
      // Arrange: Preparation for the test, including setup()
      const onClick = vi.fn();
      const { user } = setup({ onClick });

      /* [Required] Insert a blank line between Arrange and Act */

      // Act: User actions such as user.click()
      await user.click(screen.getByRole('button', { name: /Create New/ }));

      /* [Required] Insert a blank line between Act and Assert */

      // Assert: Verification of expected results using expect()
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
  ```
