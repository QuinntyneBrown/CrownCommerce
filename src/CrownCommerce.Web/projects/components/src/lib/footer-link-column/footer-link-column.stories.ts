import type { Meta, StoryObj } from '@storybook/angular';
import { FooterLinkColumnComponent } from './footer-link-column';

const meta: Meta<FooterLinkColumnComponent> = {
  title: 'Components/FooterLinkColumn',
  component: FooterLinkColumnComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FooterLinkColumnComponent>;

export const Shop: Story = {
  args: {
    title: 'Shop',
    links: [
      { label: 'Bundles', href: '#' },
      { label: 'Closures', href: '#' },
      { label: 'Frontals', href: '#' },
      { label: 'Bundle Deals', href: '#' },
    ],
  },
};

export const Company: Story = {
  args: {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Wholesale', href: '#' },
      { label: 'Ambassador Program', href: '#' },
    ],
  },
};

export const Support: Story = {
  args: {
    title: 'Support',
    links: [
      { label: 'Hair Care Guide', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
};
