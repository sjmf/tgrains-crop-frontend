# Testing

There are two layers of tests, and lint. All three run in GitHub Actions on every pull request
(`.github/workflows/test.yml`), and a push to `main` only builds and publishes the Docker image
once they pass (`docker-build.yml` calls the test workflow first).

```bash
npm install
npm run lint:check      # ESLint, no autofix (npm run lint fixes)
npm test                # unit and component tests (Vitest)
npm run test:e2e        # end-to-end tests (Playwright); first run: npx playwright install chromium
npm run test:all        # all of the above
```

## Unit and component tests: `tests/unit/`

[Vitest](https://vitest.dev) with [@vue/test-utils](https://test-utils.vuejs.org) in jsdom,
configured in the `test` block of `vite.config.js`.

| Spec | Covers |
|---|---|
| `store/helpers.spec.js` | Percentage differences, area sums, distance from BAU, people fed, IDs |
| `store/mutations.spec.js` | History entries and auto-tagging, tag activation, form values, landscape id |
| `services/http.spec.js` | Celery task polling, error-message parsing, request shapes (axios mocked) |
| `components/VariableRow.spec.js` | Sliders emit `change` **while dragging**, v-model, colours, read-only |
| `components/DataTable.spec.js` | Number abbreviation, signs, colours, units |
| `components/CommentCard.spec.js` | User HTML in comments renders as text, never markup |
| `router.spec.js` | Redirects, tab routes, ethics, the 404 catch-all |
| `charts.spec.js` | The radial-log scale maths and the shared bar-chart options |

`npm run test:watch` re-runs on save; `npm run test:coverage` writes an HTML report to `coverage/`.
Coverage only counts unit tests; the UI flows are covered by the e2e suite.

## End-to-end tests: `tests/e2e/`

[Playwright](https://playwright.dev) drives Chromium against the production build
(`vite build` + `vite preview` on port 4173, started by `playwright.config.js`).
**No backend is needed**: `support.js` answers every `/api/**` request from the JSON fixtures in
`tests/e2e/fixtures/`. Strings and model runs come back as already-finished Celery tasks, because
Playwright can't intercept the request a browser makes when following the real API's 303 redirect;
the redirect and status polling are unit-tested in `tests/unit/services/http.spec.js` instead.
Any request to an unmocked route fails the test, and so does any console error or uncaught page
error. The preview server runs with `--mode e2e`, which turns off its `/api` proxy, so a request
the mocks miss can't quietly reach a backend you happen to have running locally.

| Spec | Covers |
|---|---|
| `smoke.spec.js` | Every tab on both landscapes renders its charts; history, ethics, 404, redirects |
| `sliders.spec.js` | Live updates **mid-drag**, Submit sends the value, area-exceeded blocks Submit, Reset |
| `history.spec.js` | Runs are recorded, auto-tagged and POSTed; loading and deleting/restoring states |
| `comments.spec.js` | Listing, posting (with `session_id`), escaping, validation, filtering |
| `visits.spec.js` | Welcome terms, returning visitors, switching land area, version-hash reset |

Useful options: `npx playwright test --ui` (interactive), `--headed`, `-g "slider"` to filter.
On failure, CI uploads the HTML report, traces and screenshots as the `playwright-report` artifact.

### Re-recording fixtures

The fixtures are real API responses. Re-record them when the API or the model changes:

```bash
# In crop-model, with gunicorn's port 5000 published on 8000:
docker compose -f docker-compose-build.yml up -d redis mariadb celery gunicorn
# Then here:
node tests/e2e/fixtures/record.mjs            # or: node tests/e2e/fixtures/record.mjs http://host:port
```

Model results are stochastic, so the numbers change between recordings but the shapes don't.
The tests assert on behaviour and structure, not on specific model outputs.
`comments-101.json` is a comment list captured from a local database, with the author anonymised.
