import type { Meta, StoryObj } from '@storybook/angular';
import { EmailSignupComponent } from './email-signup';

const meta: Meta<EmailSignupComponent> = {
  title: 'Components/EmailSignup',
  component: EmailSignupComponent,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    buttonText: { control: 'text' },
  },
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 520px; background: #0b0a08; padding: 40px;">${story().template ?? `<lib-email-signup [placeholder]="placeholder" [buttonText]="buttonText" />`}</div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<EmailSignupComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your email address',
    buttonText: 'GET NOTIFIED',
  },
};

export const Subscribe: Story = {
  args: {
    placeholder: 'Your email',
    buttonText: 'SUBSCRIBE',
  },
};
