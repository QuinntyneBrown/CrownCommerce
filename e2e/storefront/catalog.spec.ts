import { test, expect } from "../fixtures";

test.describe("Storefront Catalog", () => {
  test("shop page should render product grid", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByText(/all products/i)).toBeVisible();
  });

  test("bundles page should render", async ({ page }) => {
    await page.goto("/bundles");
    await expect(page.getByText(/hair bundles/i)).toBeVisible();
  });

  test("closures page should render", async ({ page }) => {
    await page.goto("/closures");
    await expect(page.getByText(/lace closures/i)).toBeVisible();
  });

  test("frontals page should render", async ({ page }) => {
    await page.goto("/frontals");
    await expect(page.getByText(/lace frontals/i)).toBeVisible();
  });

  test("bundle deals page should render", async ({ page }) => {
    await page.goto("/bundle-deals");
    await expect(page).toHaveURL("/bundle-deals");
  });

  test("product detail should show 404 for missing product", async ({ page }) => {
    const response = await page.goto("/product/00000000-0000-0000-0000-000000000000");
    expect(response?.status()).toBe(404);
  });
});
