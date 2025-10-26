---
applyTo: 'src/**/*.ts, src/**/*.tsx'
description: 'Coding guidelines'
---

# Coding Guidelines

## React Good Practices

- Use function components for all components
- Memoize functions with `useCallback`
- Memoize values with `useMemo`
- The name on the prop type must be `Props`
- Use optional types in `Props` for callbacks, event handlers and boolean flags
  - Example: Use `onClick?: () => void` instead of `onClick: () => void`
  - Example: Use `isEnabled?: boolean` instead of `isEnabled: boolean`

## Presentational Components and Presenters

A Presentational Component is a design pattern that extracts rendering-related logic from complex components, creating components that are easier to test.

A Presentational Component consists of the following elements:

- Presentational Component (view part)
- Presenter (logic part)

A Presenter is a custom hook that encapsulates the logic of a Presentational Component, such as state management and event handling.

### Naming Conventions

- Use the file extension `*.component.tsx` for Presentational Components
- Use the file extension `*.component.spec.tsx` for Presentational Component tests
- Add the suffix `XxxComponent` to Presentational Component names
- Use the file extension `*.presenter.ts` for Presenters
- Add the suffix `XxxPresenter` to Presenter names

### Directory Structure

- Place Presentational Components and their tests in the same directory
- Place Presentational Components and Presenters in the same directory

```
libs/**/feature-example-list/src/lib/
├── example-list.component.tsx
├── example-list.component.spec.tsx
└── example-list.presenter.ts
```

- If there are multiple Presentational Components, group them in a `/components` directory
- Place a barrel file `index.ts`
- The barrel file should export `XxxComponent`
- Never export `Props` from `*.component.tsx` files
- Never export `FormValues` from `*.presenter.ts` files

```
libs/**/feature-example-list/src/lib/components/
├── example-list/
│   ├── example-list.component.tsx
│   ├── example-list.component.spec.tsx
│   ├── example-list.presenter.ts
│   └── index.ts
├── example-detail/
│   ├── example-detail.component.tsx
│   ├── example-detail.component.spec.tsx
│   ├── example-detail.presenter.ts
│   └── index.ts
```

### Example

```ts
// src/example.presenter.ts

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  title: string;
  onSave?: (input: { title: string }) => void;
};

export const useExamplePresenter = ({ title, onSave }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: { title },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSave?.({ title: values.title });
  });

  return {
    form,
    handleSubmit
  } as const;
};
```

```tsx
// src/example.component.tsx

type Props = {
  title: string;
  onSave?: (input: { title: string }) => void;
};

export const ExampleComponent = ({ title, onSave }: Props) => {
  const { form, handleSubmit } = useExamplePresenter({ title, onSave });

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" {...form.register('title')} />
      <button type="submit">Save</button>
    </div>
  );
};
```

### Testing

- Always implement using the `setup` pattern
- The type of `setup` arguments should basically be `Partial<ComponentProps<typeof XxxComponent>>`
- Do not give a default value `={}` to `setup` arguments (always call as `setup({})`)

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
- Follow the AAA (Arrange, Act, Assert) pattern

```ts
const onClick = vi.fn();             // The Arrange part prepares everything needed for the test
const { user } = setup({ onClick }); // like defining mocks and calling setup() etc.
```
```ts
await user.click(screen.getByRole('button', { name: /Create New/ })); // The Act part performs user actions
```
```ts
await waitFor(() => {
  expect(onClick).toHaveBeenCalledTimes(1); // The Assert part verifies the expected results
});
```

- Insert a blank line between Arrange, Act, and Assert sections

  ```ts
  describe('...', () => {
    it('should ...', async () => {
      const onClick = vi.fn();
      const { user } = setup({ onClick });

      /* [Required] Insert a blank line between Arrange and Act */

      await user.click(screen.getByRole('button', { name: /Create New/ }));

      /* [Required] Insert a blank line between Act and Assert */

      await waitFor(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });
  });
  ```
- Never insert comments like `// Arrange`, `// Act`, `// Assert` in the test code because they make the code noisy.

### Testing Example

```tsx
// src/example.component.spec.tsx

import { render, screen, waitFor } from '@testing-library/react';
import type { Options } from '@testing-library/user-event';
import { userEvent } from '@testing-library/user-event';
import type { ComponentProps } from 'react';

import { ExampleComponent } from './example.component';

const setup = ({
  title = 'Title',
  ...rest
}: Partial<React.ComponentProps<typeof ExampleComponent>>) => {
  const user = userEvent.setup(userEventOptions);
  const utils = render(<ExampleComponent title={title} {...rest} />);

  return {
    ...utils,
    user,
  } as const;
};

describe('ExampleComponent', () => {
  it('should render title', () => {
    setup({ title: 'Test Title' });

    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Test Title');
  });

  it('should call onSave when form is submitted', async () => {
    const onSave = vi.fn();
    const { user } = setup({ title: 'Initial Title', onSave });

    await user.clear(screen.getByRole('textbox', { name: 'Title' }));
    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'New Title');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith({ title: 'New Title' });
  });
});