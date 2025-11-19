import { test, expect } from '@playwright/test';

test.describe('User Registration and Authentication', () => {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  const username = `testuser_${Date.now()}`;

  test('1.1 Successful User Registration', async ({ page }) => {
    await page.goto('/auth');

    // Click the "Register" button to switch to the registration form
    await page.getByRole('button', { name: 'Register' }).click();

    // Fill out the registration form
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Username').fill(username);

    // Click the final "Register" button to submit the form
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify that the user is redirected to the homepage
    await expect(page).toHaveURL('/');

    // Verify that the user is logged in
    await expect(page.getByText('Test User')).toBeVisible();
  });

  test('1.2 Successful User Login and Logout', async ({ page }) => {
    // Go to the authentication page
    await page.goto('/auth');

    // Fill in the login form
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify that the user is redirected to the homepage
    await expect(page).toHaveURL('/');

    // Verify that the user is logged in
    await expect(page.getByText('Test User')).toBeVisible();

    // Click on the user's name to open the dropdown and then log out
    await page.getByText('Test User').click();
    await page.getByText('Log out').click();

    // Verify that the user is redirected to the authentication page
    await expect(page).toHaveURL('/auth');
  });
});
