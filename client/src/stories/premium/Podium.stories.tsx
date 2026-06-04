import type { Meta, StoryObj } from '@storybook/react';
import { Podium } from '@/components/premium/Podium';
import { podiumEntries } from '../fixtures';

const meta: Meta<typeof Podium> = {
  title: 'Premium/Podium',
  component: Podium,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] bg-background px-4 py-6">
        <Story />
      </div>
    ),
  ],
  args: {
    ...podiumEntries,
    poolTotal: 1_250_000,
  },
};

export default meta;
type Story = StoryObj<typeof Podium>;

export const Default: Story = {};

export const HighlightSecond: Story = {
  args: {
    highlightUserId: podiumEntries.second.userId,
  },
};

export const Empty: Story = {
  args: {
    first: undefined,
    second: undefined,
    third: undefined,
    poolTotal: 0,
  },
};
