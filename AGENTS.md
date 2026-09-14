# AGENTS.md

## Project Context

This is the Skills Map app repository. It features a React Vite frontend and an Express backend (`server.ts`) powered by Google Gemini AI (`@google/genai`).

Start with `README.md` for local setup and environment variables.

## Key Files

- `src/`: frontend application source.
- `src/api/skillsMapClient.js`: frontend client for data entities, auth, and AI integrations.
- `server.ts`: Express backend proxying Gemini AI requests and serving frontend.
- `vite.config.js`: Vite configuration and path aliases (`@/`).

## Working Notes

- Use `npm run dev` (`tsx server.ts`) to run backend and frontend together on port 3000.
- Gemini AI calls are handled through `/api/ai/invoke-llm` in `server.ts` with local offline fallbacks.
- Run `npm run build` and `npm run lint` for checks before completing changes.

