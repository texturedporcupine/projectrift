# SF Bay Area — Shared Postcard Direct Mail Business Toolkit

Complete toolkit for launching a shared postcard direct mail advertising business in the San Francisco Bay Area using USPS Every Door Direct Mail (EDDM). Adapted from the proven Austin TX playbook.

## What's in This Toolkit

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **CURSOR_CONTEXT.md** | `./CURSOR_CONTEXT.md` | AI context file — drop into Cursor for on-demand generation |
| **Communities Guide** | `./communities/` | Profiles for 12 Bay Area target communities with demographics, EDDM logistics, and recommended ad categories |
| **Pitch Deck Generator** | `./pitch_deck/` | Node.js + pptxgenjs 5-slide pitch deck for any target community |
| **3-Email Outreach** | `./outreach/` | Cold opener, day-3 follow-up, day-7 value-add email templates |
| **Prospect Tracker** | `./prospect_tracker/` | Python/pandas Excel workbook generator with category tracking and outreach status |
| **Pitch Scripts (x10)** | `./pitch_scripts/` | Category-specific sales scripts for HVAC, pest control, dentist, pool, landscaping, plumbing, roofing, pediatric dentist, med spa, house cleaning |
| **Objection Handler** | `./pitch_scripts/00_universal_objection_handler.md` | Market-neutral objection responses |
| **EatTheElephant** | `./eat_the_elephant/` | React task tracker app with 50 launch tasks, energy filtering, and streak tracking |
| **Cowork Ops Prompt** | `./ops/` | Claude operations prompt for generating emails, proposals, agreements, and reports |
| **CA Business Plan** | `./legal/ca_business_plan.md` | California-adapted business plan with legal, tax, and financial sections |
| **Service Agreement** | `./legal/service_agreement_template.md` | California-jurisdiction service agreement template |
| **Creative Brief** | `./templates/creative_brief_template.md` | Postcard design brief with EDDM specs and layout guide |

## Quick Start

### Generate a Pitch Deck

```bash
cd pitch_deck
npm install
node generate_deck.js --community danville      # Single community
node generate_deck.js --all                      # All communities
```

Available communities: `danville`, `sanramon`, `pleasanton`, `losgatos`, `dublin`

### Generate a Prospect Tracker

```bash
cd prospect_tracker
pip install pandas openpyxl
python generate_tracker.py --community danville              # Single community
python generate_tracker.py --community danville sanramon     # Multiple
python generate_tracker.py --all --output ./trackers/        # All communities
```

### Launch the Task Tracker

Open `eat_the_elephant/index.html` in a browser. Progress is saved to localStorage.

## Pricing Tiers

| Tier | Communities | Standard Ad | Premium |
|------|-------------|-------------|---------|
| Tier 1 — Premium | Palo Alto, Los Altos, Saratoga, Piedmont | $700–900 | $1,100–1,400 |
| Tier 2 — Strong | Danville, San Ramon, Pleasanton, Los Gatos | $550–750 | $850–1,100 |
| Tier 3 — Growth | Fremont, Dublin, Livermore, Brentwood | $400–600 | $650–850 |

## Recommended Build Order

1. Read the **Communities Guide** — it's the foundation everything else references
2. Generate the **Pitch Deck** for your first target community (Danville recommended)
3. Customize the **3-Email Outreach Sequence** and start prospecting
4. Clone the **Prospect Tracker** for your first community
5. Review the **Pitch Scripts** for your target categories
6. Use the **EatTheElephant** tracker to manage your launch progress
7. Adapt the **Cowork Ops Prompt** for ongoing document generation

## Key EDDM Facts

- Postage: $0.247/piece, paid at DDU drop-off
- Postcard size: 8.5" × 11" or 6.5" × 9" (EDDM flat requirements)
- Paper: 14pt cardstock minimum
- No mailing list needed — USPS delivers to every household on selected carrier routes
- Start at [eddm.usps.com](https://eddm.usps.com) to select routes

## California Legal Requirements

- File FBN (Fictitious Business Name) with county recorder
- Publish FBN in local newspaper for 4 consecutive weeks
- Get local business license ($50–200/year)
- LLC optional but carries $800/year minimum CA franchise tax
- See `legal/ca_business_plan.md` for full details
