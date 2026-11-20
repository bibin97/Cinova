# Customer frontend foundation

## Boundaries

- Workspace: `E:\my works\cinova` only.
- `E:\my works\Cinova-Ott` is a separate manual project and must never be modified from this workstream.

## Architecture

Pages render inside `PublicLayout`. They read mock services (`src/services/mockApi.js`), not the Axios instance, until the backend exists.

Redux currently holds:

- `auth` — empty session placeholder
- `ui` — mobile navigation

Theme tokens live in `Client/src/styles/index.css` (`background`, `surface`, `gold`, `foreground`, `muted`, `line`).

The logo is a replaceable React component (`components/common/Logo.jsx`), not a baked-in raster.
