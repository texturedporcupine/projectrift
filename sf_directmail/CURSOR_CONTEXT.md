# SF Bay Area Shared Postcard Direct Mail Business

## What This Is

A direct mail advertising business. I sell exclusive ad space to local businesses on a shared postcard, then use USPS EDDM to deliver to 5,000-8,000 households in a target community. One business per category per postcard (one HVAC company, one dentist, etc.). I handle design, printing coordination, and EDDM delivery logistics.

## Business Model

- Sell 6-8 ad spaces per campaign at $500-900 each (Bay Area Tier 2 pricing)
- Cost per campaign: ~$350 printing + ~$1,400 EDDM postage + misc = ~$1,800
- Target net profit: $1,500-4,000 per campaign
- Payment terms: 50% deposit at signing, 50% before printing

## Pricing Tiers

| Tier | Communities | Standard Ad | Premium Placement |
|------|-------------|-------------|-------------------|
| Tier 1 – Premium | Palo Alto, Los Altos, Saratoga, Piedmont | $700-900 | $1,100-1,400 |
| Tier 2 – Strong | Danville, San Ramon, Pleasanton, Los Gatos | $550-750 | $850-1,100 |
| Tier 3 – Growth | Fremont, Dublin, Livermore, Brentwood | $400-600 | $650-850 |

## Primary Target Communities (start here)

- **Danville, CA (94526)** — Tier 1, $185K+ HHI, strong HOA, golf community
- **San Ramon, CA (94582/94583)** — Tier 2, $160K+ HHI, master-planned, tech families
- **Pleasanton, CA (94566)** — Tier 2, $155K+ HHI, established suburbs, high homeownership

## Postcard Specs (USPS EDDM Requirements)

- Size: 8.5" x 11" or 6.5" x 9" (must be a flat: >6.125" tall OR >10.5" long)
- Paper: 14pt cardstock minimum (0.007" thick)
- EDDM indicia in upper-right of address side
- Postage: $0.247/piece, paid at DDU drop-off

## Key Business Categories (target one per category per postcard)

HVAC, pest control, general dentistry, pediatric dentistry, pool service, landscaping, plumbing, roofing, house cleaning, med spa/aesthetics

## California Legal Notes

- File FBN (Fictitious Business Name) with **county recorder** (not clerk)
- Publish FBN in local newspaper 4 consecutive weeks within 30 days of filing; renew every 5 years
- LLC requires $800/year minimum CA franchise tax (first year may be waived if formed in Q4)
- Check city business license requirement (~$50–200/year)
- Advertising services generally not taxable; printed materials may be — check CDTFA (cdtfa.ca.gov)
- No statewide CA business license; local city/county license required

## Existing Assets (all Bay Area-adapted)

1. `communities/bay_area_communities_guide.md` — community profiles for 5 priority neighborhoods
2. `pitch_deck/generate_pitch_deck.js` — pptxgenjs script → pitch-deck_[community]_[date].pptx
3. `outreach/` — 3-email sequences (cold, day-3 follow-up, day-7 value-add) per category
4. `prospect_trackers/` — Excel prospect tracker templates per community (openpyxl)
5. `pitch_scripts/` — 10 category-specific pitch scripts with Bay Area business hooks
6. `legal/service_agreement_ca.md` — California-adapted service agreement
7. `app/EatTheElephant.jsx` — React task tracker with Bay Area zip codes + pricing
8. `ops/cowork_instructions.md` — Claude Cowork ops prompt for on-demand materials generation

## Output File Conventions

- Emails: `outreach/outreach_[business-name]_email[1-3].md`
- Agreements: `legal/agreement_[business-name]_[community].md`
- Decks: `pitch_deck/pitch-deck_[community]_[date].pptx`
- Trackers: `prospect_trackers/prospect-tracker_[community]-[zip].xlsx`
- Reports: `prospect_trackers/campaign-report_[community]_[date].xlsx`

## Campaign Workflow

1. **Pick community** → use EDDM tool at eddm.usps.com, lock 2-3 carrier routes (5,000-7,000 HH)
2. **Build prospect list** → 30-40 businesses across 8-10 non-competing categories
3. **Outreach** → 3-email sequence + phone follow-up + in-person for high-value prospects
4. **Sell 6-8 slots** → collect 50% deposit, sign service agreement
5. **Design & proof** → get approval from every advertiser
6. **Print** → collect final 50%, place print order (~$350 for 5,000-7,000 postcards)
7. **EDDM delivery** → bundle by carrier route, drop at DDU, pay $0.247/piece
8. **Follow-up** → 2 weeks post-delivery; collect testimonials; pitch renewal at 15-20% discount
