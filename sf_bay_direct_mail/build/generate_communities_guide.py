"""Generate the Bay Area Communities Guide (.docx)."""
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor, Inches

OUT = Path(__file__).resolve().parent.parent / "docs" / "Bay_Area_Communities_Direct_Mail_Guide.docx"

COMMUNITIES = [
    {
        "name": "Danville",
        "zip": "94526",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$185,000+",
        "households": "18,000+",
        "homeownership": "~80%",
        "character": (
            "Affluent East Bay community along the I-680 corridor with strong town "
            "identity, top-rated schools (San Ramon Valley USD), an active downtown, and "
            "the Blackhawk and Diablo country clubs. Residents read community mail and "
            "trust local-business recommendations from neighbors."
        ),
        "categories": [
            "HVAC (year-round demand, $$$ ticket sizes)",
            "Landscaping & lawn care",
            "Pool service (high pool density)",
            "General & cosmetic dentistry",
            "Med spa / aesthetics",
            "Pest control (rodent, ant, spider)",
            "House cleaning (recurring service)",
            "Roofing (older Tassajara/Sycamore homes)",
        ],
        "routes_note": (
            "Look at EDDM routes serving the Tassajara, Sycamore, Westside, and "
            "Diablo Road carrier walks. Two to three contiguous routes will hit "
            "5,000–7,000 qualified households."
        ),
        "first_campaign_pricing": "$700–$900 standard / $1,100–$1,400 premium",
    },
    {
        "name": "San Ramon",
        "zip": "94582 / 94583",
        "tier": "Tier 1–2",
        "median_hhi": "$160,000+",
        "households": "30,000+",
        "homeownership": "~75%",
        "character": (
            "Master-planned suburbs anchored by Bishop Ranch and the Dougherty "
            "Valley. Younger tech-employed families, dual-income households, very "
            "high homeownership in newer subdivisions (Gale Ranch, Windemere). "
            "Strong HOA infrastructure across most neighborhoods."
        ),
        "categories": [
            "HVAC and air-quality services",
            "Tutoring & academic enrichment (huge demand)",
            "Family / pediatric dentistry",
            "Pest control",
            "Landscaping (HOA-conformant)",
            "House cleaning",
            "Pool service (Dougherty Valley)",
            "Window cleaning & solar panel cleaning",
        ],
        "routes_note": (
            "Pull EDDM routes for 94582 (Dougherty Valley / Gale Ranch / Windemere) "
            "and 94583 (Twin Creeks, Country Club). Two routes typically yield "
            "5,500–7,500 households."
        ),
        "first_campaign_pricing": "$650–$850 standard / $950–$1,200 premium",
    },
    {
        "name": "Pleasanton",
        "zip": "94566 / 94588",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$155,000+",
        "households": "28,000+",
        "homeownership": "~70%",
        "character": (
            "Established Tri-Valley suburb with a charming downtown, strong schools "
            "and a stable, mostly owner-occupied housing stock. Ruby Hill and "
            "Castlewood add a luxury layer to the south."
        ),
        "categories": [
            "Pool service & repair",
            "Landscaping & tree care",
            "Orthodontics & cosmetic dentistry",
            "House cleaning (recurring)",
            "HVAC",
            "Pest control",
            "Roofing & gutters",
            "Med spa / aesthetics",
        ],
        "routes_note": (
            "94566 (south of I-580, Ruby Hill, Vintage Hills) tends to outperform "
            "94588 for premium offers. Pull two routes for first campaign."
        ),
        "first_campaign_pricing": "$550–$750 standard / $850–$1,100 premium",
    },
    {
        "name": "Los Gatos",
        "zip": "95030 / 95032",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$200,000+",
        "households": "12,000+",
        "homeownership": "~70%",
        "character": (
            "Affluent South Bay town blending tech wealth with a small-town feel. "
            "Older housing stock means high reno/remodel demand. Mature trees + "
            "hill homes drive landscape and tree-care spend."
        ),
        "categories": [
            "Med spa / aesthetics (very strong)",
            "Luxury home services & remodel",
            "Pool service (hill properties)",
            "General & cosmetic dentistry",
            "Tree care / arborist",
            "Landscape design",
            "Window washing",
            "Concierge home management",
        ],
        "routes_note": (
            "Pull EDDM routes for 95032 (east side, near Vasona) and the western "
            "edge of 95030. Targets > $250K HHI households."
        ),
        "first_campaign_pricing": "$700–$900 standard / $1,100–$1,400 premium",
    },
    {
        "name": "Saratoga",
        "zip": "95070",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$250,000+",
        "households": "10,000+",
        "homeownership": "~85%",
        "character": (
            "Quiet, leafy, very high-income community with top public schools and "
            "a strong privately-employed professional base. Low turnover; long "
            "decision cycles but high lifetime value."
        ),
        "categories": [
            "Luxury renovation / design-build",
            "Med spa & aesthetic dermatology",
            "Estate planning / financial services",
            "Premium landscaping",
            "Pool service",
            "Cosmetic dentistry",
            "Tree care / arborist",
            "Concierge home services",
        ],
        "routes_note": (
            "Saratoga has fewer EDDM routes; you may need 3 to hit 5,000+ "
            "households. Lean into premium pricing."
        ),
        "first_campaign_pricing": "$800–$900 standard / $1,200–$1,400 premium",
    },
    {
        "name": "Los Altos Hills",
        "zip": "94022 / 94024",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$300,000+",
        "households": "8,000+",
        "homeownership": "~90%",
        "character": (
            "Ultra-affluent semi-rural town with large lots and acreage homes. "
            "Heavy spend on private well/pump service, premium landscaping, pool "
            "and tennis-court maintenance, and concierge medical."
        ),
        "categories": [
            "Premium landscaping & estate grounds care",
            "Pool & tennis court service",
            "Concierge medicine / aesthetics",
            "Tree care / arborist",
            "Roofing & exterior",
            "Generator & solar service",
            "House cleaning (multiple staff)",
            "Driveway / paving",
        ],
        "routes_note": (
            "Smaller absolute household counts; you may layer Los Altos and Los "
            "Altos Hills routes to reach 5,000+ pieces."
        ),
        "first_campaign_pricing": "$800–$900 standard / $1,200–$1,400 premium",
    },
    {
        "name": "Palo Alto (south)",
        "zip": "94303",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$210,000+",
        "households": "12,000+",
        "homeownership": "~55%",
        "character": (
            "Dense, walkable Mid-Peninsula core. Many young families with school-"
            "aged kids and dual incomes. High demand for tutoring, pediatric "
            "dentistry, and home-service category."
        ),
        "categories": [
            "Tutoring & test prep",
            "Pediatric & general dentistry",
            "Home services (electrician, plumber, handyman)",
            "House cleaning",
            "Pest control",
            "HVAC",
            "Med spa / dermatology",
            "Landscaping",
        ],
        "routes_note": (
            "94303 routes east of Middlefield perform well for home-services "
            "categories; west-of-Middlefield routes skew to professional services."
        ),
        "first_campaign_pricing": "$700–$900 standard / $1,000–$1,300 premium",
    },
    {
        "name": "Dublin",
        "zip": "94568",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$145,000+",
        "households": "22,000+",
        "homeownership": "~65%",
        "character": (
            "Fast-growing Tri-Valley suburb with newer master-planned "
            "subdivisions (Dublin Ranch, Positano, Schaefer Ranch) and a young "
            "tech-employed family base."
        ),
        "categories": [
            "HVAC",
            "Pest control",
            "Tutoring & enrichment",
            "Family dentistry",
            "Landscaping",
            "House cleaning",
            "Window cleaning / solar cleaning",
            "Pediatric dentistry",
        ],
        "routes_note": (
            "Dublin Ranch / Positano / Schaefer Ranch routes are the highest-HHI "
            "EDDM walks in 94568."
        ),
        "first_campaign_pricing": "$500–$700 standard / $800–$1,000 premium",
    },
    {
        "name": "Fremont (Warm Springs)",
        "zip": "94539",
        "tier": "Tier 2–3",
        "median_hhi": "$140,000+",
        "households": "15,000+",
        "homeownership": "~70%",
        "character": (
            "Mission San Jose / Warm Springs area. Strong public schools, large "
            "South Asian community with high spend on tutoring, family dentistry, "
            "and home-improvement categories."
        ),
        "categories": [
            "HVAC",
            "Pest control",
            "House cleaning",
            "Tutoring & test prep",
            "Family dentistry",
            "Pediatric dentistry",
            "Landscaping",
            "Roofing",
        ],
        "routes_note": (
            "Mission San Jose carrier routes are the highest-value walks in 94539."
        ),
        "first_campaign_pricing": "$500–$700 standard / $800–$1,000 premium",
    },
    {
        "name": "Livermore",
        "zip": "94550 / 94551",
        "tier": "Tier 2–3",
        "median_hhi": "$125,000+",
        "households": "20,000+",
        "homeownership": "~70%",
        "character": (
            "East Tri-Valley city with a wine-country edge, growing newer "
            "subdivisions on the north and east. Hot summers + larger lots drive "
            "HVAC and landscaping spend."
        ),
        "categories": [
            "HVAC",
            "Landscaping",
            "Pest control",
            "Pool service",
            "Family dentistry",
            "Roofing",
            "Window/solar cleaning",
            "Med spa",
        ],
        "routes_note": (
            "94551 (north Livermore, newer builds) routes typically outperform "
            "94550 for first-campaign fill rates."
        ),
        "first_campaign_pricing": "$450–$650 standard / $700–$900 premium",
    },
    {
        "name": "Brentwood",
        "zip": "94513",
        "tier": "Tier 3 — Growth",
        "median_hhi": "$115,000+",
        "households": "22,000+",
        "homeownership": "~75%",
        "character": (
            "Far East Bay growth community with many newer subdivisions, large "
            "family households, and high pool/HVAC density due to inland heat."
        ),
        "categories": [
            "Pool service",
            "HVAC",
            "Pest control",
            "Roofing",
            "Landscaping",
            "House cleaning",
            "Family dentistry",
            "Solar cleaning / install service",
        ],
        "routes_note": (
            "Trilogy (55+) and Brentwood Lakes routes are highest-yield. Pair two "
            "routes for first campaign."
        ),
        "first_campaign_pricing": "$400–$600 standard / $650–$850 premium",
    },
    {
        "name": "Rocklin / Roseville",
        "zip": "95765 / 95677",
        "tier": "Tier 3 — Growth",
        "median_hhi": "$120,000+",
        "households": "35,000+",
        "homeownership": "~70%",
        "character": (
            "Sacramento-metro overflow communities with strong household "
            "formation. Treat as expansion target after 2–3 successful Bay Area "
            "campaigns."
        ),
        "categories": [
            "HVAC",
            "Pest control",
            "Family dentistry",
            "Landscaping",
            "Pool service",
            "Roofing",
            "House cleaning",
            "Window cleaning",
        ],
        "routes_note": (
            "Whitney Ranch / Stanford Ranch routes are the highest-HHI walks; "
            "great for first-campaign tests."
        ),
        "first_campaign_pricing": "$400–$600 standard / $650–$850 premium",
    },
]


