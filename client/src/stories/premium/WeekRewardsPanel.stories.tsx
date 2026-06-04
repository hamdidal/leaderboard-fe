import type { Meta, StoryObj } from '@storybook/react';
import { WeekRewardsPanel } from '@/components/premium/WeekRewardsPanel';
import { mockRewardsData } from '../fixtures';

const meta: Meta<typeof WeekRewardsPanel> = {
  title: 'Premium/WeekRewardsPanel',
  component: WeekRewardsPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] bg-background p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    data: mockRewardsData,
    highlightUserId: 'demo-user',
    defaultExpanded: true,
  },
};

export default meta;
type Story = StoryObj<typeof WeekRewardsPanel>;

export const Expanded: Story = {};

export const Collapsed: Story = {
  args: { defaultExpanded: false },
};
