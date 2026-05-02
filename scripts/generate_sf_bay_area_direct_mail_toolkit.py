"""Generate the SF Bay Area direct-mail toolkit from the uploaded brief.

The source brief asked for a Bay Area adaptation of an existing Austin direct-mail
playbook. This repository does not contain the Austin source assets, so this
script creates a clean, self-contained first version of the requested toolkit.
"""

from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.shared import Pt
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt as PptPt


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "direct_mail" / "sf_bay_area"
BUILD_DATE = "2026-05-02"


COMMUNITIES = [
    {
        "name": "Danville",
        "zips": "94526",
        "income": "$185K+",
        "homes": "18,000+",
        "tier": "1",
        "character": "Affluent East Bay suburb with strong homeownership, established neighborhoods, active community channels, and a local merchant base that fits premium home-service categories.",
        "categories": "HVAC, landscaping, pool service, family dentistry, med spa, pest control, estate planning, house cleaning",
        "first_campaign": "Recommended first launch market. Use 2-3 EDDM routes totaling 5,000-7,000 households after route-level USPS validation.",
        "prospect_corridors": "Downtown Danville, San Ramon Valley Blvd, Camino Tassajara, Crow Canyon corridor",
    },
    {
        "name": "San Ramon",
        "zips": "94582 / 94583",
        "income": "$160K+",
        "homes": "30,000+",
        "tier": "1-2",
        "character": "Master-planned, family-heavy market with tech-worker households, strong schools, and clear residential clusters around Bishop Ranch and newer subdivisions.",
        "categories": "HVAC, tutoring, family dentistry, pest control, orthodontics, cleaning, landscaping, pediatric dentistry",
        "first_campaign": "Strong alternate launch market. Segment by Bishop Ranch corridor or Dougherty Valley to keep routes focused.",
        "prospect_corridors": "Bishop Ranch, City Center, Crow Canyon, Bollinger Canyon, Dougherty Valley",
    },
    {
        "name": "Pleasanton",
        "zips": "94566 / 94588",
        "income": "$155K+",
        "homes": "28,000+",
        "tier": "2",
        "character": "Established suburban market with high homeownership, active youth sports and school communities, and strong demand for family and home services.",
        "categories": "Pool service, landscaping, orthodontics, house cleaning, HVAC, pest control, family dentistry, tutoring",
        "first_campaign": "Use as a second-wave market after proving Danville or San Ramon creative and pricing.",
        "prospect_corridors": "Downtown Pleasanton, Stoneridge, Hopyard, Bernal, Santa Rita",
    },
    {
        "name": "Dublin",
        "zips": "94568",
        "income": "$145K+",
        "homes": "22,000+",
        "tier": "2",
        "character": "Growth market with newer family neighborhoods, commuting households, and many service businesses competing for repeat residential customers.",
        "categories": "HVAC, pest control, tutoring, family dentistry, cleaning, landscaping, roofing, pediatric dentistry",
        "first_campaign": "Good expansion market once renewal language and route math are proven.",
        "prospect_corridors": "Dublin Blvd, Hacienda Crossings, Fallon Gateway, Tassajara Road",
    },
    {
        "name": "Los Gatos",
        "zips": "95030 / 95032",
        "income": "$200K+",
        "homes": "12,000+",
        "tier": "1",
        "character": "Premium South Bay community with affluent homeowners, luxury-service demand, and local businesses that can support higher ad pricing.",
        "categories": "Med spa, luxury home services, pool service, dentistry, estate planning, premium landscaping, concierge medicine, remodeling",
        "first_campaign": "Use premium creative and higher placement pricing; validate EDDM route geography carefully because households are less dense.",
        "prospect_corridors": "Downtown Los Gatos, Los Gatos Blvd, Blossom Hill, Saratoga-Los Gatos Road",
    },
]


ALL_MARKETS = [
    ("Danville", "94526", "$185K+", "18,000+", "1", "HVAC, landscaping, pool, dentist, med spa"),
    ("San Ramon", "94582/94583", "$160K+", "30,000+", "1-2", "HVAC, tutoring, family dentist, pest control"),
    ("Pleasanton", "94566/94588", "$155K+", "28,000+", "2", "Pool, landscaping, orthodontics, cleaning"),
    ("Los Gatos", "95030/95032", "$200K+", "12,000+", "1", "Med spa, luxury home, pool, dentist"),
    ("Saratoga", "95070", "$250K+", "10,000+", "1", "Luxury renovation, med spa, estate planning"),
    ("Los Altos Hills", "94022/94024", "$300K+", "8,000+", "1", "Premium landscaping, concierge medicine"),
    ("Palo Alto South", "94303", "$210K+", "12,000+", "1", "Tutoring, dentist, home services"),
    ("Dublin", "94568", "$145K+", "22,000+", "2", "HVAC, pest control, tutoring, family dentist"),
    ("Fremont Warm Springs", "94539", "$140K+", "15,000+", "2-3", "HVAC, pest control, cleaning, tutoring"),
    ("Livermore", "94550/94551", "$125K+", "20,000+", "2-3", "HVAC, landscaping, pest control, dentist"),
    ("Brentwood", "94513", "$115K+", "22,000+", "3", "Pool, HVAC, pest control, roofing"),
    ("Rocklin/Roseville", "95765/95777", "$120K+", "35,000+", "3", "HVAC, pest control, dentist, landscaping"),
]


