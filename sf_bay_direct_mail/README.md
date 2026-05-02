# SF Bay Area Shared Postcard Direct Mail — Toolkit

Adapted from the Austin TX playbook for the SF Bay Area. Everything below
lives in this folder; each artifact is either a ready-to-edit document or a
small Python generator you can re-run when copy/pricing changes.

## What's Here

```
sf_bay_direct_mail/
├── CURSOR_CONTEXT.md                 # Drop into Cursor as project context
├── README.md                         # This file
├── docs/
│   ├── Bay_Area_Communities_Direct_Mail_Guide.docx
│   └── California_Direct_Mail_Business_Plan.docx
├── deck/
│   └── pitch-deck_bay-area_<YYYY-MM>.pptx
├── trackers/
│   ├── prospect-tracker_danville-94526.xlsx
│   └── prospect-tracker_san-ramon-94582-94583.xlsx
├── emails/
│   ├── outreach_template_email1_cold.md
│   ├── outreach_template_email2_day3.md
│   └── outreach_template_email3_day7.md
├── scripts/
│   ├── _universal_objection_handler.md
│   ├── pitch_hvac.md
│   ├── pitch_pest-control.md
│   ├── pitch_general-dentistry.md
│   ├── pitch_pediatric-dentistry.md
│   ├── pitch_pool-service.md
│   ├── pitch_landscaping.md
│   ├── pitch_plumbing.md
│   ├── pitch_roofing.md
│   ├── pitch_house-cleaning.md
│   └── pitch_med-spa.md
├── agreements/
│   ├── agreement_template_california.docx
│   └── creative-brief_template.docx
├── cowork/
│   └── Cowork_Instructions.md
├── app/
│   └── EatTheElephant.jsx            # React task tracker (50 launch tasks)
└── build/
    ├── build_all.py                  # Runs every generator
    ├── generate_communities_guide.py
    ├── generate_business_plan.py
    ├── generate_pitch_deck.py
    ├── generate_trackers.py
    ├── generate_agreement.py
    ├── generate_creative_brief.py
    └── generate_pitch_scripts.py
```

## How to Build / Rebuild Artifacts

```bash
pip install python-pptx python-docx openpyxl
python sf_bay_direct_mail/build/build_all.py
```

Each individual generator is also runnable on its own (e.g. when only the
pricing or community list changes):

```bash
python sf_bay_direct_mail/build/generate_pitch_deck.py
```

## Recommended Build Order (matches the source brief)

1. **Communities Guide** — foundation everything else references.
2. **Pitch Deck** — visual sell sheet for first meetings.
3. **Email sequence** — start prospecting while the rest is being adapted.
4. **Prospect Tracker** for first community (Danville recommended).
5. **10 pitch scripts** — one per business category.
6. **EatTheElephant app + Cowork prompt** — operational layer; lower urgency.

## What Needed to Change vs. the Austin Build (and what didn't)

### Changed
- **Legal/tax:** California — file FBN with the **county recorder** (not
  clerk), 4-week newspaper publication, $800/year LLC franchise tax, no
  statewide business license.
- **Pricing:** uplifted 20–40% (Tier 1 $700–$900 / Tier 2 $550–$750 / Tier 3
  $400–$600).
- **Communities:** Danville, San Ramon, Pleasanton, Los Gatos, Saratoga,
  Los Altos Hills, Palo Alto south, Dublin, Fremont (Warm Springs),
  Livermore, Brentwood, Rocklin/Roseville.
- **EatTheElephant tasks s3–s5:** zip codes updated to 94526 / 94582 /
  94583 / 94566 / 94588.
- **EatTheElephant task p3:** pricing updated to Bay Area tiers.
- **Cowork prompt:** community list, pricing tiers, zip codes, CA legal notes.

### Unchanged (market-neutral)
- Core business model and category exclusivity.
- USPS EDDM workflow and `$0.247/piece` postage rate.
- Postcard specs (8.5" × 11" or 6.5" × 9", 14pt cardstock).
- Sales process (3-email sequence + phone follow-up + in-person).
- Payment structure (50% / 50%).
- Universal objection handler.
- Tech stack (`python-pptx`, `python-docx`, `openpyxl`, React).
- Creative brief template.

## Cursor Context

`CURSOR_CONTEXT.md` is the drop-in project context for Cursor / Claude Code
sessions. Open it once per project and the assistant has the entire business
model, pricing tiers, communities, file conventions, and CA legal notes.
