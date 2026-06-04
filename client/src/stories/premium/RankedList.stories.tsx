import type { Meta, StoryObj } from '@storybook/react';
import { RankedList } from '@/components/premium/RankedList';
import { top100Sample } from '../fixtures';

const meta: Meta<typeof RankedList> = {
  title: 'Premium/RankedList',
  component: RankedList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="top100-panel glass-panel w-full max-w-[480px] p-1">
        <Story />
      </div>
    ),
  ],
  args: {
    entries: top100Sample,
    poolTotal: 1_250_000,
    highlightUserId: 'demo-user',
    isLoading: false,
    isError: false,
    onRetry: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof RankedList>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true, entries: [] },
};

export const Error: Story = {
  args: { isError: true, entries: [] },
};

export const Empty: Story = {
  args: { entries: [] },
};
