import { test, expect } from "../fixtures";

test.describe("Storefront Content", () => {
  test("FAQ page should render", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveURL("/faq");
  });

  test("contact page should render inquiry form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL("/contact");
  });

  test("dynamic content page should show 404 for missing slug", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-slug-12345");
    expect(response?.status()).toBe(404);
  });
});
