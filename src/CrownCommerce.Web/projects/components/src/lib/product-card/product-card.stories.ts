import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCardComponent } from './product-card';

const meta: Meta<ProductCardComponent> = {
  title: 'Components/ProductCard',
  component: ProductCardComponent,
  tags: ['autodocs'],
  argTypes: {
    tagColor: {
      control: 'select',
      options: ['gold', 'rose'],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px">${story().template ?? '<lib-product-card [imageUrl]="imageUrl" [tag]="tag" [title]="title" [description]="description" [price]="price" [tagColor]="tagColor" />'}</div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductCardComponent>;

export const Bundles: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1672622934288-08b77766e7e3?w=600&q=80',
    tag: 'BESTSELLER',
    title: 'Virgin Hair Bundles',
    description:
      'Brazilian, Peruvian & Malaysian textures. Straight, body wave, deep wave & more. 12" to 30" lengths.',
    price: 'From $85 CAD',
    tagColor: 'gold',
  },
};

export const Closures: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1768219778067-40d9edc03c5d?w=600&q=80',
    tag: 'ESSENTIAL',
    title: 'Lace Closures',
    description:
      'HD lace closures for a seamless, natural look. 4x4 and 5x5 options in every texture.',
    price: 'From $65 CAD',
    tagColor: 'rose',
  },
};

export const Frontals: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1560564066-a3a5cfc81584?w=600&q=80',
    tag: 'PREMIUM',
    title: 'Lace Frontals',
    description:
      '13x4 and 13x6 HD lace frontals for full hairline coverage. Pre-plucked with bleached knots.',
    price: 'From $95 CAD',
    tagColor: 'gold',
  },
};
