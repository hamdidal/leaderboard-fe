import type { Meta, StoryObj } from '@storybook/react';
import { StickyPlayerContext } from '@/components/premium/StickyPlayerContext';
import {
  meOutsideTop100,
  mockEntry,
  neighborsOutsideTop100,
} from '../fixtures';

const meta: Meta<typeof StickyPlayerContext> = {
  title: 'Premium/StickyPlayerContext',
  component: StickyPlayerContext,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] flex-col justify-end bg-background">
        <Story />
      </div>
    ),
  ],
  args: {
    show: true,
    totalPlayers: 50_000,
    weeklyContribution: 161,
  },
};

export default meta;
type Story = StoryObj<typeof StickyPlayerContext>;

export const OutsideTop100: Story = {
  args: {
    me: meOutsideTop100,
    neighbors: neighborsOutsideTop100,
    inTop100: false,
    pointsToTop100: 12_500,
  },
};

export const InTop100: Story = {
  args: {
    me: mockEntry(76, { userId: 'demo-user', name: 'Demo Hero' }),
    neighbors: [
      mockEntry(73),
      mockEntry(74),
      mockEntry(75),
      mockEntry(77),
      mockEntry(78),
    ],
    inTop100: true,
    pointsToTop100: null,
  },
};