CATEGORIES = [
    ("HVAC", "Seasonal maintenance, replacements, indoor air quality"),
    ("Pest Control", "Ants, spiders, rodents, preventive quarterly plans"),
    ("Family Dentistry", "New patient exam, whitening, family scheduling"),
    ("Pediatric Dentistry", "School-year checkups, child-friendly care"),
    ("Orthodontics", "Invisalign, teen braces, free consult"),
    ("Pool Service", "Weekly service, repair, equipment upgrades"),
    ("Landscaping", "Yard refresh, irrigation, premium maintenance"),
    ("Plumbing", "Water heaters, leak detection, emergency service"),
    ("Roofing", "Inspections, repairs, storm readiness"),
    ("House Cleaning", "Recurring cleaning, move-in/move-out, deep clean"),
    ("Med Spa", "Injectables, skin treatments, local premium offer"),
    ("Estate Planning", "Family trusts, wills, homeowner protection"),
]


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def render_market_table() -> str:
    lines = [
        "| Community | Zip(s) | Median HHI | Homes | Tier | Top categories |",
        "| --- | --- | ---: | ---: | --- | --- |",
    ]
    for row in ALL_MARKETS:
        lines.append(f"| {row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} |")
    return "\n".join(lines)


def cursor_context() -> str:
    return """
# Project: SF Bay Area Shared Postcard Direct Mail Business

## What This Is

A direct-mail advertising business that sells exclusive ad space to local
businesses on a shared postcard, then uses USPS Every Door Direct Mail (EDDM)
to deliver to 5,000-8,000 households in a target community. There is only one
business per category per postcard: one HVAC company, one dentist, one pest
control company, and so on. The operator handles design, print coordination,
proof approvals, and EDDM delivery logistics.

## Business Model

- Sell 6-8 ad spaces per campaign at Bay Area prices.
- Tier 1 standard ad: $700-900; premium placement: $1,100-1,400.
- Tier 2 standard ad: $550-750; premium placement: $850-1,100.
- Tier 3 standard ad: $400-600; premium placement: $650-850.
- Estimated cost per 5,000-piece campaign: about $350 printing, $1,235 EDDM
  postage at $0.247/piece, plus about $100 miscellaneous.
- Payment terms: 50% deposit at signing, 50% before printing.

## Primary Target Communities

- Danville, CA (94526): Tier 1, $185K+ HHI, strong community identity.
- San Ramon, CA (94582/94583): Tier 1-2, $160K+ HHI, master-planned and
  family-heavy.
- Pleasanton, CA (94566/94588): Tier 2, $155K+ HHI, established suburbs and
  high homeownership.

## Postcard Specs

- Size: 8.5 in x 11 in or 6.5 in x 9 in.
- Must qualify as a USPS flat: more than 6.125 in tall or more than 10.5 in
  long.
- Paper: 14 pt cardstock minimum, at least 0.007 in thick.
- EDDM indicia belongs in the upper-right of the address side.
- Postage: $0.247 per piece, paid at DDU drop-off.

## Key Business Categories

HVAC, pest control, general dentistry, pediatric dentistry, orthodontics, pool
service, landscaping, plumbing, roofing, house cleaning, med spa/aesthetics,
and estate planning.

## California Legal Notes

- File an FBN (Fictitious Business Name) statement with the county recorder.
- Publish the FBN in an adjudicated local newspaper for 4 consecutive weeks
  within 30 days of filing.
- Renew the FBN every 5 years and retain the affidavit of publication.
- If forming a California LLC, budget for the $800/year minimum franchise tax.
- Check city and county business-license requirements before launch.
- Advertising services are generally not taxable, but printed materials sold
  to clients may be. Confirm current treatment with the CDTFA or a California
  tax professional.

## Generated Toolkit

The executable assets live in `direct_mail/sf_bay_area/`:

- `business/ca_business_plan.md`
- `communities/bay_area_communities_guide.md`
- `deck/pitch-deck_bay-area_2026-05-02.pptx`
- `outreach/three_email_sequence.md`
- `pitch_scripts/category_pitch_scripts.md`
- `trackers/prospect-tracker_danville-94526.xlsx`
- `trackers/prospect-tracker_san-ramon-94582-94583.xlsx`
- `agreements/service_agreement_ca.md`
- `agreements/agreement_template_ca.docx`
- `creative/creative_brief_template.md`
- `ops/Cowork_Instructions.md`
- `app/EatTheElephant.jsx`
"""


def readme() -> str:
    return """
# SF Bay Area Shared Postcard Direct Mail Toolkit

This folder contains the Bay Area adaptation generated from the uploaded
`sf_directmail_cursor_brief.pdf`. The original Austin source files were not
present in this repository, so these are self-contained first-version assets
that follow the same structure requested in the brief.

## Recommended launch path

1. Start with Danville 94526 or San Ramon 94582/94583.
2. Validate 2-3 EDDM carrier routes at `eddm.usps.com` totaling 5,000-7,000
   households.
3. Build a researched list of 30-40 prospects across 8-10 non-competing
   categories using the included tracker.
4. Sell 5-6 advertisers for the pilot campaign, collecting 50% deposit at
   signing and 50% before print.
5. Mail the card, follow up 2 weeks after delivery, collect testimonials, and
   offer a 15-20% multi-campaign renewal discount.

## File map

| File | Purpose |
| --- | --- |
| `business/ca_business_plan.md` | California legal/tax adaptation and Bay Area pricing model |
| `communities/bay_area_communities_guide.md` | Profiles for Danville, San Ramon, Pleasanton, Dublin, and Los Gatos |
| `deck/pitch-deck_bay-area_2026-05-02.pptx` | Five-slide sales deck adapted for Bay Area markets |
| `deck/pitch-deck_bay-area_outline.md` | Text source for the deck |
| `outreach/three_email_sequence.md` | Cold, day-3, and day-7 email sequence |
| `pitch_scripts/category_pitch_scripts.md` | Category-specific scripts for 10+ business types |
| `trackers/*.xlsx` | Prospect trackers for Danville and San Ramon |
| `agreements/service_agreement_ca.md` | California service agreement source text |
| `agreements/agreement_template_ca.docx` | Editable DOCX version of the agreement |
| `creative/creative_brief_template.md` | Market-neutral creative intake brief |
| `ops/Cowork_Instructions.md` | Operational prompt for generating campaign collateral |
| `app/EatTheElephant.jsx` | React task tracker with Bay Area task/pricing updates |

## Notes and assumptions

- Median household income and home-count figures are from the uploaded brief
  and should be validated before external publication.
- Prospect trackers include category slots and research prompts rather than
  unverified business records.
- California tax and legal notes are operational guidance, not legal advice.
"""


