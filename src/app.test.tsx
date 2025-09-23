import { render, screen } from '@testing-library/react';
import { App } from './app';
import { userEvent, type Options } from '@testing-library/user-event';

const setup = ({
  userEventOptions,
}: Partial<{ userEventOptions: Options }>) => {
  const user = userEvent.setup(userEventOptions);
  const utils = render(<App />);

  return {
    ...utils,
    user,
  } as const;
};

describe('App', () => {
  it('should increment value on click button', async () => {
    const { user } = setup({});

    expect(
      screen.getByRole('button', { name: 'count is 0' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /count is/i }));

    expect(
      screen.getByRole('button', { name: 'count is 1' })
    ).toBeInTheDocument();
  });
});
