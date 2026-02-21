/*
 * Public API Surface of features
 */

// Intelligent Components
export { ProductGridComponent } from './lib/intelligent/product-grid/product-grid';
export { CartSummaryComponent } from './lib/intelligent/cart-summary/cart-summary';
export { NewsletterSignupComponent } from './lib/intelligent/newsletter-signup/newsletter-signup';
export { ChatContainerComponent } from './lib/intelligent/chat-container/chat-container';
export { InquiryFormComponent } from './lib/intelligent/inquiry-form/inquiry-form';
export { TestimonialsComponent } from './lib/intelligent/testimonials/testimonials';
export { FaqListComponent } from './lib/intelligent/faq-list/faq-list';

// Pages
export { ShopPage } from './lib/pages/shop/shop-page';
export { ProductDetailPage } from './lib/pages/product-detail/product-detail-page';
export { CartPage } from './lib/pages/cart/cart-page';
export { CheckoutPage } from './lib/pages/checkout/checkout-page';
export { FaqPage } from './lib/pages/faq/faq-page';
export { NotFoundPage } from './lib/pages/not-found/not-found-page';
export { ContactPage } from './lib/pages/contact/contact-page';
export { WholesalePage } from './lib/pages/wholesale/wholesale-page';
export { AmbassadorPage } from './lib/pages/ambassador/ambassador-page';
export { ContentPage, CONTENT_PAGE_SLUG } from './lib/pages/content-page/content-page';
export { HomePage } from './lib/pages/home/home-page';
export { OurStoryPage } from './lib/pages/our-story/our-story-page';
export { HairCareGuidePage } from './lib/pages/hair-care-guide/hair-care-guide-page';
export { ShippingInfoPage } from './lib/pages/shipping-info/shipping-info-page';
export { ReturnsPage } from './lib/pages/returns/returns-page';
export { BundlesPage } from './lib/pages/bundles/bundles-page';
export { ClosuresPage } from './lib/pages/closures/closures-page';
export { FrontalsPage } from './lib/pages/frontals/frontals-page';
export { BundleDealsPage } from './lib/pages/bundle-deals/bundle-deals-page';

// Injection Tokens & Configs
export { HOME_PAGE_CONFIG, type HomePageConfig } from './lib/pages/home/home-page.config';
