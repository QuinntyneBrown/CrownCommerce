import type { Meta, StoryObj } from '@storybook/angular';
import { SocialIconsComponent } from './social-icons';

const meta: Meta<SocialIconsComponent> = {
  title: 'Components/SocialIcons',
  component: SocialIconsComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SocialIconsComponent>;

export const Default: Story = {
  args: {
    links: [
      { platform: 'instagram', href: 'https://instagram.com/originhair' },
      { platform: 'tiktok', href: 'https://tiktok.com/@originhair' },
      { platform: 'email', href: 'mailto:hello@originhair.ca' },
    ],
  },
};

export const SingleIcon: Story = {
  args: {
    links: [{ platform: 'instagram', href: 'https://instagram.com/originhair' }],
  },
};
