# EatTheElephant — Bay Area Edition

A React (JSX) task tracker for the SF Bay Area shared postcard direct mail
launch. Encodes all 50 launch tasks across 5 phases (Setup → Prep & Pricing →
Outreach → Campaign Build → Ship & Renew) with per-task energy level, time
estimate, and notes. Tracks per-phase progress and a daily streak.

## Persistence

Uses `window.storage.get(key)` / `window.storage.set(key, value)` (NOT
`localStorage`) — same convention as the Austin build. If `window.storage`
is missing (e.g. running in a vanilla browser), an in-memory fallback is
used so the UI still works for development.

The host environment (e.g. Cowork, a desktop wrapper, or a Cursor-side host)
is expected to provide `window.storage`.

## Usage

```jsx
import { EatTheElephant } from "./EatTheElephant.jsx";

export default function App() {
  return <EatTheElephant />;
}
```

Tested with React 18+. No external CSS dependencies — all styling is inline
to keep the file standalone.

## Bay Area changes vs. Austin

The brief (`sf_directmail_cursor_brief.pdf`, section 4 → "EatTheElephant app")
calls for these specific edits and nothing else:

| Task ID | Field | Bay Area value |
|---|---|---|
| `s3` | Pull EDDM routes for ... | **Danville (94526)** |
| `s4` | Pull EDDM routes for ... | **San Ramon (94582 / 94583)** |
| `s5` | Pull EDDM routes for ... | **Dublin (94568)** |
| `p3` | Lock pricing | **Bay Area Tier 1-2 ($550-$900)** |

All other 46 tasks are market-neutral and unchanged.

## Filters & UI

- Click any phase card to filter tasks to that phase.
- Use the energy filter (`ALL / LOW / MED / HIGH`) to surface a task that
  matches your current energy level.
- Daily streak increments only on the first task you complete each day.
  A skipped day resets the streak.
