# AGENTS.md

This project is a **fully functional SaaS application** with a real database-backed architecture.

## Core Development Rules

- Treat this as a **production SaaS application**, not a prototype or static demo.
- All features, forms, lists, dashboards, filters, and actions must be **fully connected to the database**.
- **Do not use mock data, hardcoded sample data, fake API responses, or placeholder records** where real database data is expected.
- Implement proper **CRUD operations** and ensure that changes made through the UI are persisted to the database.
- Follow the existing project architecture, database schema, API patterns, authentication, and authorization mechanisms.

## Forms & Keyboard Navigation

- Forms should provide a smooth keyboard-friendly experience.
- Pressing **Enter** should move the user to the **next logical field** where appropriate.
- Avoid behavior where pressing Enter unexpectedly submits the entire form when the user is still entering data.
- For the final field or intentional submit action, Enter may submit the form normally.
- Ensure keyboard navigation does not interfere with textareas, dropdowns, searchable selects, or other components where Enter has a different intended purpose.

## Client Components

- Do **not** add `'use client'` to every page or component unnecessarily.
- Keep pages and components as **Server Components by default**.
- Use `'use client'` **only when required**, such as when a component needs:
  - React hooks (`useState`, `useEffect`, etc.)
  - Browser APIs
  - Client-side event handlers
  - Client-only libraries
  - Other functionality that cannot run on the server
- Prefer placing `'use client'` in **deeper, smaller components** rather than converting entire pages into Client Components.
- Keep the Client Component boundary as low as reasonably possible.

## Data Integrity

- Never hide missing backend functionality behind mock data.
- If a required backend/API/database operation does not exist, implement it properly or clearly identify the missing dependency instead of faking the result.
- Handle loading, empty, error, and success states properly.
- Validate user input on both the client and server where appropriate.
- Maintain consistency between the UI, API, and database.

## General Principle

**Build real, production-ready functionality. Do not simulate functionality just to make the UI appear complete.**
