import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-testimonial-card',
  template: `
    <article class="testimonial-card">
      <span class="testimonial-card__quote-icon">&ldquo;</span>
      <blockquote class="testimonial-card__quote">{{ quote() }}</blockquote>
      <div class="testimonial-card__author">
        <span class="testimonial-card__stars">{{ stars() }}</span>
        <span class="testimonial-card__name">&mdash; {{ author() }}</span>
      </div>
    </article>
  `,
  styles: `
    .testimonial-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 48px 64px;
      border-radius: 20px;
      background: #161412;
      border: 1px solid rgba(201, 160, 82, 0.082);
      width: 100%;
      box-sizing: border-box;
    }

    .testimonial-card__quote-icon {
      font-family: 'Fraunces', serif;
      font-size: 80px;
      line-height: 0.5;
      color: rgba(201, 160, 82, 0.19);
    }

    .testimonial-card__quote {
      font-family: 'DM Sans', sans-serif;
      font-size: 20px;
      font-style: italic;
      line-height: 1.6;
      color: #faf7f0;
      text-align: center;
      margin: 0;
    }

    .testimonial-card__author {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .testimonial-card__stars {
      font-family: 'DM Sans', sans-serif;
      font-size: 18px;
      color: #c9a052;
    }

    .testimonial-card__name {
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #9a9590;
    }

    @media (max-width: 768px) {
      .testimonial-card {
        gap: 20px;
        padding: 32px;
      }

      .testimonial-card__quote-icon {
        font-size: 64px;
      }

      .testimonial-card__quote {
        font-size: 16px;
      }

      .testimonial-card__stars {
        font-size: 14px;
      }

      .testimonial-card__name {
        font-size: 13px;
      }
    }
  `,
})
export class TestimonialCardComponent {
  quote = input.required<string>();
  author = input.required<string>();
  stars = input('\u2605 \u2605 \u2605 \u2605 \u2605');
}
