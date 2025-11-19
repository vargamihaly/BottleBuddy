export type SeededAccountRole = 'owner' | 'volunteer';

export interface SeededAccount {
  email: string;
  password: string;
  fullName?: string;
}

const buildSeededAccount = (role: SeededAccountRole): SeededAccount | undefined => {
  const upper = role.toUpperCase();
  const email = process.env[`PLAYWRIGHT_${upper}_EMAIL`];
  const password = process.env[`PLAYWRIGHT_${upper}_PASSWORD`];

  if (!email || !password) {
    return undefined;
  }

  return {
    email,
    password,
    fullName: process.env[`PLAYWRIGHT_${upper}_FULL_NAME`] ?? undefined,
  };
};

export const seededAccounts: Record<SeededAccountRole, SeededAccount | undefined> = {
  owner: buildSeededAccount('owner'),
  volunteer: buildSeededAccount('volunteer'),
};

export const hasSeededAccount = (role: SeededAccountRole): boolean => Boolean(seededAccounts[role]);

export const requireSeededAccount = (role: SeededAccountRole): SeededAccount => {
  const account = seededAccounts[role];
  if (!account) {
    throw new Error(
      `Missing seeded credentials for ${role}. ` +
        `Set PLAYWRIGHT_${role.toUpperCase()}_EMAIL and PLAYWRIGHT_${role.toUpperCase()}_PASSWORD before running the suite.`,
    );
  }
  return account;
};
