# synaplan-org-website

**The public, German-first website at [www.synaplan.eu](https://www.synaplan.eu)** — written for public administration, government bodies, and institutional stakeholders who need to understand how [Synaplan](https://www.synaplan.com) enables the **digitally sovereign** use of AI, and how we treat open source software.

> **Domain:** The canonical host is **`www.synaplan.eu`**. The legacy **`synaplan.org`** domain (and any `*.synaplan.org` host) 301-redirects here, and any non-`www` `*.synaplan.eu` host (incl. the apex `synaplan.eu`) is canonicalised to `www.synaplan.eu`.

> **Status:** Early scaffolding. This README defines the purpose and the intended architecture. The application code (Next.js app, content, translations, Docker build) is being built out step by step.

---

## Why a separate site?

[`www.synaplan.com`](https://www.synaplan.com) is the product/marketing site (features, pricing, demo, blog). `www.synaplan.eu` (this repo; `synaplan.org` redirects to it) is intentionally different:

- **Audience:** public administration, ministries, agencies, and other public-sector institutions.
- **Topic:** digital sovereignty, data protection, open source, and how Synaplan integrates into the European open source ecosystem (Nextcloud, OpenCloud, **openDesk**).
- **Tone:** factual, evidence-based, and policy-aware — not a sales pitch.
- **Language:** **German-first.** The source content is authored in German, but the site ships in **German, English, and French**.

For the product itself, see:

- **Product & demo:** [www.synaplan.com](https://www.synaplan.com)
- **Technical documentation:** [docs.synaplan.com](https://docs.synaplan.com)
- **Source code:** the open source Synaplan platform (GitHub, Open CoDE / opencode.de)

---

## The message in one sentence

> The open source software Synaplan enables public administration to use AI in a digitally sovereign way and to integrate it into openDesk.

### Digital sovereignty: the five risks Synaplan addresses

ZenDiS (Zentrum für Digitale Souveränität) describes, in its publication *"Kriterien zur Bewertung von Digitaler Souveränität"* ([discussion paper, PDF](https://www.zendis.de/media/pages/newsroom/publikationen/konsultationsprozesskriterien/a59222d144-1774439296/zendis_diskussionspapier-kriterien-bewertung-digitaler-souveraenitaet.pdf)), the following risks of using non-European cloud and AI services. Using the open source software Synaplan, these risks can be substantially mitigated **without giving up technical innovation**.

**Risk 1 — Data-protection uncertainty from extraterritorial legal access to data**

- Synaplan can be run **on-premises** and with **local models**, so full data protection for personal data is guaranteed.
- All chat data and documents remain **stored and protected inside the Synaplan instance**.
- For non-sensitive data, the current LLM services of global and national providers can be used via the API interface.

**Risk 2 — Limited information security due to lack of control over code and data**

- The open source software Synaplan is available on **public repositories (GitHub, Open CoDE)**.
- Synaplan has been **reviewed by security experts** for use with data that has a high protection requirement.

**Risk 3 — Inflexibility from missing exit options and technological lock-in**

- Switching LLM models is **configurable at any time**, and different models can be selected for different tasks.
- When models are switched, **all chat data, memories, and documents remain** in the Synaplan instance.

**Risk 4 — Uncontrollable costs from rising license fees for cloud-based SaaS models**

- Synaplan lets you configure **local LLM models (your own GPU servers)** as well as **API access** to the large language models, depending on the task — so the right model can be chosen for each task to achieve the optimal balance of cost and quality.
- Synaplan includes **cost monitoring** that enables reporting and the definition of an upper spending limit.

**Risk 5 — Externally driven innovation through dependence on the proprietary development cycles of global vendors**

- Synaplan is part of the **European open source ecosystem** and integrates with other open source products (**Nextcloud, OpenCloud, openDesk**).

---

## Architecture (mirrors `synaplan-website`)

By design, this repo follows the same layout, build, and publication model as the main [`synaplan-website`](https://www.synaplan.com) repo, so both sites are operated the same way and ship as a **single, "ready-to-run" Docker package**.

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| React | 19 with Server Components |
| Styling | Tailwind CSS v4 + shadcn/ui v4 (Base UI) |
| Animations | Framer Motion |
| i18n | `next-intl` — **DE (default), EN, FR** |
| Testing | Vitest |
| Container | Docker + Docker Compose |

### Internationalization (trilingual)

- **Default locale: German** (`de`) — German-first content, authored as the source of truth.
- English (`en`) and French (`fr`) are full translations.
- Translation files live in `src/messages/` (`de.json`, `en.json`, `fr.json`).
- Routing via `next-intl` with `[locale]` segments and `proxy.ts` (Next.js 16 uses `proxy.ts`, **not** `middleware.ts`).
- **Always keep all three locale files in sync** when adding or changing UI text.

### Planned structure

```
src/
├── app/[locale]/         # i18n pages (de | en | fr)
├── components/
│   ├── layout/           # Header, Footer, LanguageSwitcher
│   ├── sections/         # Page sections (hero, sovereignty risks, ecosystem, …)
│   ├── ui/               # shadcn/ui components
│   └── icons.tsx
├── i18n/                 # routing, request, navigation
├── lib/                  # utils, constants (external links, etc.)
└── messages/             # de.json, en.json, fr.json
```

Unlike `synaplan-website`, this is a **content/informational site**: it has no blog CMS, admin panel, or database. The pages are static (SSG), which keeps the Docker image small and the deployment simple.

---

## Local development

```bash
npm install
npm run dev
```

Open:

- **http://localhost:3000** — German (default, no prefix)
- **http://localhost:3000/en** — English
- **http://localhost:3000/fr** — French

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Production server (after build) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |

---

## Deployment

Like `synaplan-website`, this site is shipped as a **finished Docker image** and published at **www.synaplan.eu**.

- **Build & publish:** GitHub Actions builds the image on every push to `main` (and on `v*` tags) and pushes it to GHCR as `ghcr.io/metadist/synaplan-org-website:latest`.
- **Run:** the server pulls the pre-built image via Docker Compose (`docker-compose.prod.yml`). No build happens on the server.
- **Host:** the same server that already runs `ch1.synaplan.com` as Docker; `www.synaplan.eu` is published there as an additional containerized site (reverse-proxied, app listening on `127.0.0.1:<port>`).
- **Domains:** point both `synaplan.eu` (apex + `www`) and `synaplan.org` at this origin. The app handles canonicalisation: `*.synaplan.org` → `www.synaplan.eu`, and any non-`www` `*.synaplan.eu` (incl. apex) → `www.synaplan.eu`.

```bash
# On the server
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Conventions

- TypeScript strict mode; Server Components by default, `"use client"` only when needed.
- All user-facing text goes through `next-intl` translation files — **never hardcode strings**, and always update **all three** locales (`de`, `en`, `fr`).
- Responsive, mobile-first.
- Conventional Commits (`feat:`, `fix:`, `docs:`, …). **No** AI/tool attribution in commit messages.

---

## License

See [`LICENSE`](./LICENSE).
