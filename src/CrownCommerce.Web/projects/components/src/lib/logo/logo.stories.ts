import type { Meta, StoryObj } from '@storybook/angular';
import { LogoComponent } from './logo';

const meta: Meta<LogoComponent> = {
  title: 'Components/Logo',
  component: LogoComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<LogoComponent>;

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};
