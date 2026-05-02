# CURSOR_CONTEXT.md

Drop this block into Cursor as your project context.

## Project: SF Bay Area Shared Postcard Direct Mail Business

### What This Is

A direct mail advertising business. I sell exclusive ad space to local
businesses on a shared postcard, then use USPS EDDM to deliver to 5,000-8,000
households in a target community. One business per category per postcard (one
HVAC company, one dentist, etc.). I handle design, printing coordination, and
EDDM delivery logistics.

### Business Model

- Sell 6-8 ad spaces per campaign at $500-900 each (Bay Area Tier 2 pricing)
- Cost per campaign: ~$350 printing + ~$1,400 EDDM postage + misc = ~$1,800
- Target net profit: $1,500-4,000 per campaign
- Payment terms: 50% deposit at signing, 50% before printing

### Primary Target Communities (start here)

- **Danville, CA** (94526) — Tier 1, $185K+ HHI, strong HOA, golf community
- **San Ramon, CA** (94582 / 94583) — Tier 2, $160K+ HHI, master-planned, tech families
- **Pleasanton, CA** (94566) — Tier 2, $155K+ HHI, established suburbs, high homeownership

### Postcard Specs (USPS EDDM Requirements)

- Size: 8.5" x 11" or 6.5" x 9" (must be a flat: >6.125" tall OR >10.5" long)
- Paper: 14pt cardstock minimum (0.007" thick)
- EDDM indicia in upper-right of address side
- Postage: $0.247/piece, paid at DDU drop-off

### Key Business Categories (target one per category per postcard)

HVAC, pest control, general dentistry, pediatric dentistry, pool service,
landscaping, plumbing, roofing, house cleaning, med spa/aesthetics.

### California Legal Notes

- File **FBN (Fictitious Business Name)** with **county recorder** (not clerk)
- Publish FBN in local newspaper 4 weeks within 30 days of filing
- LLC requires **$800/year minimum CA franchise tax**
- Check city business license requirement (~$50-200/year)
- Advertising services generally not taxable; **printed materials may be**
  (check CDTFA at cdtfa.ca.gov)

### Existing Assets (from Austin TX build — adapted for Bay Area)

1. 5-slide pitch deck (`deck/build_deck.py` or `deck/build-deck.js`) — Bay Area data
2. Category pitch scripts for 10 business types — `scripts/`
3. 3-email outreach sequence (cold, day-3 follow-up, day-7 value-add) — `emails/`
4. Excel prospect tracker template (pandas/openpyxl-compatible) — `prospects/`
5. React task tracker app (`EatTheElephant.jsx`) — Bay Area zip codes & pricing
6. Service agreement template (`templates/service_agreement_ca.docx`)
7. Creative brief template (`templates/creative_brief.md`)

### Output File Conventions

- Emails: `outreach_[business-name]_email[1-3].md`
- Agreements: `agreement_[business-name]_[community].docx`
- Decks: `pitch-deck_[community]_[date].pptx`
- Trackers: `prospect-tracker_[community]-[zip].xlsx`
- Reports: `campaign-report_[community]_[date].xlsx`

### Workflow Quick Reference

1. **Pick a community** — start with Danville (94526) or San Ramon (94582/94583).
2. **Validate routes** at eddm.usps.com (filter HHI $100K+, HH size 2.5+).
3. **Build a 30-40 business prospect list** across 8-10 non-competing categories.
4. **Outreach** using the 3-email sequence + category-specific scripts.
5. **Sell exclusive category slots** at Bay Area pricing (50% deposit at signing).
6. **Design + proof + print** the 8.5x11 (or 6.5x9) postcard.
7. **Drop at DDU**, pay $0.247/piece, complete EDDM Facing Slips.
8. **Follow up** at 2 weeks; pitch renewal at 15-20% multi-campaign discount.

### Tech Stack Notes

- Deck: pptxgenjs (Node) **or** python-pptx (Python). Avoid fill transparency on
  dark backgrounds; use solid hex fills only.
- QA: pptx -> PDF via LibreOffice (`soffice`), then JPEG via
  `pdftoppm -jpeg -r 150` for visual inspection.
- Prospect tracker: `pandas.read_excel(..., sheet_name=None)` reads all tabs;
  one tab per community.
- Task app: React (JSX) with `window.storage` API for persistence (no
  localStorage).
- Email templates: Markdown.
