# PROJECT RULES — STRICT, NO EXCEPTIONS
# (This file is local-only. It must never be committed, pushed, or referenced
# in .gitignore. It exists purely to guide the AI agent working in this project.)
 
## Scope discipline
- Only touch files/code directly required by the current task. Do not refactor,
  "clean up", rename, or reformat anything outside the task scope, even if it seems
  like an improvement.
- Do not change the existing project folder structure under any circumstance.
- Do not modify, rename, or delete README.md or any other documentation file.
- Do not create new files, folders, or components unless it is strictly impossible
  to complete the task without one. If a new file seems necessary, STOP and ask for
  permission in plain, simple language first — explain why, and wait for approval.
- No duplicate files, functions, or components. Before writing new code, check
  whether equivalent logic already exists in the project and reuse/extend it instead.
- Do not delete "unused" code, comments, or files on your own judgment — flag them
  and ask instead.
 
## Dependencies & config
- Never modify config files (package.json config sections, tsconfig, application.
  properties/yml, webpack/vite config, .env, build scripts, CI/CD files, .gitignore,
  etc.) unless explicitly told to.
- Never install, upgrade, or remove a package (npm/pip/maven/etc.) without asking
  first. State the exact package, version, and why it's needed, then wait for a yes.
- Never add a new library as a shortcut when the task can be done with what's
  already in the project.
 
## Version control
- Never run git commit, git push, or open/merge a PR without asking first and
  getting explicit confirmation.
- Do not touch .git internals, branches, or history directly.
- Never commit, push, reference, or expose this file (GEMINI.md) itself, and never
  add it to .gitignore — it must stay completely outside version control.
 
## Code quality
- No unused components, variables, imports, or dead code — if you create it, wire
  it up or remove it before finishing the task.
- Code must be optimized: avoid unnecessary re-renders, redundant DB calls, N+1
  queries, or duplicate logic. Prefer the simplest correct solution over a clever one.
- Match the existing code style, naming conventions, and folder conventions exactly
  — don't introduce a new pattern alongside an existing one.
 
## When in doubt
- If a task seems to require breaking any rule above (new file, new dependency,
  config change, folder restructure, commit/push), stop and ask in plain, simple
  terms before doing it. Never assume permission. Never take the more convenient
  path before doing it — you the image which is given by the developer.
 
## Post-task audit (run after every prompt/change, before saying "done")
 
Every single task — no matter how small — ends with this audit. Do not skip it.
 
### 1. Dead code & unused files
- Scan for any file, image, component, function, or CSS class that is no longer
  imported/referenced anywhere in the codebase.
- Flag them and ask before deleting — do not delete unused_but_uncertain code
  without confirmation, but ALWAYS flag it.
- No unused database tables or columns should remain — if a migration or task
  makes one obsolete, flag it explicitly rather than leaving it silently unused.
- No leftover mock/dummy/sample data anywhere in the codebase (seed files used
  for actual local dev setup are fine — placeholder data left over from
  prototyping is not).
 
### 2. Secrets & environment variables
- Scan the full codebase for hardcoded API keys, tokens, passwords, connection
  strings, or credentials of any kind.
