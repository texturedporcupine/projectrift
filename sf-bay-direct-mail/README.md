# SF Bay Area — Shared Postcard Direct Mail Toolkit

This folder implements the **April 2026 project brief** (Bay Area adaptation of the Austin playbook). It lives alongside Project Rift; it does not change the API or HUD.

## Contents

| Path | Purpose |
|------|---------|
| `CURSOR_CONTEXT.md` | Paste into Cursor or use as project context |
| `Cowork_Instructions.md` | Ops prompt for AI-generated emails, proposals, agreements |
| `docs/BAY_AREA_COMMUNITIES_GUIDE.md` | Community table + profiles (Danville, San Ramon, Pleasanton, Dublin, Los Gatos) |
| `docs/CA_BUSINESS_PLAN_LEGAL.md` | California legal/tax section (replaces TX 1.1–1.4) |
| `templates/` | Outreach sequence, pitch scripts, service agreement, creative brief |
| `eat-the-elephant/index.html` | React task tracker (`window.storage` → `localStorage`); open in browser |
| `scripts/build_trackers.py` | Builds Excel prospect trackers |
| `pitch-deck/` | Node + pptxgenjs 5-slide deck generator |

## Build steps

### Prospect trackers (Excel)

```bash
pip install openpyxl pandas
python sf-bay-direct-mail/scripts/build_trackers.py
```

Outputs under `sf-bay-direct-mail/trackers/`.

### Pitch deck (.pptx)

```bash
cd sf-bay-direct-mail/pitch-deck && npm install && npm run build
```

Writes `pitch-deck_Bay-Area_2026-05.pptx` in `pitch-deck/`.

### QA (optional)

```bash
soffice --headless --convert-to pdf pitch-deck_Bay-Area_2026-05.pptx
pdftoppm -jpeg -r 150 pitch-deck_Bay-Area_2026-05.pdf deck-page
```

## Recommended build order (from brief)

1. Communities guide (done in `docs/`)
2. Pitch deck
3. 3-email sequence
4. Prospect trackers
5. Pitch scripts
6. EatTheElephant + Cowork prompt