def business_plan() -> str:
    return f"""
# California Business Plan Adaptation

## 1. Legal and setup requirements

### 1.1 Business structure

Start as a sole proprietorship unless liability, tax planning, or partner
structure makes an entity necessary. A sole proprietorship keeps the pilot
simple and avoids the California LLC minimum franchise tax while the model is
being validated.

If the business operates under a name other than the owner's legal name, file a
California Fictitious Business Name (FBN) statement with the county recorder.
This is different from the Texas clerk workflow in the Austin playbook.

### 1.2 Fictitious Business Name process

1. Choose the operating name and check county-level availability.
2. File the FBN statement with the county recorder.
3. Publish the FBN notice in an adjudicated local newspaper for 4 consecutive
   weeks within 30 days of filing.
4. Keep the affidavit of publication with the business records.
5. Renew the FBN every 5 years.

Expected FBN filing range: $26-$100 by county. Expected publication budget:
$50-$150.

### 1.3 Business license

California does not have a single statewide business license, but most cities
and counties require a local license or tax certificate. Check the city where
the business is based and any city where client-facing operations occur. Budget
$50-$200/year for planning purposes.

### 1.4 Sales tax and printed materials

Advertising services are generally not taxable in California, but printed
materials and related transfers can create sales-tax obligations. Before
collecting client payments, confirm the treatment of bundled design,
coordination, printing, and postage with the California Department of Tax and
Fee Administration (CDTFA) or a California tax professional.

### 1.5 LLC decision point

A California LLC may make sense after repeatable campaign revenue exists, but
it carries an $800/year minimum franchise tax regardless of revenue. Use this
threshold as a decision checkpoint rather than defaulting to an LLC for the
first pilot.

## 2. Bay Area market strategy

### Launch market

Danville 94526 is the recommended first campaign because it combines affluent
households, clear community identity, high homeownership, local merchant
density, and a mail-reading culture similar to the Austin model's strongest
neighborhoods.

San Ramon 94582/94583 is the alternate first campaign, especially around the
Bishop Ranch and Dougherty Valley corridors.

### Target campaign size

- Household target: 5,000-8,000.
- Route target: 2-3 EDDM carrier routes.
- Advertiser target: 6-8 categories, with a practical pilot floor of 5-6 paid
  advertisers.
- Exclusivity: one advertiser per category per postcard.

## 3. Pricing and economics

| Market tier | Communities | Standard ad | Premium placement |
| --- | --- | ---: | ---: |
| Tier 1 - Premium | Palo Alto, Los Altos, Saratoga, Piedmont, Danville, Los Gatos | $700-900 | $1,100-1,400 |
| Tier 2 - Strong | San Ramon, Pleasanton, Dublin | $550-750 | $850-1,100 |
| Tier 3 - Growth | Fremont, Livermore, Brentwood, Roseville/Rocklin | $400-600 | $650-850 |

### Pilot economics

Assume 5,000 mailed households.

| Scenario | Ads sold | Avg. price | Revenue | Estimated costs | Estimated net |
| --- | ---: | ---: | ---: | ---: | ---: |
| Conservative pilot | 5 | $500 | $2,500 | $1,685 | $815 |
| Base pilot | 6 | $650 | $3,900 | $1,685 | $2,215 |
| Strong pilot | 8 | $750 | $6,000 | $1,685 | $4,315 |

Cost assumptions: $350 printing, $1,235 EDDM postage at $0.247/piece, and $100
miscellaneous. Requote printing before every campaign.

## 4. Operating workflow

1. Pick the community and validate EDDM routes.
2. Build a 30-40 prospect list across 8-10 non-competing categories.
3. Contact prospects using the three-email sequence plus phone follow-up.
4. Lock category exclusivity when the 50% deposit is received.
5. Collect creative assets and produce a proof.
6. Get written proof approval from every advertiser.
7. Collect final 50% payment before print.
8. Print, bundle, complete EDDM paperwork, and drop at the DDU.
9. Follow up 2 weeks after delivery for results, testimonials, and renewals.

## 5. Compliance checklist

- [ ] Confirm FBN filing and publication requirements for the home county.
- [ ] Confirm city business license requirement.
- [ ] Confirm CDTFA treatment for bundled print/postage services.
- [ ] Use written service agreements before collecting deposits.
- [ ] Keep advertiser proof approvals on file.
- [ ] Keep USPS EDDM route selections, paperwork, and receipts on file.

Generated: {BUILD_DATE}
"""


