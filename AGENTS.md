## High-level Intent

- **Single monorepo** for web, mobile, and backend.
- **Local dev is containerized & orchestrated by Tilt**. The `Makefile` is the only entrypoint for starting/stopping the dev stack. **Never call `docker compose` or `tilt` directly outside of the `Makefile` targets.**
- **Maximize code sharing**, especially:
  - Shared **UI components** across Web (Next.js) and Mobile (Expo/React Native) whenever feasible.
  - Shared **business logic, utilities, validation, and API clients**.
- **Deterministic dev environments** using **Nix + direnv**. The agent must respect this setup and avoid adding global/system dependencies that conflict with the flake.

---

## Supported Apps & Tech

- **Web**: Next.js 15 (Turbopack)
- **Mobile**: Expo (React Native), SDK 54+
- **Backend**: API container (reachable via `EXPO_PUBLIC_API_URL` in Mobile and `.env` in Web)
- **Package Manager**: pnpm workspaces
- **Env tooling**: Nix flakes + direnv
- **Tilt**: Orchestrates local Docker Compose + live reload

---

## Golden Rules (DOs & DON’Ts)

### DO
1. **Use the `Makefile` targets** to interact with the system:
   - `make up`, `make down`, `make logs`, `make trigger-web`, `make trigger-api`, `make mobile`, `make mobile-ios`, `make mobile-android`.
2. **Prefer shared code** over duplication:
   - Put cross-platform React components in `packages/ui` (see structure below).
   - Put headless logic (hooks, utils, domain) in `packages/shared`.
3. **Use environment variables**, not hardcoded URLs:
   - Mobile uses `EXPO_PUBLIC_API_URL` (set via `app.config.ts` + `.envrc`).
   - Web/API use their respective env files managed by Nix/direnv.
4. **Use platform-specific files when needed**:
   - `Component.web.tsx` for Web-only, `Component.native.tsx` for Mobile/Native.
   - Avoid divergent copies when a single universal implementation works.
5. **Keep dependencies minimal and safe**:
   - Add runtime deps only where they are used. If cross-app, place in a shared package.
   - Use `pnpm` workspaces correctly (no nested lockfiles for the same scope).

### DON’T
1. **Don’t modify or commit auto-generated artifacts**, e.g.:
   - `node_modules/`, `.expo/`, `.next/`, `dist/`, `build/`, `coverage/`, `.turbo/` (if present), temporary caches, PNPM store, Metro/Expo caches.
   - Lockfiles may be updated when truly required, but **never** check in platform-specific caches or generated files.
2. **Don’t bypass the Makefile/Tilt flow**:
   - Do **not** invoke `docker compose` directly.
   - Do **not** rewire Tilt unless asked.
3. **Don’t hardcode local IPs/hosts/ports**.
4. **Don’t upgrade SDKs/Node/Expo/Next without explicit instruction**.
5. **Don’t edit or remove placeholder assets/config that are required for Expo builds** without replacing them properly.

---

## Repository Structure (Authoritative)

```
apps/
  web/            # Next.js app
  mobile/         # Expo/React Native app
  api/            # Backend service (name may vary)

packages/
  ui/             # Cross-platform UI components
  shared/         # Headless logic, hooks, utils, schemas
  config/         # Shared config (eslint, prettier, tsconfig base, etc.)

dev/
  Tiltfile        # Tilt entrypoint used by Makefile

# Root configuration
pnpm-workspace.yaml
pnpm-lock.yaml
.envrc            # direnv entry, loads Nix and exports dev env vars
flake.nix         # Nix flake (dev shell, Node version, tools)
Makefile          # The ONLY public interface to run the stack locally
```

### UI Sharing Strategy

We aim to share **as much UI as possible** between Web and Mobile.

1. **Default to universal React Native primitives** in `packages/ui`:
   - Use `react-native` components (`View`, `Text`, etc.) for base primitives.
   - For Web, this flows through `react-native-web` (configured in `apps/web`).

2. **When platform-specific divergence is necessary**, use platform-specific files:
   - `Button.web.tsx` (DOM-specific code)
   - `Button.native.tsx` (mobile-specific or RN-only code)

3. **Styling**:
   - Prefer styling that works with both RN and Web (e.g., StyleSheet or inline style objects).
   - If using a design system or utility classes, ensure it compiles for both platforms (or provide adapters with `.web`/`.native`).

4. **Headless Logic** lives in `packages/shared`:
   - Hooks for data fetching, form state, validation, etc.
   - No DOM/RN imports here—just pure TS/JS so it’s 100% shareable.

### Example Layout

```
packages/ui/
  src/
    primitives/
      Box.tsx
      Text.tsx
    components/
      Button/
        Button.tsx           # ideally universal
        Button.web.tsx       # (only if divergence is needed)
        Button.native.tsx    # (only if divergence is needed)
    index.ts

packages/shared/
  src/
    hooks/
      useAuth.ts
      usePing.ts
    utils/
      fetcher.ts
      logger.ts
    schemas/
      user.ts
  index.ts
```

---

## Commit & PR Guidelines

- If a change affects onboarding or local dev, update `README.md` accordingly.
- If a change affects the AGENTS.md instructions, update this file accordingly.

