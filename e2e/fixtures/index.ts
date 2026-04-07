import { test as base } from "@playwright/test";

export const test = base.extend({
  // Custom fixtures will be added here
});

export { expect } from "@playwright/test";
