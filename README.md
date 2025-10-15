# HeimdallVaults

This repository contains the **entire HeimdallVaults stack** as a monorepo:

- 🖥️ **Backend:** .NET 8 (C#)  
- 🌐 **Web UI:** Next.js (React 19)  
- 📱 **Mobile App:** Expo (React Native)  
- ⚙️ **Dev Environment:** Nix + Direnv + Docker Compose + Tilt

Everything is designed to **“just work”** out of the box — no global Node, .NET, or Docker setup needed beyond Nix and Direnv.

---

## ⚙️ Prerequisites

Before doing anything else, install the following:

### 🧩 1. Nix
Nix provides a fully reproducible development environment.

**Install Nix (macOS/Linux):**

```bash
sh <(curl -L https://nixos.org/nix/install)
```

➡️ **Official docs:**  
🔗 [https://nixos.org/download.html](https://nixos.org/download.html)

After installing, restart your terminal and verify:

```bash
nix --version
```

---

### 🧰 2. Direnv
Direnv automatically loads and unloads environment variables when you enter or leave the project directory — including the Nix shell.

**Install Direnv (macOS via Homebrew):**
```bash
brew install direnv
```

**Install Direnv (Linux):**
```bash
curl -sfL https://direnv.net/install.sh | bash
```

➡️ **Official docs:**  
🔗 [https://direnv.net](https://direnv.net)

---

### ⚡ 3. Enable Direnv for Zsh
To make Direnv work automatically in every terminal session, add this line to your **~/.zshrc**:

```bash
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```

Then reload your shell:

```bash
source ~/.zshrc
```

To confirm it’s active:

```bash
direnv status
```

You should see something like:
```
Found RC path .../.envrc
Found RC allowed 1
```

---

### 🐳 4. Docker and Docker Compose
Install **Docker Desktop** (macOS) or the **Docker Engine** (Linux).  
Make sure both `docker` and `docker compose` work:

```bash
docker --version
docker compose version
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone git@github.com:your-org/HeimdallVaults.git
   cd HeimdallVaults
   ```

2. **Allow Direnv**
   ```bash
   direnv allow
   ```

3. **Confirm Nix dev environment loaded**
   ```
   ✅ Loaded Nix dev environment
   ```

4. **Verify core tools**
   ```bash
   node -v
   pnpm -v
   dotnet --version
   tilt version
   ```

---

## 🧰 Common Development Commands

All development commands are wrapped by the `Makefile` for convenience.

| Command | Description |
|----------|-------------|
| `make up` | 🚀 Start full dev environment (Tilt + Docker Compose + live reload) |
| `make down` | 🛑 Stop all Tilt resources |
| `make logs` | 📜 Stream logs from running containers |
| `make restart` | 🔁 Restart all Tilt resources |
| `make trigger-api` | ♻️ Rebuild only the backend service |
| `make trigger-web` | ♻️ Rebuild only the web frontend |
| `make clean` | 🧹 Clean up Docker images, volumes, and orphans |
| `make mobile` | 📱 Start the Expo mobile app |
| `make mobile-ios` | 🍎 Launch iOS simulator |
| `make mobile-android` | 🤖 Launch Android emulator |

---

## 📱 Running the Mobile App (Expo)

The mobile app can run in three ways:

### Option 1 — iOS Simulator
```bash
make mobile-ios
```

### Option 2 — Android Emulator
```bash
make mobile-android
```

### Option 3 — Physical Device (Expo Go)
```bash
make mobile
```
Then scan the QR code from the **Expo Go** app on your phone.

The app automatically connects to your local backend using an environment variable exported by Direnv — no manual IP configuration needed.

---

## 🧩 Troubleshooting

| Problem | Solution |
|----------|-----------|
| **Direnv not loading** | Run `direnv reload` |
| **No “✅ Loaded Nix dev environment” message** | Ensure `.envrc` contains `use flake ./dev` and you ran `direnv allow` |
| **Tilt says no Tiltfile** | Run `tilt up -f dev/Tiltfile` |
| **Expo app shows “Backend says: error”** | Ensure the API binds to `0.0.0.0` and port `5050` is exposed in `compose.yml` |
| **Stuck ports or old containers** | Run `make clean` |

---

## 🧪 Development Flow

Typical workflow:

1. `make up` → Start backend and web in Tilt  
2. Develop — live reload is automatic  
3. `make mobile` → Run Expo mobile app  
4. `make down` → Stop when finished  

Everything runs inside a reproducible Nix environment — no global tooling required.

---

## 📁 Project Layout

```
apps/
  api/        → .NET backend
  web/        → Next.js web frontend
  mobile/     → Expo React Native app
dev/
  flake.nix   → Nix development environment
  Tiltfile    → Tilt orchestration
infra/
  compose.yml → Docker Compose setup
packages/
  (shared UI + libraries, coming soon)
```

---

## ✅ Quickstart Summary

```bash
# First-time setup
brew install direnv
sh <(curl -L https://nixos.org/nix/install)
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc && source ~/.zshrc

# Clone + bootstrap
git clone git@github.com:your-org/HeimdallVaults.git
cd HeimdallVaults
direnv allow

# Start everything
make up
make mobile
```

You’ll now have **web**, **backend**, and **mobile** all running live in sync — fully reproducible via Nix.
