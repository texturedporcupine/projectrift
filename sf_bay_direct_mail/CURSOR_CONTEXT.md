## Project: SF Bay Area Shared Postcard Direct Mail Business

### What This Is
A direct mail advertising business. We sell exclusive ad space to local
businesses on a shared postcard, then use USPS EDDM to deliver to
5,000–8,000 households in a target Bay Area community. One business per
category per postcard (one HVAC company, one dentist, etc.). We handle
design, printing coordination, and EDDM delivery logistics.

### Business Model
- Sell 6–8 ad spaces per campaign at $500–$900 each (Bay Area Tier 2 pricing).
- Cost per campaign: ~$350 printing + ~$1,400 EDDM postage + ~$100 misc ≈ $1,850.
- Target net profit: $1,500–$4,000 per campaign.
- Payment terms: 50% deposit at signing, 50% before printing.

### Primary Target Communities (start here)
- **Danville, CA (94526)** — Tier 1, $185K+ HHI, strong HOA, golf community.
- **San Ramon, CA (94582 / 94583)** — Tier 1–2, $160K+ HHI, master-planned, tech families.
- **Pleasanton, CA (94566 / 94588)** — Tier 2, $155K+ HHI, established suburbs, high homeownership.

### Postcard Specs (USPS EDDM Requirements)
- **Size:** 8.5" × 11" or 6.5" × 9". Must qualify as a flat: > 6.125" tall OR > 10.5" long.
- **Paper:** 14pt cardstock minimum (≥ 0.007" thick).
- **EDDM indicia** in the upper-right of the address side.
- **Postage:** $0.247/piece, paid at the DDU drop-off.

### Key Business Categories (one per category per postcard)
HVAC, pest control, general dentistry, pediatric dentistry, pool service,
landscaping, plumbing, roofing, house cleaning, med spa / aesthetics.

### California Legal Notes
- File **FBN (Fictitious Business Name)** with the **county recorder** (not clerk).
- Publish FBN in an adjudicated local newspaper for **4 consecutive weeks within 30 days** of filing.
- LLC requires **$800/year** minimum CA franchise tax (FTB). First-year waiver may apply for Q4 formations.
- Check city business license requirement (~$50–$200/year).
- Advertising services are generally **not** taxable in CA, but printed materials sold to clients **may** be — confirm with CDTFA (cdtfa.ca.gov).

### Existing Assets (from Austin TX build — adapted here for Bay Area)
1. 5-slide pitch deck (`deck/pitch-deck_bay-area_2026-04.pptx`)
2. Category pitch scripts for 10 business types (`scripts/`)
3. 3-email outreach sequence (`emails/`)
4. Excel prospect trackers per community (`trackers/`)
5. React task tracker app — EatTheElephant (`app/EatTheElephant.jsx`)
6. CA service agreement template (`agreements/agreement_template_california.docx`)
7. Creative brief template (`agreements/creative-brief_template.docx`)

### Output File Conventions
- Emails: `outreach_[business-name]_email[1-3].md`
- Agreements: `agreement_[business-name]_[community].docx`
- Decks: `pitch-deck_[community]_[date].pptx`
- Trackers: `prospect-tracker_[community]-[zip].xlsx`
- Reports: `campaign-report_[community]_[date].xlsx`

### Tech Stack Notes
- Deck generation: Python `python-pptx` (Node `pptxgenjs` works too).
  Known quirk: avoid fill transparency on dark backgrounds — use solid hex fills only.
- QA workflow: `.pptx → .pdf` via LibreOffice (`soffice --headless --convert-to pdf`),
  then JPEG via `pdftoppm -jpeg -r 150` for visual inspection.
- Prospect tracker: `pandas.read_excel(..., sheet_name=None)` — one sheet per community.
- Task app: React (JSX) using a `window.storage` API for persistence (no localStorage).
- Email templates: plain Markdown.