def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    return h


def add_kv(doc, key, value):
    p = doc.add_paragraph()
    run = p.add_run(f"{key}: ")
    run.bold = True
    p.add_run(value)
    return p


def main():
    doc = Document()

    title = doc.add_heading("SF Bay Area Communities — Direct Mail Guide", level=0)
    p = doc.add_paragraph()
    r = p.add_run(
        "Adapted from the Austin TX Communities Guide. Use this as the foundation "
        "for prospect-tracker sheets, pitch-deck stats, and campaign targeting."
    )
    r.italic = True

    add_heading(doc, "How to Use This Guide", level=1)
    doc.add_paragraph(
        "For each community below: tier, median HHI, household count, "
        "homeownership rate, character notes, recommended business categories, "
        "and first-campaign pricing guidance. Tier 1 = premium pricing & shortest "
        "sales cycle; Tier 3 = growth markets with longer cycles but lower "
        "advertiser cost-of-acquisition."
    )

    add_heading(doc, "Recommended First Campaigns", level=1)
    doc.add_paragraph(
        "Start with Danville (94526) — the strongest community-mail-reading "
        "culture in the Bay Area, analogous to Circle C Ranch in Austin. San "
        "Ramon (Bishop Ranch corridor, 94582 / 94583) is the strongest second "
        "target."
    )

    for c in COMMUNITIES:
        add_heading(doc, f"{c['name']} ({c['zip']})", level=1)
        add_kv(doc, "Tier", c["tier"])
        add_kv(doc, "Median Household Income", c["median_hhi"])
        add_kv(doc, "Households", c["households"])
        add_kv(doc, "Homeownership", c["homeownership"])
        add_kv(doc, "First-Campaign Pricing", c["first_campaign_pricing"])

        doc.add_paragraph().add_run("Character").bold = True
        doc.add_paragraph(c["character"])

        doc.add_paragraph().add_run("Recommended Categories").bold = True
        for cat in c["categories"]:
            doc.add_paragraph(cat, style="List Bullet")

        doc.add_paragraph().add_run("EDDM Route Notes").bold = True
        doc.add_paragraph(c["routes_note"])

    add_heading(doc, "Community Research Process", level=1)
    steps = [
        "Go to eddm.usps.com. Enter the target zip. Filter income $100K+, household size 2.5+. Screenshot 2–3 viable routes and note household counts.",
        "Search '[community name] HOA' to confirm an active HOA exists. Active HOA = residents who read community mail.",
        "Search '[community name] community newsletter' (Nextdoor presence, local paper, HOA newsletter) — strong signal if one exists.",
        "Use Google Maps to identify commercial corridors serving the neighborhood — that is where your advertisers will come from.",
        "Build a 30–40 business prospect list across 8–10 non-competing categories before any outreach.",
    ]
    for s in steps:
        doc.add_paragraph(s, style="List Number")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
