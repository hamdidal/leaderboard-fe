import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JumpToMeButton } from '@/components/premium/JumpToMeButton';

const meta: Meta<typeof JumpToMeButton> = {
  title: 'Premium/JumpToMeButton',
  component: JumpToMeButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof JumpToMeButton>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
