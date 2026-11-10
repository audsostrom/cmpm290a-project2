import { expect, test, type Page } from '@playwright/test';

const log = (page: Page) => page.getByTestId('event-log');

test('A (control): no tray progress', async ({ page }) => {
  await page.goto('/?variant=A&paused=1');
  await expect(page.getByTestId('tray-jules.rivera')).toBeVisible();
  await page.getByTestId('tray-kofi.k').click();
  await expect(page.getByTestId('viewer-username')).toHaveText('kofi.k');
  await expect(page.getByTestId('tray-progress')).toHaveCount(0);
  // Exposure is still logged in control (counterfactual).
  await expect(log(page)).toContainText('"variant":"A","session_id":"sess_001","unseen_accounts_at_open":11');
});

test('B: "N of 11" follows the account on screen; ads and skips follow the plan rules', async ({ page }) => {
  await page.goto('/?variant=B&paused=1');
  await page.getByTestId('tray-kofi.k').click();
  const progress = page.getByTestId('tray-progress');
  await expect(progress).toHaveText('4 of 11');

  await page.keyboard.press('Shift+ArrowRight'); // skip to the next account
  await expect(page.getByTestId('viewer-username')).toHaveText('lune.studio');
  await expect(progress).toHaveText('5 of 11');

  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Shift+ArrowRight'); // pato → ad after every 3 accounts
  await expect(page.getByTestId('viewer-username')).toHaveText('Ferncrest Outfitters');
  await expect(progress).toHaveText('6 of 11'); // ads don't count; position is kept

  await page.keyboard.press('Shift+ArrowRight');
  await expect(progress).toHaveText('7 of 11');
});

test('tapping through stories advances within an account, then to the next', async ({ page }) => {
  await page.goto('/?variant=B&paused=1');
  await page.getByTestId('tray-kofi.k').click(); // 2 stories
  const viewer = page.getByTestId('viewer');
  const box = (await viewer.boundingBox())!;
  const tapRight = () => page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);
  await tapRight();
  await expect(page.getByText('new PR')).toBeVisible();
  await tapRight();
  await expect(page.getByTestId('viewer-username')).toHaveText('lune.studio');
});

test('opening stories from a feed post is not a tray session: no exposure, no label', async ({ page }) => {
  await page.goto('/?variant=B&paused=1');
  await page.getByTestId('post-avatar-lune.studio').click();
  await expect(page.getByTestId('viewer-username')).toHaveText('lune.studio');
  await expect(page.getByTestId('tray-progress')).toHaveCount(0);
  await expect(log(page)).not.toContainText('story_progress_exposure');
});

test('closing a session records the primary metric', async ({ page }) => {
  await page.goto('/?variant=B&paused=1');
  await page.getByTestId('tray-jules.rivera').click();
  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('viewer')).toHaveCount(0);
  await expect(page.getByTestId('metric-accounts')).toHaveText('2.0');
  await expect(log(page)).toContainText('tray_session_end');
});

test('clean mode hides the console for recordings', async ({ page }) => {
  await page.goto('/?variant=B&clean=1');
  await expect(page.getByTestId('phone')).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Experiment console' })).toHaveCount(0);
});

test('stories auto-advance after 5 seconds, and holding pauses', async ({ page }) => {
  await page.goto('/?variant=B');
  await page.getByTestId('tray-kofi.k').click();
  await expect(page.getByText('10k before coffee')).toBeVisible();
  await expect(page.getByText('new PR')).toBeVisible({ timeout: 7_000 });

  // Hold (press without releasing) pauses the story.
  const box = (await page.getByTestId('viewer').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(6_000);
  await expect(page.getByText('new PR')).toBeVisible();
  await page.mouse.up();
});
