# Playwright End-to-End Testing Integration

This guide explains how to add a repeatable Playwright setup to BottleBuddy so that we can run cross-browser UI tests locally and inside GitHub Actions without disrupting the existing backend/frontend deployment workflows.

## 1. Tooling Choice
- **Test runner**: [`@playwright/test`](https://playwright.dev/), because it already bundles the browser drivers, parallel execution, fixtures, HTML/video artifacts, and first-class GitHub Action support.
- **Assertion library**: the runner ships with built-in expect APIs, so no extra dependency is needed.
- **Auxiliary tooling**: [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test) to ensure the SPA preview server is live before the suite starts, and [`wait-on`](https://github.com/jeffbski/wait-on) when we need more granular control for multi-service startups.

## 2. Repository Layout
```
BottleBuddy/
├── frontend/
│   └── package.json          # add playwright + helper scripts here
├── docker/
│   └── docker-compose.yml    # already boots SQL + backend; reuse for e2e prep
└── tests/
    └── e2e/
        ├── playwright.config.ts
        ├── fixtures/
        │   └── auth.ts       # shared login helpers using REST APIs
        ├── specs/
        │   ├── auth.spec.ts
        │   └── pickup-flow.spec.ts
        └── utils/
            └── test-accounts.ts
```

Key decisions:
1. Keep test sources outside `frontend/src` to avoid polluting the Vite build.
2. Reuse the frontend `package.json` so a single `npm install` pulls both SPA and Playwright dependencies.
3. Encapsulate config + helpers under `tests/e2e` to make CI checkout + caching straightforward.

## 3. Local Development Flow
1. **Install dependencies**
   ```bash
   cd frontend
   npm install -D @playwright/test start-server-and-test wait-on
   npx playwright install --with-deps
   ```

2. **Add npm scripts** to `frontend/package.json`:
   ```json
   {
   "scripts": {
     "test:e2e": "playwright test",
     "test:e2e:ui": "playwright test --ui",
     "test:e2e:report": "playwright show-report",
      "preview:e2e": "npm run build && vite preview --host 0.0.0.0 --port 4173",
      "test:e2e:dev": "cross-env VITE_API_URL=http://localhost:5242 PLAYWRIGHT_API_URL=http://localhost:5242 start-server-and-test preview:e2e http://127.0.0.1:4173 test:e2e"
   }
  }
  ```
  - `preview:e2e` builds the SPA and runs it on `http://127.0.0.1:4173`, which keeps tests deterministic regardless of the dev server state.
  - If you prefer hitting the running dev server instead of a preview build, swap `preview:e2e` for `dev` and ensure the same host/port.

3. **Configuration hints** (`tests/e2e/playwright.config.ts`):
   ```ts
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e/specs',
     timeout: 90_000,
     expect: { timeout: 10_000 },
     fullyParallel: true,
     retries: process.env.CI ? 1 : 0,
     reporter: [['list'], ['html', { open: 'never' }]],
     use: {
       baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173',
       trace: 'retain-on-failure',
       video: 'retain-on-failure',
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
       { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
       { name: 'webkit', use: { ...devices['Desktop Safari'] } },
     ],
   });
   ```
   Pass API URLs, seeded account credentials, or feature flags through `PLAYWRIGHT_` environment variables so we do not leak secrets into source control.

4. **Test data strategy**
   - Use the backend REST API to create/delete fixtures via helper functions inside `tests/e2e/fixtures/auth.ts`.
   - For deterministic CI runs, prefer seeding via `docker compose -f docker/docker-compose.yml up -d` before launching the SPA and have cleanup scripts that drop the SQL database afterward (`docker compose down -v`).
   - A starter `specs/smoke.spec.ts` already exercises the public landing page and an authenticated dashboard bootstrapped through the API helpers.

## 4. GitHub Actions Integration
We keep deployment workflows manual, so the e2e suite should live in a **new** workflow that triggers on PRs and pushes to `main`. The workflow needs Node 20, Docker (for API + SQL), and Playwright browsers. Example: `.github/workflows/playwright-e2e.yml`.

```yaml
name: Playwright E2E

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'backend/**'
      - 'docker/**'
      - 'tests/e2e/**'
      - '.github/workflows/playwright-e2e.yml'
  pull_request:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'backend/**'
      - 'docker/**'
      - 'tests/e2e/**'
      - '.github/workflows/playwright-e2e.yml'

jobs:
  e2e:
    runs-on: ubuntu-latest
    services:
      sql:
        image: mcr.microsoft.com/mssql/server:2022-latest
        env:
          ACCEPT_EULA: Y
          SA_PASSWORD: YourStrong!Passw0rd123
        ports: ['1433:1433']
        options: >-
          --health-cmd "[/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd123 -Q 'SELECT 1']"
          --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4

      - name: Set up .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Restore backend
        run: dotnet restore
        working-directory: backend/src/BottleBuddy.Api

      - name: Run backend
        run: |
          dotnet run --no-restore --urls http://0.0.0.0:5242 &
          echo $! > backend-pid.txt
        working-directory: backend/src/BottleBuddy.Api
        env:
          ASPNETCORE_ENVIRONMENT: Development
          ASPNETCORE_URLS: http://0.0.0.0:5242
          ConnectionStrings__DefaultConnection: Server=localhost,1433;Database=bottlebuddy;User Id=sa;Password=YourStrong!Passw0rd123;TrustServerCertificate=True;MultipleActiveResultSets=true
          Jwt__Key: SuperSecretJwtKeyForTests

      - name: Set up Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend deps
        run: npm install
        working-directory: frontend

      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        working-directory: frontend

      - name: Build + preview frontend
        run: |
          npm run build
          npm run preview -- --host 0.0.0.0 --port 4173 &
          echo $! > preview-pid.txt
        working-directory: frontend
        env:
          VITE_API_URL: http://127.0.0.1:5242

      - name: Wait for frontend preview
        run: npx wait-on http://127.0.0.1:4173
        working-directory: frontend

      - name: Run Playwright tests
        env:
          PLAYWRIGHT_BASE_URL: http://127.0.0.1:4173
          PLAYWRIGHT_API_URL: http://127.0.0.1:5242
        run: npm run test:e2e
        working-directory: frontend

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report
```

Why a standalone workflow?
- Keeps manual Azure deploys untouched.
- Allows fast feedback on every PR before maintainers trigger production deploys.
- Easy to extend with nightly runs (add a `schedule` trigger) or additional matrices (e.g., `browser: [chromium, firefox]`).

## 5. Secret & Environment Management
- Store API base URLs, seeded account passwords, and OAuth test client IDs as repository secrets (`PLAYWRIGHT_API_URL`, `PLAYWRIGHT_TEST_USER`, etc.).
- Inject them via `env:` blocks inside the workflow and pass through to tests using `process.env`.
- For local development, create a `.env.playwright` file loaded by `dotenv/config` inside `playwright.config.ts`.

## 6. Next Steps
1. Land the folder + sample smoke spec (e.g., `auth.spec.ts` covering login). 
2. Wire the workflow and monitor the first few runs for flaky selectors; add `testId` attributes in the SPA where needed.
3. Gradually expand coverage with the scenario catalog already documented in `docs/README.md` and `docs/PLAYWRIGHT_INTEGRATION.md`.

This approach adds a clear, reproducible path to run Playwright locally and in CI while fitting in with our current Azure deployment strategy.