def communities_guide() -> str:
    sections = [
        "# Bay Area Communities Direct Mail Guide",
        "",
        "Use this guide to pick the first campaign market, build prospect trackers, and tailor sales collateral.",
        "",
        "## Community reference table",
        "",
        render_market_table(),
        "",
        "## Research workflow for each community",
        "",
        "1. Open `eddm.usps.com` and enter the target zip code.",
        "2. Filter for household income $100K+ and household size 2.5+ where route data is available.",
        "3. Screenshot 2-3 viable carrier routes and record household counts.",
        "4. Search for active HOAs, local newsletters, school/community groups, and neighborhood associations.",
        "5. Map the commercial corridors that serve the route.",
        "6. Build 30-40 prospects across 8-10 non-competing categories before outreach.",
        "",
        "## Priority community profiles",
        "",
    ]
    for community in COMMUNITIES:
        sections.extend(
            [
                f"### {community['name']} ({community['zips']})",
                "",
                f"- Tier: {community['tier']}",
                f"- Median household income: {community['income']}",
                f"- Homes: {community['homes']}",
                f"- Community character: {community['character']}",
                f"- Recommended categories: {community['categories']}",
                f"- Prospect corridors: {community['prospect_corridors']}",
                f"- Campaign note: {community['first_campaign']}",
                "",
                "Suggested proof points for sales collateral:",
                "",
                "- The postcard reaches local homeowners, not broad citywide traffic.",
                "- Category exclusivity prevents side-by-side competition on the same card.",
                "- EDDM keeps distribution tangible and geographically precise.",
                "- Local service businesses only need a small number of new jobs or patients to break even.",
                "",
            ]
        )
    sections.extend(
        [
            "## First campaign recommendation",
            "",
            "Start with Danville 94526 unless route validation shows better household density in San Ramon. Danville is the closest match to the Austin model's first-campaign profile: affluent, residential, local-business oriented, and community aware.",
        ]
    )
    return "\n".join(sections)


def outreach_sequence() -> str:
    return """
# Three-Email Outreach Sequence

Use one business per category per postcard. Replace bracketed fields before
sending.

## Email 1 - Cold opener

**Subject options**

- Exclusive [category] spot for [community] homeowners
- Reaching 5,000+ [community] mailboxes this month
- Quick local advertising idea for [business name]

**Body**

Hi [first name],

I am putting together a shared postcard campaign for [community] homeowners
and I am reserving only one spot per business category. I wanted to reach out
before offering the [category] spot to anyone else.

The campaign is simple: 6-8 trusted local businesses share one professionally
designed postcard, and we mail it through USPS EDDM to 5,000-8,000 households
in [community]. You get category exclusivity, so there will not be another
[category] business on the same card.

For [community], pricing starts at [price] for a standard ad space. Premium
placement is available at [premium price]. We handle layout, print coordination,
EDDM paperwork, and delivery logistics.

Would you be open to seeing the mockup and route plan?

Best,
[sender name]

## Email 2 - Day-3 follow-up

**Subject options**

- Re: [community] homeowner postcard
- Holding the [category] spot
- Worth a quick look?

**Body**

Hi [first name],

Following up on the [community] shared postcard campaign. The reason I thought
of [business name] is that [category] businesses can usually justify direct
mail with a small number of new customers.

Example: if your average new customer is worth [average value], one or two
responses can cover the ad cost. The rest is upside, and the card also keeps
your name visible with local homeowners.

I am keeping the postcard category-exclusive, so I can only place one
[category] business on this campaign. If you want, I can send the route count,
pricing, and draft layout.

Best,
[sender name]

## Email 3 - Day-7 value-add

**Subject options**

- Route math for [community]
- Local mailbox reach without citywide waste
- Closing the [category] slot

**Body**

Hi [first name],

Last note from me on this round. The main advantage of this campaign is that it
does not ask a local business to pay for broad Bay Area exposure. It focuses on
specific [community] carrier routes with high-income homeowner households.

The package includes:

- Exclusive [category] placement.
- Design coordination and proof approval.
- USPS EDDM mailing to selected routes.
- Post-campaign follow-up so you can decide whether to renew.

If this is not a fit for this campaign, no worries. If you would like to review
the mockup before I offer the [category] spot elsewhere, reply with "send it"
and I will send the details.

Best,
[sender name]

## Phone follow-up opener

"Hi [first name], this is [sender] calling about a local postcard campaign for
[community]. I am only including one [category] business, and I wanted to see if
you would like the route/pricing details before I move to the next business on
my list."
"""


def pitch_scripts() -> str:
    scripts = [
        "# Category Pitch Scripts",
        "",
        "Use these as phone or in-person talk tracks. Keep the objection-handling language at the end unchanged unless the offer changes.",
        "",
    ]
    for category, hook in CATEGORIES[:10]:
        scripts.extend(
            [
                f"## {category}",
                "",
                f"**Opening hook:** \"I am building a category-exclusive postcard for [community] homeowners, and the {category.lower()} slot is one of the categories that tends to make the most sense because it connects directly to homeowner demand: {hook.lower()}.\"",
                "",
                "**Value frame:**",
                "",
                "- The audience is local homeowner households, not a broad digital audience.",
                f"- Only one {category.lower()} business appears on the card.",
                "- The campaign can be judged on a simple break-even number: how many new customers are needed to cover the ad.",
                "- The postcard is tangible and can sit on a fridge, counter, or home-office desk when the need arises.",
                "",
                "**Close:**",
                "",
                f"\"If you want the {category.lower()} category, I can hold it with a 50% deposit while the card is designed. You will approve the proof before anything prints.\"",
                "",
            ]
        )
    scripts.extend(
        [
            "## Universal objection handler",
            "",
            "### \"We do not do direct mail.\"",
            "",
            "\"That makes sense. This is a smaller, route-specific campaign rather than a big generic mailer. The reason it may be worth considering is the category exclusivity and the homeowner targeting. You are not paying to reach the whole Bay Area.\"",
            "",
            "### \"We tried direct mail before.\"",
            "",
            "\"Totally fair. The two things I would want to understand are where it mailed and whether you had category exclusivity. This version is focused on a defined local route set and only one business per category, so the card is not crowded with direct competitors.\"",
            "",
            "### \"It is too expensive.\"",
            "",
            "\"I get it. The best way to look at it is break-even. If the ad is [price] and your average new customer is worth [value], how many responses would make it worthwhile? For many home-service categories the answer is one or two.\"",
            "",
            "### \"I need to think about it.\"",
            "",
            "\"Of course. The only timing issue is category exclusivity. I can send the route count and sample layout today, and if you want the category I can hold it once the deposit is in.\"",
        ]
    )
    return "\n".join(scripts)


