# Cowork Operations Prompt — SF Bay Area Direct Mail

## Purpose

This document is an operations prompt for Claude Cowork (or any AI assistant). It enables on-demand generation of outreach emails, proposals, service agreements, creative briefs, and campaign reports for the SF Bay Area shared postcard direct mail business.

---

## Business Context

**Business:** Bay Area Direct Mail Co.
**Model:** Shared postcard direct mail via USPS EDDM. Sell exclusive ad spaces (one business per category) on a professionally designed postcard, delivered to 5,000–8,000 households in target Bay Area communities.

**Payment:** 50% deposit at signing, 50% before printing.

---

## Pricing Tiers (Bay Area)

| Tier | Communities | Standard Ad | Premium Placement |
|------|-----------|-------------|-------------------|
| Tier 1 — Premium | Danville (94526), Los Gatos (95030/32), Saratoga (95070), Los Altos (94022/24), Palo Alto south (94303) | $700–900 | $1,100–1,400 |
| Tier 2 — Strong | San Ramon (94582/83), Pleasanton (94566/88), Dublin (94568) | $550–750 | $850–1,100 |
| Tier 3 — Growth | Fremont/Warm Springs (94539), Livermore (94550/51), Brentwood (94513), Rocklin/Roseville (95765/77) | $400–600 | $650–850 |

---

## Community Quick Reference

| Community | Zip(s) | Median HHI | Households | Key Trait |
|-----------|--------|-----------|------------|-----------|
| Danville | 94526 | $185K+ | 18,000+ | Strong HOA culture, mail-reading community |
| San Ramon | 94582/83 | $160K+ | 30,000+ | Master-planned, tech families |
| Pleasanton | 94566/88 | $155K+ | 28,000+ | Family-first, strong schools |
| Dublin | 94568 | $145K+ | 22,000+ | Fastest-growing, new developments |
| Los Gatos | 95030/32 | $200K+ | 12,000+ | Affluent, upscale village feel |
| Saratoga | 95070 | $250K+ | 10,000+ | Ultra-premium, estate properties |
| Palo Alto (south) | 94303 | $210K+ | 12,000+ | Tech families, education-focused |
| Fremont (Warm Springs) | 94539 | $140K+ | 15,000+ | Newer construction, diverse |
| Livermore | 94550/51 | $125K+ | 20,000+ | Wine country + suburban |
| Brentwood | 94513 | $115K+ | 22,000+ | Master-planned, value-conscious |

---

## Output Workflows

### 1. Generate Outreach Email

**Prompt pattern:**
> "Write outreach email [1/2/3] for [BUSINESS NAME], a [CATEGORY] business, targeting [COMMUNITY] [ZIP]."

**Requirements:**
- Use the 3-email sequence structure (cold opener → day-3 follow-up → day-7 value-add)
- Include community-specific stats (HHI, households, homeownership)
- Reference the correct pricing tier
- Personalize with any provided business details (Google rating, years in business)
- Save as: `outreach_[business-name]_email[1-3].md`

### 2. Generate Proposal / Service Agreement

**Prompt pattern:**
> "Generate a service agreement for [BUSINESS NAME], [CATEGORY], [COMMUNITY], [PLACEMENT TYPE], at $[PRICE]."

**Requirements:**
- Use the California service agreement template
- Fill in: community, zip, category, pricing, payment schedule
- Include category exclusivity clause
- Set jurisdiction to California, [COUNTY] County
- Save as: `agreement_[business-name]_[community].md`

### 3. Generate Creative Brief

**Prompt pattern:**
> "Create a creative brief for the [COMMUNITY] campaign with [N] advertisers."

**Requirements:**
- Use the creative brief template
- Fill in: community, zip, carrier routes, households, advertiser lineup
- Include EDDM requirements checklist
- Include production timeline with realistic dates
- Save as: `creative-brief_[community]_[date].md`

### 4. Generate Campaign Report

**Prompt pattern:**
> "Generate a campaign report for [COMMUNITY], delivered [DATE], [N] advertisers, [HOUSEHOLDS] households."

**Requirements:**
- Summary: community, delivery date, households reached, advertiser count
- Financial: total revenue, total costs (printing + EDDM + misc), net profit
- Advertiser list: business name, category, placement, amount paid
- Next steps: renewal offers, next campaign target
- Save as: `campaign-report_[community]_[date].md`

### 5. Generate Pitch Script

**Prompt pattern:**
> "Write a pitch script for [CATEGORY] businesses targeting [COMMUNITY]."

**Requirements:**
- Opening hook with community-specific stats
- 3–4 key talking points (exclusivity, numbers, neighborhood fit, seasonal/timing)
- Objection handling (3–4 common objections with responses)
- Clear close / next step
- Use the existing pitch script format

### 6. Generate Prospect Research

**Prompt pattern:**
> "Build a prospect list for [COMMUNITY] — [CATEGORY] businesses within 10 miles."

**Requirements:**
- List 5–10 businesses per category
- Include: business name, address, phone, Google rating, review count
- Rate each: IDEAL, GOOD, or STRONG
- Note any relevant details (years in business, service area, specialties)
- Format for import into prospect tracker spreadsheet

---

## File Naming Conventions

| Type | Pattern |
|------|---------|
| Emails | `outreach_[business-name]_email[1-3].md` |
| Agreements | `agreement_[business-name]_[community].md` |
| Decks | `pitch-deck_[community]_[date].pptx` |
| Trackers | `prospect-tracker_[community]-[zip].xlsx` |
| Reports | `campaign-report_[community]_[date].md` |
| Creative Briefs | `creative-brief_[community]_[date].md` |

---

## California Legal Reminders

- FBN filed with county **recorder** (not clerk)
- FBN requires 4-week newspaper publication within 30 days
- LLC = $800/year minimum CA franchise tax
- Most CA cities require local business license ($50–200/year)
- Advertising services generally not taxable; printed materials may be (check CDTFA)
- Keep affidavit of publication on file; renew FBN every 5 years

---

## EDDM Constants

- Postage: $0.247/piece (paid at DDU drop-off)
- Flat-mail size: must be >6.125" tall OR >10.5" long
- Minimum paper: 14pt cardstock (0.007" thick)
- Indicia placement: upper-right corner of address side
- Bundle by carrier route, face up, address side visible
- File at eddm.usps.com, drop at DDU serving target zip codes
