import type { Meta, StoryObj } from '@storybook/react';
import {
  MetaSkeletonBar,
  MetaSkeletonChip,
  PodiumSkeleton,
} from '@/components/premium/HeaderMetaSkeleton';

const meta: Meta = {
  title: 'Premium/HeaderMetaSkeleton',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[720px] space-y-6 bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const PrizeBarPlaceholders: Story = {
  render: () => (
    <div className="design-prize-bar">
      <section className="design-pb-pool">
        <p className="design-pb-label">Prize Pool</p>
        <MetaSkeletonBar width="68%" height="1.35rem" />
      </section>
      <section className="design-pb-aside">
        <p className="design-pb-rlabel">Resets in</p>
        <MetaSkeletonBar width="4.25rem" height="1.05rem" />
        <MetaSkeletonChip className="header-meta-skeleton--pill" />
      </section>
    </div>
  ),
};

export const CompactChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <MetaSkeletonChip />
      <MetaSkeletonChip />
      <MetaSkeletonChip className="header-meta-skeleton--pill" />
    </div>
  ),
};

export const Podium: Story = {
  render: () => <PodiumSkeleton label="Loading leaderboard..." />,
};
