import {APIRequestContext, Page} from '@playwright/test';
import crypto from 'node:crypto';

import {requireSeededAccount, SeededAccount, SeededAccountRole} from '../utils/test-accounts';

interface AuthResponse {
  token: string;
}

type CreateUserOverrides = Partial<SeededAccount & { username: string }>;

interface TestUser extends SeededAccount {
  username: string;
  token: string;
}

const getApiBaseUrl = (): string => process.env.PLAYWRIGHT_API_URL ?? 'http://127.0.0.1:5242';

export const createTestUser = async (
  request: APIRequestContext,
  overrides?: CreateUserOverrides,
): Promise<TestUser> => {
  const suffix = crypto.randomBytes(4).toString('hex');
  const email = overrides?.email ?? `playwright+${suffix}@example.com`;
  const password = overrides?.password ?? `Pw!${suffix}9Aa`;
  const fullName = overrides?.fullName ?? `Playwright User ${suffix}`;
  const username = overrides?.username ?? `pw${suffix}`;

  const apiBaseUrl = getApiBaseUrl();
  const response = await request.post(`${apiBaseUrl}/api/auth/register`, {
    data: {
      email,
      password,
      fullName,
      username,
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to register test user: ${response.status()} - ${await response.text()}`);
  }

  const data = (await response.json()) as AuthResponse;

  return {
    email,
    password,
    fullName,
    username,
    token: data.token,
  };
};

export const loginViaApi = async (
  request: APIRequestContext,
  credentials: SeededAccount,
): Promise<string> => {
  const apiBaseUrl = getApiBaseUrl();
  const response = await request.post(`${apiBaseUrl}/api/auth/login`, {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${credentials.email}: ${response.status()} - ${await response.text()}`);
  }

  const data = (await response.json()) as AuthResponse;
  return data.token;
};

export const loginSeededAccount = (
  request: APIRequestContext,
  role: SeededAccountRole,
): Promise<string> => loginViaApi(request, requireSeededAccount(role));

export const primeAuthState = async (page: Page, token: string): Promise<void> => {
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('token', value);
  }, token);
};