def agreement_md() -> str:
    return """
# Shared Postcard Advertising Services Agreement - California

This template is a starting point and should be reviewed by a California
attorney before use.

## Parties

This Advertising Services Agreement ("Agreement") is entered into by and
between:

- Provider: [Provider legal name], doing business as [FBN name if applicable]
- Advertiser: [Advertiser legal name]
- Campaign community: [Community]
- Campaign mailing zip code(s): [Zip codes]

## Services

Provider will coordinate a shared postcard advertising campaign using USPS
Every Door Direct Mail. Services include advertiser intake, postcard layout
coordination, proof routing, print coordination, EDDM paperwork preparation,
and delivery logistics for the selected route set.

## Category exclusivity

Advertiser receives exclusivity for the following category on this postcard:
[Category]. Provider will not place a directly competing advertiser in the same
category on the same postcard campaign.

## Fees and payment terms

- Total campaign fee: $[amount]
- Deposit due at signing: 50%
- Final payment due before print release: 50%

The category is not reserved until the deposit has cleared. Printing will not
begin until final payment and written proof approval are received.

## Advertiser responsibilities

Advertiser will provide logo files, offer details, required disclaimers,
contact information, and timely proof feedback. Advertiser is responsible for
the accuracy of all claims, offers, licenses, prices, and regulated statements
in its advertisement.

## Proof approval

Provider will submit a proof before printing. Advertiser must approve the proof
in writing. Approval by email is acceptable. After approval, Advertiser is
responsible for errors that were visible in the approved proof.

## Mailing and delivery

Provider will use USPS EDDM for the selected carrier routes. USPS delivery
dates are estimates and are not guaranteed by Provider. Provider is not
responsible for USPS delays, route changes, weather impacts, or delivery
conditions outside Provider's control.

## Cancellations

If Advertiser cancels before design work begins, Provider may refund the
deposit less any payment-processing costs. If Advertiser cancels after design,
proofing, route preparation, or production work has started, the deposit is
non-refundable. Final payments are non-refundable after print release.

## No guaranteed results

Provider does not guarantee leads, calls, sales, revenue, or return on
investment. Provider's obligation is to coordinate the advertising placement
and mailing logistics described in this Agreement.

## California compliance

Provider is responsible for maintaining its applicable local business license
and Fictitious Business Name filing if operating under an FBN. Advertiser is
responsible for compliance with laws and professional rules that apply to its
own business and advertisement.

## Governing law

This Agreement is governed by the laws of the State of California.

## Signatures

Provider signature: ___________________________ Date: __________

Advertiser signature: _________________________ Date: __________
"""


def creative_brief() -> str:
    return """
# Creative Brief Template

## Campaign basics

- Community:
- Zip code(s):
- EDDM route IDs:
- Estimated household count:
- Mail date target:
- Postcard size: 8.5 in x 11 in or 6.5 in x 9 in

## Advertiser details

- Business name:
- Category:
- Contact:
- Phone:
- Email:
- Website:
- License number, if applicable:

## Offer

- Primary offer:
- Expiration date:
- Promo code or tracking number:
- Required terms/disclaimers:

## Creative assets

- Logo file received:
- Brand colors:
- Photos:
- Preferred headline:
- Proof approver:

## Approval checklist

- [ ] Business name and contact details verified.
- [ ] Offer and expiration verified.
- [ ] Required disclaimers included.
- [ ] Category exclusivity confirmed.
- [ ] Proof approved in writing.
- [ ] Final payment collected before print.
"""


def cowork_instructions() -> str:
    return """
# Cowork Instructions - SF Bay Area Direct Mail

Use this prompt when generating campaign collateral, outreach, creative briefs,
reports, or advertiser-specific proposals.

## Operating context

We sell category-exclusive ad space on a shared postcard mailed through USPS
EDDM to Bay Area homeowner communities. Campaigns usually target 5,000-8,000
households across 2-3 carrier routes. We handle design coordination, proof
approval, print coordination, EDDM paperwork, and DDU drop-off.

## Primary communities

- Danville 94526: Tier 1, $185K+ median HHI, strong HOA/community identity.
- San Ramon 94582/94583: Tier 1-2, $160K+ median HHI, master-planned family market.
- Pleasanton 94566/94588: Tier 2, $155K+ median HHI, established high-homeownership suburbs.
- Dublin 94568: Tier 2, $145K+ median HHI, growth family market.
- Los Gatos 95030/95032: Tier 1, $200K+ median HHI, premium/luxury service market.

## Pricing defaults

- Tier 1 standard ad: $700-900.
- Tier 1 premium placement: $1,100-1,400.
- Tier 2 standard ad: $550-750.
- Tier 2 premium placement: $850-1,100.
- Tier 3 standard ad: $400-600.
- Tier 3 premium placement: $650-850.

## Required positioning

- One advertiser per category per postcard.
- Local homeowner route targeting, not broad citywide advertising.
- 50% deposit at signing, 50% before print.
- Proof approval required before print.
- Follow-up 2 weeks after delivery for renewal and testimonial.

## Common outputs

### Outreach email

Ask for business name, category, community, price, and offer. Produce email 1,
day-3 follow-up, and day-7 value-add.

### Proposal

Include route count, category exclusivity, pricing, payment terms, proof
approval process, and next step.

### Campaign report

Include selected routes, household count, advertiser list, mail date, USPS
drop-off confirmation, response tracking fields, renewal recommendation, and
testimonial request language.

### Creative brief

Collect logo, offer, phone, URL, tracking number, disclaimers, proof approver,
and category.
"""


