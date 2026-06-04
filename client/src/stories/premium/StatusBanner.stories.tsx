import type { Meta, StoryObj } from '@storybook/react';
import { StatusBanner } from '@/components/premium/StatusBanner';

const meta: Meta<typeof StatusBanner> = {
  title: 'Premium/StatusBanner',
  component: StatusBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof StatusBanner>;

export const Distributing: Story = {
  args: {
    variant: 'distributing',
    message: 'Rewards are being calculated…',
  },
};

export const ClosedWithWinner: Story = {
  args: {
    variant: 'closed',
    message: 'Week closed — results below',
    winnerName: 'Champion Kai',
    playerReward: 4_200,
  },
};

export const ClosedMinimal: Story = {
  args: {
    variant: 'closed',
    message: 'Week closed — results below',
  },
};
