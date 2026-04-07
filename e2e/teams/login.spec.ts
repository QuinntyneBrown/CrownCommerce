import { test, expect } from "../fixtures";

test.describe("Teams Login", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/login/);
  });
});