def deck_outline() -> str:
    return """
# Pitch Deck Outline - Bay Area Shared Postcard

## Slide 1 - Own the Mailbox

Shared postcard advertising for high-income Bay Area homeowner communities.
One postcard. One business per category. Thousands of local mailboxes.

## Slide 2 - Why these communities

Danville, San Ramon, and Pleasanton combine high household income, strong
homeownership, and dense local business demand.

## Slide 3 - How it works

We select EDDM routes, sell one advertiser per category, design and proof the
card, print and mail through USPS EDDM, then follow up after delivery.

## Slide 4 - ROI and pricing

Standard placements start at $550-900 depending on tier. Most home-service
advertisers need only one or two new customers to break even.

## Slide 5 - Close

Reserve the category with a 50% deposit. Approve the proof before print. Review
results 2 weeks after delivery and renew with a multi-campaign discount.
"""


def eat_the_elephant() -> str:
    return """
import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sf-bay-direct-mail-tasks";

const INITIAL_TASKS = [
  {
    id: "s1",
    phase: "Setup",
    energy: "low",
    title: "Confirm California FBN filing process for your county recorder",
    notes: "Budget $26-$100 for filing and $50-$150 for publication.",
  },
  {
    id: "s2",
    phase: "Setup",
    energy: "low",
    title: "Check city business license requirements",
    notes: "California does not have one statewide license; most cities require a local license or tax certificate.",
  },
  {
    id: "s3",
    phase: "Setup",
    energy: "medium",
    title: "Validate Danville 94526 EDDM routes",
    notes: "Pick 2-3 routes totaling 5,000-7,000 households.",
  },
  {
    id: "s4",
    phase: "Setup",
    energy: "medium",
    title: "Validate San Ramon 94582/94583 EDDM routes",
    notes: "Focus on Bishop Ranch, Dougherty Valley, and nearby homeowner clusters.",
  },
  {
    id: "s5",
    phase: "Setup",
    energy: "medium",
    title: "Validate Pleasanton 94566/94588 EDDM routes",
    notes: "Use as a second-wave campaign after proving Danville or San Ramon.",
  },
  {
    id: "p1",
    phase: "Prep",
    energy: "high",
    title: "Build 30-40 prospects across 8-10 categories",
    notes: "Do not contact two competitors in the same category at the same time.",
  },
  {
    id: "p2",
    phase: "Prep",
    energy: "medium",
    title: "Create route-specific pitch deck",
    notes: "Use household count, income tier, category exclusivity, and simple break-even math.",
  },
  {
    id: "p3",
    phase: "Prep",
    energy: "medium",
    title: "Set Bay Area pricing for the campaign",
    notes: "Tier 1 standard $700-$900, premium $1,100-$1,400. Tier 2 standard $550-$750, premium $850-$1,100.",
  },
  {
    id: "o1",
    phase: "Outreach",
    energy: "high",
    title: "Send email 1 to first-choice category prospects",
    notes: "Lead with category exclusivity and local homeowner reach.",
  },
  {
    id: "o2",
    phase: "Outreach",
    energy: "medium",
    title: "Call prospects 24-48 hours after email 1",
    notes: "Ask whether they want to review the route count and sample layout.",
  },
  {
    id: "c1",
    phase: "Close",
    energy: "high",
    title: "Collect 50% deposit and lock category",
    notes: "Category is not reserved until deposit clears.",
  },
  {
    id: "c2",
    phase: "Close",
    energy: "medium",
    title: "Collect creative assets and route proof approval",
    notes: "Final payment is due before print release.",
  },
  {
    id: "m1",
    phase: "Mail",
    energy: "high",
    title: "Complete EDDM paperwork and DDU drop-off",
    notes: "Use $0.247 per piece for postage planning; verify current USPS rate before mailing.",
  },
  {
    id: "r1",
    phase: "Renew",
    energy: "medium",
    title: "Follow up 2 weeks after delivery",
    notes: "Collect results, testimonial, and pitch renewal with a 15-20% multi-campaign discount.",
  },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function loadStoredState() {
  if (!window.storage?.get) {
    return null;
  }

  const result = await window.storage.get(STORAGE_KEY);
  if (!result) {
    return null;
  }

  const raw = typeof result === "string" ? result : result.value;
  return raw ? JSON.parse(raw) : null;
}

async function saveStoredState(state) {
  if (!window.storage?.set) {
    return;
  }

  await window.storage.set(STORAGE_KEY, JSON.stringify(state));
}

export default function EatTheElephant() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [energy, setEnergy] = useState("all");
  const [streak, setStreak] = useState({ count: 0, lastCompletedDate: null });

  useEffect(() => {
    loadStoredState().then((state) => {
      if (state?.tasks) {
        setTasks(state.tasks);
      }
      if (state?.streak) {
        setStreak(state.streak);
      }
    });
  }, []);

  useEffect(() => {
    saveStoredState({ tasks, streak });
  }, [tasks, streak]);

  const filteredTasks = useMemo(() => {
    return energy === "all" ? tasks : tasks.filter((task) => task.energy === energy);
  }, [energy, tasks]);

  const completedCount = tasks.filter((task) => task.done).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );

    const today = todayKey();
    setStreak((current) => {
      if (current.lastCompletedDate === today) {
        return current;
      }
      return { count: current.count + 1, lastCompletedDate: today };
    });
  }

  const phases = [...new Set(filteredTasks.map((task) => task.phase))];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <section className="mx-auto max-w-5xl rounded-2xl bg-slate-900 p-6 shadow-xl">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-wide text-emerald-300">
            SF Bay Area Direct Mail
          </p>
          <h1 className="text-3xl font-bold">Eat the Elephant</h1>
          <p className="mt-2 text-slate-300">
            Break the launch into small tasks, filtered by available energy.
          </p>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Progress</p>
            <p className="text-2xl font-semibold">{progress}%</p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="text-2xl font-semibold">
              {completedCount}/{tasks.length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Streak</p>
            <p className="text-2xl font-semibold">{streak.count} days</p>
          </div>
        </div>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Energy level
          </span>
          <select
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            value={energy}
            onChange={(event) => setEnergy(event.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {phases.map((phase) => (
          <section className="mb-6" key={phase}>
            <h2 className="mb-3 text-xl font-semibold">{phase}</h2>
            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.phase === phase)
                .map((task) => (
                  <label
                    className="flex gap-3 rounded-xl bg-slate-800 p-4"
                    key={task.id}
                  >
                    <input
                      checked={Boolean(task.done)}
                      className="mt-1 h-5 w-5"
                      onChange={() => toggleTask(task.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block font-medium">{task.title}</span>
                      <span className="block text-sm text-slate-400">
                        {task.notes}
                      </span>
                    </span>
                  </label>
                ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
"""


