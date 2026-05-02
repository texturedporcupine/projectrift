# SF Bay Area Shared Postcard Direct Mail — Business Toolkit

A complete business toolkit for running a shared postcard direct mail advertising business targeting affluent Bay Area communities using USPS Every Door Direct Mail (EDDM).

## Business Model

Sell exclusive ad spaces (one business per category) on a professionally designed postcard. Handle design, printing, and EDDM delivery to 5,000–8,000 households per campaign. Revenue: $2,500–5,000 per campaign at 45–65% margins.

## Directory Structure

```
sf_bayarea_directmail/
├── README.md                    ← You are here
├── Cowork_Instructions.md       ← AI assistant operations prompt
│
├── docs/
│   ├── BayArea_Communities_DirectMail_Guide.md  ← Community profiles (12 communities)
│   └── CA_Business_Plan.md                      ← Full business plan (CA legal/tax)
│
├── emails/
│   ├── outreach_email1_cold_opener.md     ← Email 1: cold opener template
│   ├── outreach_email2_day3_followup.md   ← Email 2: day-3 follow-up
│   └── outreach_email3_day7_valueadd.md   ← Email 3: day-7 final touch
│
├── pitch_scripts/
│   ├── 00_universal_objection_handler.md  ← Works across all categories
│   ├── 01_hvac.md
│   ├── 02_pest_control.md
│   ├── 03_general_dentistry.md
│   ├── 04_pool_service.md
│   ├── 05_landscaping.md
│   ├── 06_plumbing.md
│   ├── 07_roofing.md
│   ├── 08_pediatric_dentistry.md
│   ├── 09_med_spa.md
│   └── 10_house_cleaning.md
│
├── templates/
│   ├── service_agreement_california.md    ← CA-jurisdiction service agreement
│   └── creative_brief_template.md         ← Campaign creative brief template
│
├── scripts/
│   ├── generate_pitch_deck.js      ← Node.js pitch deck generator (pptxgenjs)
│   ├── generate_prospect_tracker.py ← Python prospect tracker generator (pandas)
│   ├── package.json                 ← Node.js dependencies
│   └── requirements.txt            ← Python dependencies
│
└── app/
    ├── index.html              ← EatTheElephant entry point
    └── EatTheElephant.jsx      ← React launch task tracker (50 tasks, 6 phases)
```

## Quick Start

### 1. Generate a Pitch Deck

```bash
cd scripts
npm install
node generate_pitch_deck.js danville      # Danville deck
node generate_pitch_deck.js san_ramon     # San Ramon deck
node generate_pitch_deck.js pleasanton    # Pleasanton deck
node generate_pitch_deck.js dublin        # Dublin deck
node generate_pitch_deck.js los_gatos     # Los Gatos deck
```

Output: `pitch-deck_[community]_[date].pptx`

### 2. Generate a Prospect Tracker

```bash
cd scripts
pip install -r requirements.txt
python generate_prospect_tracker.py danville     # Danville tracker
python generate_prospect_tracker.py san_ramon    # San Ramon tracker
python generate_prospect_tracker.py all          # All communities
```

Output: `prospect-tracker_[community]-[zip].xlsx`

### 3. Launch the Task Tracker

Open `app/index.html` in a browser. The EatTheElephant app tracks all 50 launch tasks across 6 phases with energy-level filtering and streak tracking. Progress persists in localStorage.

### 4. Customize Outreach

1. Read the community profile in `docs/BayArea_Communities_DirectMail_Guide.md`
2. Copy the email templates from `emails/` and fill in the placeholders
3. Use the matching pitch script from `pitch_scripts/` for phone follow-ups
4. Generate a service agreement from `templates/service_agreement_california.md`

## Pricing Reference

| Tier | Communities | Standard Ad | Premium Placement |
|------|-----------|-------------|-------------------|
| Tier 1 — Premium | Danville, Los Gatos, Saratoga, Los Altos, Palo Alto | $700–900 | $1,100–1,400 |
| Tier 2 — Strong | San Ramon, Pleasanton, Dublin | $550–750 | $850–1,100 |
| Tier 3 — Growth | Fremont, Livermore, Brentwood, Rocklin/Roseville | $400–600 | $650–850 |

## File Naming Conventions

| Type | Pattern |
|------|---------|
| Emails | `outreach_[business-name]_email[1-3].md` |
| Agreements | `agreement_[business-name]_[community].md` |
| Decks | `pitch-deck_[community]_[date].pptx` |
| Trackers | `prospect-tracker_[community]-[zip].xlsx` |
| Reports | `campaign-report_[community]_[date].md` |
