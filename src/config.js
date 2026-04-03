const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
};

export default config;
```

**File 2:** `src/.env` — create this at the **project root** (same level as `package.json`), not inside `src/`:

`.env` (at root):
```
VITE_API_BASE_URL=http://localhost:8000