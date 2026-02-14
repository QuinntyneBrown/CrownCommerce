import type { Meta, StoryObj } from '@storybook/angular';
import { TestimonialCardComponent } from './testimonial-card';

const meta: Meta<TestimonialCardComponent> = {
  title: 'Components/TestimonialCard',
  component: TestimonialCardComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 700px">${story().template ?? '<lib-testimonial-card [quote]="quote" [author]="author" [stars]="stars" />'}</div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<TestimonialCardComponent>;

export const Default: Story = {
  args: {
    quote:
      "I've tried every hair brand out there. Origin is different — the quality is unmatched, the texture is beautiful, and it literally lasts forever. I'm never going back.",
    author: 'Jasmine T., Toronto',
    stars: '\u2605 \u2605 \u2605 \u2605 \u2605',
  },
};

export const FourStars: Story = {
  args: {
    quote:
      'The bundles are incredibly soft and blend seamlessly with my natural hair. Customer service was wonderful too!',
    author: 'Aisha M., Mississauga',
    stars: '\u2605 \u2605 \u2605 \u2605 \u2606',
  },
};
