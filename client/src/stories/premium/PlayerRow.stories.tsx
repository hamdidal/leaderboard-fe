import type { Meta, StoryObj } from '@storybook/react';
import { PlayerRow } from '@/components/premium/PlayerRow';
import { mockEntry } from '../fixtures';

const meta: Meta<typeof PlayerRow> = {
  title: 'Premium/PlayerRow',
  component: PlayerRow,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="top100-panel glass-panel w-full max-w-[420px] p-1">
        <Story />
      </div>
    ),
  ],
  args: {
    entry: mockEntry(12, { name: 'Alex Rivera' }),
    poolTotal: 1_250_000,
    index: 0,
  },
};

export default meta;
type Story = StoryObj<typeof PlayerRow>;

export const Default: Story = {};

export const CurrentUser: Story = {
  args: {
    entry: mockEntry(76, { userId: 'demo-user', name: 'Demo Hero' }),
    isCurrentUser: true,
  },
};

export const RankUp: Story = {
  args: {
    entry: mockEntry(8, { name: 'Climber' }),
    rankDelta: 3,
  },
};

export const RankDown: Story = {
  args: {
    entry: mockEntry(42, { name: 'Slider' }),
    rankDelta: -2,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    entry: mockEntry(99, { name: 'Gatekeeper' }),
  },
};
