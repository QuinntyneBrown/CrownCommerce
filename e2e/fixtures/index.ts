import { test as base, type Page } from "@playwright/test";

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  // Fixture for future authenticated test flows
  authenticatedPage: async ({ page }, use) => {
    // Login via API to set auth cookie
    await page.request.post("/api/identity/auth", {
      data: {
        action: "login",
        email: "admin@crowncommerce.com",
        password: "password123",
      },
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";
