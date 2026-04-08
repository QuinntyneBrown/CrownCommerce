import { test, expect } from "../fixtures";

test.describe("Storefront Auth", () => {
  test("login page should render sign in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("register page should render sign up form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("account page should redirect when not authenticated", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/login/);
  });

  test("order history should redirect when not authenticated", async ({ page }) => {
    await page.goto("/account/orders");
    await expect(page).toHaveURL(/login/);
  });
});
