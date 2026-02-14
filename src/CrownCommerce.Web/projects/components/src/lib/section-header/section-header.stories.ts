import type { Meta, StoryObj } from '@storybook/angular';
import { SectionHeaderComponent } from './section-header';

const meta: Meta<SectionHeaderComponent> = {
  title: 'Components/SectionHeader',
  component: SectionHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    heading: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SectionHeaderComponent>;

export const Collection: Story = {
  args: {
    label: 'THE COLLECTION',
    heading: 'Premium Hair, Curated For You',
  },
};

export const WhyOrigin: Story = {
  args: {
    label: 'WHY ORIGIN',
    heading: 'The Origin Difference',
  },
};

export const Community: Story = {
  args: {
    label: 'JOIN THE COLLECTIVE',
    heading: 'Follow the Journey',
  },
};
