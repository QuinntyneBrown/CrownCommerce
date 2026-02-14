import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    showDot: { control: 'boolean' },
    text: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: {
    text: 'NOW ACCEPTING PRE-ORDERS',
    showDot: true,
  },
};

export const WithoutDot: Story = {
  args: {
    text: 'NEW ARRIVAL',
    showDot: false,
  },
};
