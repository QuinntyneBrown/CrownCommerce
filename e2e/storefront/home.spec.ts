import { test, expect } from "../fixtures";

test.describe("Storefront Home", () => {
  test("should display the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CrownCommerce/);
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /shop/i })).toBeVisible();
  });
});