def generate_tracker(path: Path, community_name: str, zips: str) -> None:
    wb = Workbook()
    ws = wb.active
    safe_zips = zips.replace("/", "-")
    ws.title = f"{community_name} {safe_zips}"[:31]

    headers = [
        "Priority",
        "Category",
        "Business Name",
        "Address",
        "Phone",
        "Website",
        "Contact Name",
        "Email",
        "Fit Rating",
        "Exclusivity Status",
        "Outreach Status",
        "Last Touch",
        "Next Step",
        "Offer Hook",
        "Notes",
    ]
    ws.append(headers)

    fills = {
        "header": PatternFill("solid", fgColor="1F4E78"),
        "locked": PatternFill("solid", fgColor="D9EAD3"),
    }

    for cell in ws[1]:
        cell.fill = fills["header"]
        cell.font = Font(color="FFFFFF", bold=True)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    priority = 1
    for category, hook in CATEGORIES:
        for candidate in range(1, 4):
            ws.append(
                [
                    priority,
                    category,
                    f"Research {community_name} {category} candidate {candidate}",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "UNRATED",
                    "OPEN",
                    "Not started",
                    "",
                    "Research and verify local fit",
                    hook,
                    "Replace this placeholder with a verified local business before outreach.",
                ]
            )
            priority += 1

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions

    validations = [
        ("I2:I200", '"IDEAL,STRONG,GOOD,UNRATED,DISQUALIFIED"'),
        ("J2:J200", '"OPEN,HELD,LOCKED,CONFLICT,RELEASED"'),
        ("K2:K200", '"Not started,Email 1 sent,Follow-up sent,Called,Meeting booked,Proposal sent,Closed won,Closed lost,Nurture"'),
    ]
    for range_ref, formula in validations:
        validation = DataValidation(type="list", formula1=formula, allow_blank=True)
        ws.add_data_validation(validation)
        validation.add(range_ref)

    widths = {
        "A": 10,
        "B": 20,
        "C": 42,
        "D": 30,
        "E": 16,
        "F": 26,
        "G": 22,
        "H": 28,
        "I": 16,
        "J": 20,
        "K": 18,
        "L": 16,
        "M": 28,
        "N": 36,
        "O": 50,
    }
    for col, width in widths.items():
        ws.column_dimensions[col].width = width

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)

    instructions = wb.create_sheet("Instructions")
    instructions.append(["Prospect tracker instructions"])
    instructions.append([f"Community: {community_name}"])
    instructions.append([f"Zip code(s): {zips}"])
    instructions.append(["Before outreach, replace placeholders with verified local businesses."])
    instructions.append(["Lock only one business per category after deposit clears."])
    instructions.append(["Validate EDDM route count at eddm.usps.com before quoting final household count."])
    instructions["A1"].font = Font(bold=True, size=14)
    instructions.column_dimensions["A"].width = 110

    path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(path)