- All secrets must live in environment variables (.env, loaded via process.env
  or the project's existing config loader) — never inline in source files.
- Confirm .env (and any local secret files) are actually excluded via
  .gitignore, and that no secret has ever been committed in git history.
- Confirm nothing sensitive (API secrets, internal service URLs, DB credentials)
  is ever shipped into frontend/client-side bundle — only public-safe values
  (e.g. a public API base URL) may reach the frontend.
- All image uploads go to the project's designated Cloudinary account, read
  from environment variables (e.g. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET) — never hardcode the cloud name, key, or secret in
  source code.
- When a record referencing a Cloudinary image is deleted (product, vet,
  article, etc.), also remove the corresponding file from Cloudinary — don't
  leave orphaned files/folders behind.
 
### 3. Error handling & information leakage
- Review all error handling on every change. Users must never see: stack
  traces, internal file paths, raw database error messages, or any internal
  implementation detail.
- All user-facing errors return a generic, safe message (e.g. "Something went
  wrong. Please try again.") with an appropriate HTTP status code.
- Full error details (stack trace, query, context) are still logged
  server-side for debugging — logging is not reduced, only what reaches the
  client is.
 
### 4. Input validation
- Every endpoint that accepts user input validates it server-side (type,
  length, format, required fields) — never trust client-side validation alone.
- Reject invalid input with a clear, generic validation error — not a raw
  exception.
 
### 5. Dependency health
- Check for known vulnerabilities in dependencies (e.g. npm audit / equivalent)
  as part of the audit.
- Flag any vulnerable or outdated package and ask before upgrading — upgrades
  still follow the "ask before installing/upgrading a package" rule above.
 
### 6. Final check
- Confirm the change follows the correct, intended workflow (not a shortcut
  that happens to work).
- Confirm the result is clean and optimized: no duplicate logic, no dead code,
  no unused imports, no leftover console.log/debug statements.
- Summarize the audit findings briefly before marking the task complete —
  even if the audit found nothing, say so explicitly.
- Also run the Production-Readiness Review below, and include its result in
  this same summary — the post-task audit and the production-readiness review
  are both mandatory on every completed task, not just this checklist alone.
 
## No hardcoded, static, or mock data — ever
- No page, component, or feature may use hardcoded/static/mock data as a
  substitute for real data. Every piece of content that conceptually belongs
  in the database (products, vets, services, articles, appointments, orders,
  pets, users, prices, ratings, categories, etc.) MUST be fetched from the
  actual API/database — never typed directly into a component as a stand-in.
- This applies to every new page or feature going forward, not just what
  already exists. If a task would normally involve "just get it looking
  right first" with placeholder data, don't — wire it to the real endpoint
  from the start. If the needed endpoint doesn't exist yet, say so and ask
  before building the frontend against fake data as a temporary measure.
- Seed data used for local development/testing is fine, but only if it goes
  through the same real database and API path as production data would —
  never a separate hardcoded array living in frontend code "just for now."
- Image placeholders (ImagePlaceholder component) are the ONLY accepted
  exception, and only for actual image assets not yet supplied — never for
  text, prices, names, or other real content.
 
## Every interactive element must be functional
- Every button, link, form, toggle, filter, tab, and interactive element
  must be wired to real functionality — a real API call, a real navigation,
  a real state change backed by real data. No decorative buttons that look
  clickable but do nothing.
- If a feature shown in a design isn't actually built yet (e.g. wishlist,
  social login, live chat), do not wire it to fake/no-op functionality to
  make it "look done." Either build it properly (ask first, since it's new
  scope) or clearly disable/hide it until it's real. A button that appears
  functional but silently does nothing is worse than an honestly disabled one.
- Every action that changes data (add to cart, book, cancel, subscribe,
  submit, delete, etc.) must show a real success or error result to the
  user — never a silent no-op.
 
## Preserve the correct workflow
- Any fix, feature, or change must follow the actual intended business
  workflow already established in this project (e.g. in-store pickup, not
  shipping; soft delete, not hard delete; role-based access; ownership-
  scoped queries) — never take a shortcut that technically works but breaks
  the real-world flow the system is designed around.
- If a task seems to require deviating from an established workflow, stop
  and ask before proceeding — don't silently reinterpret the workflow to
  make the immediate task easier.
 
## Post-task audit — mandatory, every time
- After every single task, re-verify: no hardcoded/mock data was introduced
  or left behind, every new interactive element is genuinely functional and
  wired to the database, and the correct workflow was followed.
- This check happens in addition to, not instead of, the full post-task
  audit already defined earlier in this file (dead code, secrets, error
  handling, input validation, dependency health, cleanliness).
- Summarize the result of this check explicitly before marking any task
  complete — even a one-line "no hardcoded data, all buttons wired, workflow
  intact" confirmation is required, not assumed.
 
## Production-readiness review
For any task that touches business logic, an API endpoint, a data flow, or a
user-facing feature — and always as part of the post-task audit above, every
time a task is completed — perform this review explicitly.
 
### Review categories
1. **Backend connectivity** — confirm the frontend feature actually reaches
   the real backend endpoint (not a stub, not a hardcoded response), and that
   the endpoint actually persists to/reads from the real database.
2. **Security issues** — authentication enforced correctly, authorization
   (role + ownership) enforced on every relevant endpoint, no secrets
   exposed, no injection vectors (SQL injection, XSS) left open, passwords/
   tokens never logged.
3. **Performance problems** — N+1 queries, missing indexes, unnecessary
   re-fetches or re-renders, unbounded queries with no pagination, large
   payloads that should be paginated/filtered.
4. **Bad architecture** — logic in the wrong layer (e.g. business logic in a
   controller instead of a service), tight coupling that should be
   decoupled, violations of the project's existing established patterns.
5. **Duplicated logic** — the same validation, calculation, or API call
   implemented more than once instead of shared/reused.
6. **Edge cases** — empty states, zero/negative values, boundary values,
   concurrent requests (e.g. double-booking, overselling stock), expired
   tokens, race conditions.
7. **Invalid input** — malformed requests, missing required fields, wrong
   types, oversized payloads — all rejected cleanly, never causing a crash
   or a leaked error.
8. **Errors** — every failure path returns the standardized error shape,
   never a raw exception; every failure path is actually reachable/testable,
   not just assumed to "probably work."
9. **Authentication** — token issuance, expiry, refresh, and rejection of
   invalid/expired/missing tokens all verified, not assumed.
10. **API/database failures** — what happens if the database is
    unreachable, a query times out, or an external service (Cloudinary,
    email, maps) fails — the user must see a generic error state, not a
    crash or a hang.
11. **Happy path** — confirm the intended normal flow actually works
    end-to-end, not just that individual pieces look correct in isolation.
12. **Loading states/animations** — every async action has an appropriate
    loading indicator; nothing appears frozen or gives no feedback during a
    real network request.
13. **Business logic correctness** — the actual rule (in-store pickup, soft
    delete, stock locking, unique appointment slots, RBAC scoping, etc.) is
    implemented correctly and matches the real-world workflow, not a
    simplified approximation of it.
 
### For every issue found
- State the **root cause** — not just what's broken, but why it happens
  (e.g. "missing @Transactional annotation means the stock check and
  decrement aren't atomic, so concurrent requests can both pass the check
  before either commits").
- Explain **how you will fix it** before making the change, in plain terms.
- Do not silently patch something you find mid-task without flagging it —
  report it, explain root cause and fix, and confirm before proceeding if
  the fix is non-trivial or touches something outside the current task scope.
 
### Reporting
- Present findings as a structured list grouped by the categories above, not
  a flat wall of text — so issues can be prioritized (security and data-
  integrity issues first, then correctness, then performance, then polish).
- Never claim something is "production ready" without having explicitly
  gone through this checklist for the feature/area in question.