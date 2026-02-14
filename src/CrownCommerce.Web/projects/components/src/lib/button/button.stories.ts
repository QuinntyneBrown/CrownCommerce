import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    showArrow: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [showArrow]="showArrow">SHOP NOW</lib-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    showArrow: false,
  },
};

export const PrimaryWithArrow: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    showArrow: true,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [showArrow]="showArrow">SHOP THE COLLECTION</lib-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    showArrow: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [showArrow]="showArrow">OUR STORY</lib-button>`,
  }),
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    showArrow: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [showArrow]="showArrow">SHOP NOW</lib-button>`,
  }),
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    showArrow: true,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [showArrow]="showArrow">SHOP THE COLLECTION</lib-button>`,
  }),
};
