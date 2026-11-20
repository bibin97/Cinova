# CINOVA

Cinema. Reimagined.

Premium OTT streaming platform. This repository is the AI-editor project at `E:\my works\cinova`. It is independent from any other CINOVA folder on disk.

## Structure

```
cinova/
├── Client/    Customer-facing frontend (current phase)
├── docs/      Project notes
└── README.md
```

`Admin/` and `Server/` will be added in later phases. Backend work does not start until the customer and admin frontends are approved.

## Current status

**Phase 1 — Customer frontend foundation**

- React + Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios client (unused for live data until backend)
- Mock API services
- Theme tokens, layout shell, reusable primitives

Auth, payments, and streaming are **not** implemented. Catalog screens in the nav are route placeholders for Phase 2.

## Client

```bash
cd Client
npm install
npm run dev
```

App URL: `http://localhost:5173`