def generate_deck(path: Path) -> None:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    bg = RGBColor(15, 23, 42)
    green = RGBColor(16, 185, 129)
    white = RGBColor(248, 250, 252)
    muted = RGBColor(203, 213, 225)
    blue = RGBColor(30, 64, 175)

    def set_bg(slide, color=bg):
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_title(slide, title, subtitle=None):
        box = slide.shapes.add_textbox(Inches(0.7), Inches(0.55), Inches(12), Inches(1.2))
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = PptPt(38)
        p.font.color.rgb = white
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = PptPt(18)
            p2.font.color.rgb = muted

    def add_body(slide, lines, left=0.9, top=2.0, width=11.7, height=4.4):
        box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
        tf = box.text_frame
        tf.word_wrap = True
        for idx, line in enumerate(lines):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            p.text = line
            p.font.size = PptPt(22 if idx == 0 else 18)
            p.font.color.rgb = white if idx == 0 else muted
            p.space_after = PptPt(10)
            if idx > 0:
                p.level = 1

    # Slide 1
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide)
    add_title(slide, "Own the Mailbox", "Shared postcard advertising for high-income Bay Area homeowner communities")
    add_body(
        slide,
        [
            "One postcard. One business per category. Thousands of local mailboxes.",
            "Built for Danville, San Ramon, Pleasanton, and similar Bay Area communities.",
            "Professional design, print coordination, USPS EDDM delivery, and post-campaign follow-up.",
        ],
    )
    shape = slide.shapes.add_shape(1, Inches(0.9), Inches(6.25), Inches(4.2), Inches(0.55))
    shape.fill.solid()
    shape.fill.fore_color.rgb = green
    shape.line.color.rgb = green
    text = shape.text_frame.paragraphs[0]
    text.text = "Pilot target: 5,000-8,000 households"
    text.font.bold = True
    text.font.size = PptPt(18)
    text.font.color.rgb = RGBColor(0, 0, 0)
    text.alignment = PP_ALIGN.CENTER

    # Slide 2
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide)
    add_title(slide, "Why these communities", "High-income households, homeowner density, and strong local service demand")
    rows = 4
    cols = 5
    table_shape = slide.shapes.add_table(rows, cols, Inches(0.75), Inches(2.0), Inches(11.8), Inches(2.2))
    table = table_shape.table
    header = ["Community", "Zip", "HHI", "Homes", "Tier"]
    data = [
        ["Danville", "94526", "$185K+", "18,000+", "1"],
        ["San Ramon", "94582/83", "$160K+", "30,000+", "1-2"],
        ["Pleasanton", "94566/88", "$155K+", "28,000+", "2"],
    ]
    for c, value in enumerate(header):
        cell = table.cell(0, c)
        cell.text = value
        cell.fill.solid()
        cell.fill.fore_color.rgb = blue
        cell.text_frame.paragraphs[0].font.color.rgb = white
        cell.text_frame.paragraphs[0].font.bold = True
    for r, row in enumerate(data, start=1):
        for c, value in enumerate(row):
            cell = table.cell(r, c)
            cell.text = value
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(30, 41, 59)
            cell.text_frame.paragraphs[0].font.color.rgb = white
    add_body(
        slide,
        [
            "Use route-level USPS validation before final counts.",
            "Start with Danville or San Ramon for the first pilot.",
            "Keep campaigns geographically tight so advertisers buy local reach, not waste.",
        ],
        top=4.75,
        height=1.7,
    )

    # Slide 3
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide)
    add_title(slide, "How the campaign works", "A simple managed process for local advertisers")
    add_body(
        slide,
        [
            "1. Pick 2-3 EDDM routes in the target community.",
            "2. Sell 6-8 non-competing categories with exclusivity.",
            "3. Collect 50% deposit, gather assets, and route proofs.",
            "4. Collect final 50%, print, bundle, and drop at the DDU.",
            "5. Follow up 2 weeks after delivery for results and renewal.",
        ],
    )

    # Slide 4
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide)
    add_title(slide, "Pricing and break-even math", "Bay Area pricing with a practical ROI frame")
    table_shape = slide.shapes.add_table(4, 3, Inches(0.75), Inches(1.9), Inches(6.1), Inches(2.4))
    table = table_shape.table
    pricing = [
        ["Tier", "Standard", "Premium"],
        ["Tier 1", "$700-900", "$1,100-1,400"],
        ["Tier 2", "$550-750", "$850-1,100"],
        ["Tier 3", "$400-600", "$650-850"],
    ]
    for r, row in enumerate(pricing):
        for c, value in enumerate(row):
            cell = table.cell(r, c)
            cell.text = value
            cell.fill.solid()
            cell.fill.fore_color.rgb = blue if r == 0 else RGBColor(30, 41, 59)
            cell.text_frame.paragraphs[0].font.color.rgb = white
            cell.text_frame.paragraphs[0].font.bold = r == 0
    add_body(
        slide,
        [
            "Break-even lens",
            "If the ad costs $650 and one new job is worth $500-$1,500, most advertisers only need one or two responses.",
            "Pilot cost estimate: about $1,685 for 5,000 pieces before owner time.",
        ],
        left=7.25,
        top=2.0,
        width=5.0,
        height=2.8,
    )

    # Slide 5
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide)
    add_title(slide, "Reserve your category", "Next step for interested local advertisers")
    add_body(
        slide,
        [
            "What happens next",
            "Review the route count and sample layout.",
            "Reserve the category with a 50% deposit.",
            "Approve your proof before print.",
            "Review results 2 weeks after delivery and renew at a multi-campaign discount.",
        ],
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    prs.save(path)


def generate_docx(path: Path) -> None:
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Arial"
    style.font.size = Pt(10)
    doc.add_heading("Shared Postcard Advertising Services Agreement - California", 0)
    for block in agreement_md().split("\n\n"):
        text = block.strip()
        if not text or text.startswith("# "):
            continue
        if text.startswith("## "):
            doc.add_heading(text.replace("## ", ""), level=1)
        elif text.startswith("- "):
            for line in text.splitlines():
                doc.add_paragraph(line[2:], style="List Bullet")
        else:
            doc.add_paragraph(text)
    path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(path)


def generate_all() -> None:
    write_text(ROOT / "CURSOR_CONTEXT.md", cursor_context())
    write_text(BASE / "README.md", readme())
    write_text(BASE / "business" / "ca_business_plan.md", business_plan())
    write_text(BASE / "communities" / "bay_area_communities_guide.md", communities_guide())
    write_text(BASE / "outreach" / "three_email_sequence.md", outreach_sequence())
    write_text(BASE / "pitch_scripts" / "category_pitch_scripts.md", pitch_scripts())
    write_text(BASE / "agreements" / "service_agreement_ca.md", agreement_md())
    write_text(BASE / "creative" / "creative_brief_template.md", creative_brief())
    write_text(BASE / "ops" / "Cowork_Instructions.md", cowork_instructions())
    write_text(BASE / "deck" / "pitch-deck_bay-area_outline.md", deck_outline())
    write_text(BASE / "app" / "EatTheElephant.jsx", eat_the_elephant())
    generate_tracker(BASE / "trackers" / "prospect-tracker_danville-94526.xlsx", "Danville", "94526")
    generate_tracker(
        BASE / "trackers" / "prospect-tracker_san-ramon-94582-94583.xlsx",
        "San Ramon",
        "94582/94583",
    )
    generate_deck(BASE / "deck" / f"pitch-deck_bay-area_{BUILD_DATE}.pptx")
    generate_docx(BASE / "agreements" / "agreement_template_ca.docx")


if __name__ == "__main__":
    generate_all()
    print(f"Generated SF Bay Area direct-mail toolkit in {BASE.relative_to(ROOT)}")
