import { test, expect } from '@playwright/test';
import { ChatContainerPOM } from '../page-objects/components/chat-container.component';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('ChatContainer (feat-chat-container)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
    await page.goto('/');
  });

  test('opens chat panel when FAB is clicked', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await expect(chat.fab).toBeVisible();
    await chat.open();
    expect(await chat.isOpen()).toBe(true);
    await expect(chat.headerTitle).toBeVisible();
  });

  test('closes chat panel', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.close();
    expect(await chat.isOpen()).toBe(false);
  });

  test('displays chat header with title and subtitle', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await expect(chat.headerTitle).toBeVisible();
    await expect(chat.headerSubtitle).toBeVisible();
  });

  test('sends a message and it appears in the thread', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.sendMessage('What products do you have?');
    await expect(chat.visitorBubbles.last()).toContainText('What products do you have?');
  });

  test('input field clears after sending a message', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.sendMessage('Hello');
    expect(await chat.getInputValue()).toBe('');
  });

  test('can send message with Enter key', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.sendMessageWithEnter('Test message');
    await expect(chat.visitorBubbles.last()).toContainText('Test message');
  });
});
