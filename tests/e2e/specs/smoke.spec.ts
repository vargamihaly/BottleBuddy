import {expect, test} from '@playwright/test';

import {createTestUser, primeAuthState} from '../fixtures/auth';

test.describe('BottleBuddy smoke', () => {
  test('renders marketing landing page for guests', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bottle Buddy/i);
    await expect(page.getByRole('heading', { name: 'BottleBuddy' })).toBeVisible();
    await expect(page.getByText(/Share\. Return\. Recycle\./i)).toBeVisible();
  });

  test('bootstraps a newly created user session via API token', async ({page, request}) => {
    const user = await createTestUser(request);
    await primeAuthState(page, user.token);

    await page.goto('/');
    await expect(page.getByText(user.fullName)).toBeVisible();
    await expect(page.getByText(/Quick Actions/i)).toBeVisible();
  });
});
