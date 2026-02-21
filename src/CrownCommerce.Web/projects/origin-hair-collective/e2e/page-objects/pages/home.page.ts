import { type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { MobileNavComponent } from '../components/mobile-nav.component';
import {
  HeroSectionPOM,
  TrustBarSectionPOM,
  BrandStorySectionPOM,
  ProductsSectionPOM,
  BenefitsSectionPOM,
  TestimonialsSectionPOM,
  CommunitySectionPOM,
  FinalCtaSectionPOM,
  ChatContainerPOM,
} from '../../../../../e2e-shared/page-objects';
import { setupApiMocks } from '../../fixtures/api-mocks';

export class HomePage {
  // App-specific
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly mobileNav: MobileNavComponent;

  // Shared features
  readonly hero: HeroSectionPOM;
  readonly trustBar: TrustBarSectionPOM;
  readonly brandStory: BrandStorySectionPOM;
  readonly products: ProductsSectionPOM;
  readonly benefits: BenefitsSectionPOM;
  readonly testimonials: TestimonialsSectionPOM;
  readonly community: CommunitySectionPOM;
  readonly finalCta: FinalCtaSectionPOM;
  readonly chatWidget: ChatContainerPOM;

  constructor(private page: Page) {
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.mobileNav = new MobileNavComponent(page);
    this.hero = new HeroSectionPOM(page);
    this.trustBar = new TrustBarSectionPOM(page);
    this.brandStory = new BrandStorySectionPOM(page);
    this.products = new ProductsSectionPOM(page);
    this.benefits = new BenefitsSectionPOM(page);
    this.testimonials = new TestimonialsSectionPOM(page);
    this.community = new CommunitySectionPOM(page);
    this.finalCta = new FinalCtaSectionPOM(page);
    this.chatWidget = new ChatContainerPOM(page);
  }

  async goto(): Promise<void> {
    await setupApiMocks(this.page);
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
