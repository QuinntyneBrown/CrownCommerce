import type { Meta, StoryObj } from '@storybook/angular';
import { DividerComponent } from './divider';

const meta: Meta<DividerComponent> = {
  title: 'Components/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'subtle'],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="width: 100%; padding: 20px">${story().template ?? '<lib-divider [variant]="variant" />'}</div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<DividerComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
  },
};
