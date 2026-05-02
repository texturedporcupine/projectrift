"""Generate the California Business Plan (.docx) for the SF Bay Area direct mail business."""
from datetime import date
from pathlib import Path

from docx import Document
from docx.shared import Pt, Inches

OUT = Path(__file__).resolve().parent.parent / "docs" / "California_Direct_Mail_Business_Plan.docx"


def H(doc, text, level=1):
    doc.add_heading(text, level=level)


def P(doc, text):
    doc.add_paragraph(text)


def bullets(doc, items):
    for item in items:
        doc.add_paragraph(item, style="List Bullet")


def main():
    doc = Document()

    doc.add_heading("SF Bay Area Shared Postcard Direct Mail — Business Plan", level=0)
    p = doc.add_paragraph()
    r = p.add_run(f"California / Bay Area edition · {date.today():%B %Y}")
    r.italic = True
    P(doc,
      "Adapted from the Austin TX playbook. Sections 1 (legal/tax) and 3 "
      "(communities) have been rewritten for California. Pricing has been "
      "uplifted 20–40% to reflect Bay Area cost-of-living and local-business "
      "revenue.")

    H(doc, "1. Legal & Tax Setup (California)", 1)

    H(doc, "1.1 Business Structure", 2)
    P(doc,
      "Start as a sole proprietorship — simplest, lowest cost. Convert to an "
      "LLC once the business has at least one full year of profit and you want "
      "personal-asset protection.")
    bullets(doc, [
        "Sole proprietorship: no formation cost; report income on Schedule C.",
        "LLC: $70 filing fee + $800/year minimum CA franchise tax (FTB), regardless of revenue.",
        "First-year LLC franchise tax may be waived if formed in Q4 — confirm current rules at ftb.ca.gov.",
    ])

    H(doc, "1.2 Fictitious Business Name (FBN / DBA)", 2)
    P(doc,
      "California DBAs are filed with the COUNTY RECORDER (not county clerk, "
      "which is the Texas convention). After filing, you must publish the FBN "
      "in an adjudicated local newspaper for 4 consecutive weeks within 30 "
      "days of filing.")
    bullets(doc, [
        "Filing fee: $26–$100 depending on county.",
        "Publication budget: $50–$150 (varies by paper).",
        "Renew every 5 years; keep the affidavit of publication on file.",
    ])

    H(doc, "1.3 Local Business License", 2)
    P(doc,
      "California has no statewide business license, but most cities and "
      "counties do require a local license, generally $50–$200/year. Check the "
      "specific city where you operate (often the city where you live, since "
      "the business is home-based).")

    H(doc, "1.4 Sales Tax Treatment", 2)
    P(doc,
      "Advertising services themselves are generally NOT subject to California "
      "sales tax. However, printed materials sold to clients MAY be taxable "
      "depending on how the transaction is structured (e.g., if you bill the "
      "advertiser separately for printed proofs).")
    bullets(doc, [
        "Confirm rules with CDTFA (cdtfa.ca.gov).",
        "When in doubt, structure invoices as 'advertising space' (service) rather than 'printed postcards' (tangible product).",
        "If you cross the threshold for a CDTFA seller's permit, register and file — there is no fee to register.",
    ])

    H(doc, "1.5 Insurance & Contracts", 2)
    bullets(doc, [
        "General liability policy: $300–$600/year (Hiscox, Next, Thimble).",
        "Use a written service agreement with every advertiser (see CA agreement template).",
        "Always collect 50% deposit at signing and 50% before printing.",
    ])

    H(doc, "2. Pricing & Revenue Model", 1)
    P(doc,
      "Bay Area pricing runs 20–40% above Austin rates. Use the table below.")

    table = doc.add_table(rows=1, cols=4)
    table.style = "Light Grid"
    hdr = table.rows[0].cells
    hdr[0].text = "Tier"
    hdr[1].text = "Communities"
    hdr[2].text = "Standard Ad"
    hdr[3].text = "Premium Placement"
    rows = [
        ("Tier 1 — Premium", "Palo Alto, Los Altos, Saratoga, Piedmont, Danville, Los Gatos", "$700–$900", "$1,100–$1,400"),
        ("Tier 2 — Strong", "San Ramon, Pleasanton, Dublin", "$550–$750", "$850–$1,100"),
        ("Tier 3 — Growth", "Fremont, Livermore, Brentwood, Rocklin/Roseville", "$400–$600", "$650–$850"),
    ]
    for tier, communities, std, prem in rows:
        c = table.add_row().cells
        c[0].text = tier
        c[1].text = communities
        c[2].text = std
        c[3].text = prem

    H(doc, "2.1 Per-Campaign Economics (Tier 2 baseline)", 2)
    bullets(doc, [
        "Revenue: 6 × $650 = $3,900 (target case).",
        "Printing: ~$350 (5,000–6,000 pieces, 14pt cardstock).",
        "EDDM postage: 6,000 × $0.247 = $1,482.",
        "Misc (design tweaks, drop-off mileage): ~$100.",
        "Net target: ~$1,968.",
    ])

    H(doc, "2.2 Payment Terms", 2)
    bullets(doc, [
        "50% deposit at signing — secures the category exclusivity.",
        "50% balance due before printing.",
        "All payments via ACH or paper check; avoid credit-card processing fees on first 10 campaigns.",
    ])

    H(doc, "3. Target Communities (Bay Area)", 1)
    P(doc,
      "See companion document Bay_Area_Communities_Direct_Mail_Guide.docx for "
      "full community profiles. First-campaign recommendation: Danville (94526). "
      "Second target: San Ramon (94582 / 94583) along the Bishop Ranch corridor.")

    H(doc, "4. Operations", 1)
    H(doc, "4.1 Standard Campaign Workflow", 2)
    steps = [
        ("Pick a community", "Choose a Bay Area neighborhood with 4,000–8,000 households, an active HOA, clear geographic boundaries, and dense commercial corridors."),
        ("Lock 2–3 EDDM routes", "Use eddm.usps.com to filter routes by income and household size."),
        ("Build prospect list", "30–40 businesses across 8–10 non-competing categories, scored IDEAL / GOOD / STRONG."),
        ("Outreach", "Run the 3-email sequence (cold opener, day-3 follow-up, day-7 value-add). Phone call after email 2."),
        ("Sell exclusivity", "Pitch one business per category. Collect 50% deposit at signing — that locks the category."),
        ("Design & proof", "Produce 8.5\" × 11\" or 6.5\" × 9\" postcard. Get written proof approval from every advertiser."),
        ("Final invoice", "Collect remaining 50% before printing."),
        ("Print", "Use a local commercial printer (e.g., MGX Copy, PsPrint, GotPrint). 14pt cardstock minimum."),
        ("EDDM drop", "Bundle 100 pieces per bundle. Drop at the DDU serving your zip codes. Pay $0.247/piece at drop-off."),
        ("Follow up", "Contact every advertiser 2 weeks after delivery. Capture testimonials. Pitch renewal at 15–20% multi-campaign discount."),
    ]
    for title_, body in steps:
        p = doc.add_paragraph(style="List Number")
        run = p.add_run(f"{title_}. ")
        run.bold = True
        p.add_run(body)

    H(doc, "4.2 EDDM Mechanics (unchanged from Austin)", 2)
    bullets(doc, [
        "Postcard must be a flat: > 6.125\" tall OR > 10.5\" long.",
        "EDDM indicia in the upper-right corner of the address side.",
        "$0.247/piece postage at the DDU; max 5,000 pieces per drop per zip.",
        "USPS form 3587 + facing slips (one per bundle).",
    ])

    H(doc, "5. 90-Day Launch Checklist (Bay Area)", 1)
    checklist = [
        "Days 1–7: File CA FBN at county recorder. Schedule newspaper publication. Open business bank account.",
        "Days 8–14: Pick first community (recommend Danville 94526). Pull EDDM routes. Build 30-business prospect list.",
        "Days 15–30: Send cold-email batch 1 (10 prospects). Begin daily outreach + follow-up cadence.",
        "Days 31–45: Close first 3 advertisers. Collect deposits. Begin postcard design.",
        "Days 46–60: Close remaining 3 advertisers (target 6 total). Send proofs. Collect final balances.",
        "Days 61–75: Print run. Bundle and deliver to DDU.",
        "Days 76–90: Follow up with each advertiser. Collect testimonials. Pitch renewals. Pick second community.",
    ]
    for item in checklist:
        doc.add_paragraph(item, style="List Number")

    H(doc, "6. Vendor Recommendations", 1)
    bullets(doc, [
        "Printing (Bay Area): MGX Copy (San Diego, ships fast), PsPrint, GotPrint, 4Over (trade-only).",
        "Design: Canva Pro for in-house; or freelance designer at $200–$400/postcard from Upwork.",
        "Email outreach: Mailmeteor or Apollo.io for sequencing.",
        "CRM (lightweight): Notion or Airtable; promote to HubSpot Free if pipeline > 50 prospects.",
    ])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
