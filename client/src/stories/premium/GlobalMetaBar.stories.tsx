import type { Meta, StoryObj } from '@storybook/react';
import { GlobalMetaBar } from '@/components/premium/GlobalMetaBar';

const meta: Meta<typeof GlobalMetaBar> = {
  title: 'Premium/GlobalMetaBar',
  component: GlobalMetaBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] bg-background p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlobalMetaBar>;

export const Default: Story = {
  args: {
    totalPlayers: 50_000,
    activeTierKey: 'leaderboard.tierSilver',
    nextTierHint: { tierKey: 'leaderboard.tierGold', points: '12.5K' },
  },
};

export const PodiumTier: Story = {
  args: {
    totalPlayers: 2_000_000,
    activeTierKey: 'leaderboard.tierPodium',
  },
};

export const LoadingScale: Story = {
  args: {
    totalPlayers: 0,
  },
};
