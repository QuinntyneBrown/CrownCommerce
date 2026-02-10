import type { Meta, StoryObj } from '@storybook/angular';
import { BenefitCardComponent } from './benefit-card';

const sparklesIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>`;

const heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

const usersIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const meta: Meta<BenefitCardComponent> = {
  title: 'Components/BenefitCard',
  component: BenefitCardComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px">${story().template ?? '<lib-benefit-card [iconSvg]="iconSvg" [title]="title" [description]="description" />'}</div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<BenefitCardComponent>;

export const EthicallySourced: Story = {
  args: {
    iconSvg: sparklesIcon,
    title: 'Ethically Sourced',
    description:
      '100% virgin human hair from trusted suppliers. No synthetics, no shortcuts. Every bundle meets our luxury standard.',
  },
};

export const BuiltForLongevity: Story = {
  args: {
    iconSvg: heartIcon,
    title: 'Built For Longevity',
    description:
      'Our hair lasts 12+ months with proper care. Minimal shedding, no tangling, and colour-safe. Invest once, slay all year.',
  },
};

export const CommunityFirst: Story = {
  args: {
    iconSvg: usersIcon,
    title: 'Community First',
    description:
      "More than a brand — we're a collective. Join a community of women who celebrate each other and uplift one another.",
  },
};
