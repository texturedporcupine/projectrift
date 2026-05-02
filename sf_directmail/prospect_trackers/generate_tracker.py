#!/usr/bin/env python3
"""
SF Bay Area Shared Postcard Direct Mail — Prospect Tracker Generator

Generates Excel prospect tracker workbooks for Bay Area communities.
Each workbook has:
  - Dashboard tab (campaign summary)
  - One prospect sheet per community requested
  - Instructions tab

Usage:
    python generate_tracker.py danville           # Danville only
    python generate_tracker.py danville sanramon  # Both communities
    python generate_tracker.py all                # All communities

Requires: pip install openpyxl
Output:  prospect-tracker_[community]-[zip].xlsx
"""

import sys
from datetime import date
import openpyxl
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, numbers
)
from openpyxl.utils import get_column_letter

# ─────────────────────────────────────────────────────────────────────────────
# Community definitions
# ─────────────────────────────────────────────────────────────────────────────

COMMUNITIES = {
    "danville": {
        "name": "Danville",
        "zip": "94526",
        "tier": "Tier 2",
        "hhi": "$185,000+",
        "target_hh": "5,000-7,000",
        "std_price": 600,
        "prem_price": 900,
        "advertisers_needed": 6,
        "gross_est": 3600,
        "print_cost": 350,
        "eddm_cost": 1359,
        "misc_cost": 100,
        "categories": [
            "HVAC", "Landscaping", "Pool Service",
            "Med Spa / Aesthetics", "Pest Control",
            "General Dentistry", "House Cleaning", "Pediatric Dentistry"
        ],
        "seed_prospects": [
            # (Business Name, Category, Rating, Address, Phone, Notes)
            ("Airrific Comfort", "HVAC", "IDEAL", "Danville, CA", "", "Yelp 4.8 stars, 200+ reviews"),
            ("Bay Area Comfort Systems", "HVAC", "GOOD", "San Ramon, CA", "", "Serves Danville"),
            ("Lawn Masters", "Landscaping", "IDEAL", "Danville, CA", "", "Blackhawk work shown on IG"),
            ("Green Valley Landscapes", "Landscaping", "STRONG", "Alamo, CA", "", "HOA-focused pitch"),
            ("Crystal Clear Pool Co.", "Pool Service", "IDEAL", "Danville, CA", "", "Serves Blackhawk"),
            ("Bay Pool Pros", "Pool Service", "GOOD", "San Ramon, CA", "", "Covers 94526"),
            ("Revive Med Spa", "Med Spa / Aesthetics", "IDEAL", "Danville, CA", "", "Strong Instagram presence"),
            ("Bloom Aesthetics", "Med Spa / Aesthetics", "STRONG", "Alamo, CA", "", "Referral-based, needs visibility"),
            ("Bay Area Pest Solutions", "Pest Control", "IDEAL", "Danville, CA", "", "Yelp 4.7, local brand"),
            ("ProPest Bay Area", "Pest Control", "GOOD", "Walnut Creek, CA", "", "Serves Danville routes"),
            ("Blackhawk Dental", "General Dentistry", "IDEAL", "Danville, CA", "", "Established practice"),
            ("Sycamore Family Dental", "General Dentistry", "STRONG", "Danville, CA", "", "New-ish, needs patients"),
            ("Spotless Homes", "House Cleaning", "IDEAL", "Danville, CA", "", "Recurring weekly service"),
            ("Merry Maids Danville", "House Cleaning", "GOOD", "Danville, CA", "", "Franchise, may need local approval"),
            ("Danville Kids Dentistry", "Pediatric Dentistry", "IDEAL", "Danville, CA", "", "Yelp 5.0, 150+ reviews"),
        ],
    },
    "sanramon": {
        "name": "San Ramon",
        "zip": "94582/94583",
        "tier": "Tier 2",
        "hhi": "$160,000+",
        "target_hh": "5,000-6,000",
        "std_price": 625,
        "prem_price": 950,
        "advertisers_needed": 7,
        "gross_est": 4375,
        "print_cost": 350,
        "eddm_cost": 1359,
        "misc_cost": 100,
        "categories": [
            "HVAC", "Tutoring", "Family Dentistry",
            "Pest Control", "House Cleaning",
            "Landscaping", "Roofing", "Med Spa"
        ],
        "seed_prospects": [
            ("Comfort Zone HVAC", "HVAC", "IDEAL", "San Ramon, CA", "", "Gale Ranch experience"),
            ("SV Air Systems", "HVAC", "GOOD", "Dublin, CA", "", "Covers San Ramon"),
            ("Kumon San Ramon", "Tutoring", "IDEAL", "San Ramon, CA", "", "Franchise – check local mgr"),
            ("Elite Academic Center", "Tutoring", "STRONG", "San Ramon, CA", "", "Independent, needs scale"),
            ("Bridges Tutoring", "Tutoring", "GOOD", "Dublin, CA", "", "Online+in-person hybrid"),
            ("Gale Ranch Family Dental", "Family Dentistry", "IDEAL", "San Ramon, CA", "", "Community name = trust signal"),
            ("Bishop Ranch Smiles", "Family Dentistry", "STRONG", "San Ramon, CA", "", "Near office parks"),
            ("EcoShield Pest Control", "Pest Control", "IDEAL", "San Ramon, CA", "", "Yelp 4.8, HOA experience"),
            ("Truly Nolen San Ramon", "Pest Control", "GOOD", "San Ramon, CA", "", "Franchise, may need approval"),
            ("Pristine Home Cleaning", "House Cleaning", "IDEAL", "San Ramon, CA", "", "Recurring clients, strong refs"),
            ("MH Cleaning Services", "House Cleaning", "STRONG", "Danville, CA", "", "Covers San Ramon"),
            ("Premier Landscaping", "Landscaping", "IDEAL", "San Ramon, CA", "", "HOA bid experience"),
            ("Ridgeline Roofing", "Roofing", "STRONG", "San Ramon, CA", "", "Class A fire-rated materials"),
            ("Contour Medical Spa", "Med Spa", "IDEAL", "San Ramon, CA", "", "Bollinger Canyon Rd location"),
        ],
    },
    "pleasanton": {
        "name": "Pleasanton",
        "zip": "94566/94588",
        "tier": "Tier 2",
        "hhi": "$155,000+",
        "target_hh": "5,000-6,500",
        "std_price": 650,
        "prem_price": 1000,
        "advertisers_needed": 6,
        "gross_est": 3900,
        "print_cost": 350,
        "eddm_cost": 1235,
        "misc_cost": 100,
        "categories": [
            "Pool Service", "Landscaping", "Orthodontics",
            "House Cleaning", "HVAC", "Pest Control",
            "General Dentistry", "Med Spa"
        ],
        "seed_prospects": [
            ("AquaClear Pool Service", "Pool Service", "IDEAL", "Pleasanton, CA", "", "Ruby Hill experience"),
            ("Hopyard Pool & Spa", "Pool Service", "STRONG", "Pleasanton, CA", "", "Local, good Yelp"),
            ("Landscapes by Design", "Landscaping", "IDEAL", "Pleasanton, CA", "", "Drought-tolerant specialty"),
            ("Val Vista Landscaping", "Landscaping", "GOOD", "Livermore, CA", "", "Serves Pleasanton"),
            ("Bay Area Orthodontics", "Orthodontics", "IDEAL", "Pleasanton, CA", "", "Invisalign provider, strong FB"),
            ("Smiling Faces Ortho", "Orthodontics", "STRONG", "Pleasanton, CA", "", "New location, needs patients"),
            ("Spotless East Bay", "House Cleaning", "IDEAL", "Pleasanton, CA", "", "Ruby Hill clients"),
            ("Cooling Experts HVAC", "HVAC", "IDEAL", "Pleasanton, CA", "", "Strong Yelp in Tri-Valley"),
            ("Pest Be Gone", "Pest Control", "STRONG", "Pleasanton, CA", "", "Organic methods – good hook"),
            ("Hopyard Dental Group", "General Dentistry", "IDEAL", "Pleasanton, CA", "", "Established, downtown location"),
            ("Glow Med Spa", "Med Spa", "IDEAL", "Pleasanton, CA", "", "Main Street, downtown Pleasanton"),
        ],
    },
    "dublin": {
        "name": "Dublin",
        "zip": "94568",
        "tier": "Tier 3",
        "hhi": "$145,000+",
        "target_hh": "5,000-7,000",
        "std_price": 500,
        "prem_price": 750,
        "advertisers_needed": 7,
        "gross_est": 3500,
        "print_cost": 350,
        "eddm_cost": 1359,
        "misc_cost": 100,
        "categories": [
            "HVAC", "Tutoring", "Pest Control",
            "Family Dentistry", "Landscaping",
            "Roofing", "House Cleaning", "Pediatric Dentistry"
        ],
        "seed_prospects": [
            ("Tri-Valley HVAC", "HVAC", "IDEAL", "Dublin, CA", "", "New construction experience"),
            ("Fallon HVAC Service", "HVAC", "STRONG", "Dublin, CA", "", "Jordan Ranch area"),
            ("Mathnasium Dublin", "Tutoring", "IDEAL", "Dublin, CA", "", "Franchise, well-known brand"),
            ("IQ Academy", "Tutoring", "STRONG", "Dublin, CA", "", "South Asian family focus"),
            ("EcoShield Dublin", "Pest Control", "IDEAL", "Dublin, CA", "", "New construction specialty"),
            ("Dublin Family Dental", "Family Dentistry", "IDEAL", "Dublin, CA", "", "Fallon Road location"),
            ("Fallon Landscaping", "Landscaping", "STRONG", "Dublin, CA", "", "Jordan Ranch installed yards"),
            ("Bay Roofing Pros", "Roofing", "IDEAL", "Dublin, CA", "", "Class A, new construction"),
            ("Fresh Start Cleaning", "House Cleaning", "STRONG", "Dublin, CA", "", "Bi-weekly service model"),
            ("Dublin Kids Smiles", "Pediatric Dentistry", "IDEAL", "Dublin, CA", "", "Yelp 4.9, pediatric specialty"),
        ],
    },
    "losgatos": {
        "name": "Los Gatos",
        "zip": "95030/95032",
        "tier": "Tier 1",
        "hhi": "$200,000+",
        "target_hh": "4,500-5,500",
        "std_price": 800,
        "prem_price": 1200,
        "advertisers_needed": 6,
        "gross_est": 4800,
        "print_cost": 350,
        "eddm_cost": 1112,
        "misc_cost": 100,
        "categories": [
            "Med Spa / Aesthetics", "Luxury Home Renovation",
            "Pool Service", "Cosmetic Dentistry",
            "Landscaping", "House Cleaning",
            "HVAC", "Concierge Medicine"
        ],
        "seed_prospects": [
            ("LG Aesthetics & Wellness", "Med Spa / Aesthetics", "IDEAL", "Los Gatos, CA", "", "Downtown Santa Cruz Ave"),
            ("Pure Skin Studio", "Med Spa / Aesthetics", "STRONG", "Los Gatos, CA", "", "Newer, building clientele"),
            ("Summit Home Builders", "Luxury Home Renovation", "IDEAL", "Los Gatos, CA", "", "High-end kitchen/bath"),
            ("Hillside Design Build", "Luxury Home Renovation", "STRONG", "Los Gatos, CA", "", "Estate additions"),
            ("LG Pool & Spa Service", "Pool Service", "IDEAL", "Los Gatos, CA", "", "Hillside custom pools"),
            ("Los Gatos Cosmetic Dental", "Cosmetic Dentistry", "IDEAL", "Los Gatos, CA", "", "Veneers and whitening focus"),
            ("Monte Sereno Landscapes", "Landscaping", "IDEAL", "Los Gatos, CA", "", "Estate-scale properties"),
            ("LG Estate Cleaning", "House Cleaning", "IDEAL", "Los Gatos, CA", "", "White-glove, recurring"),
            ("Foothill HVAC", "HVAC", "STRONG", "Los Gatos, CA", "", "Custom multi-zone systems"),
            ("LG Concierge Medicine", "Concierge Medicine", "IDEAL", "Los Gatos, CA", "", "Membership model, premium HHI match"),
        ],
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# Styles
# ─────────────────────────────────────────────────────────────────────────────

NAVY = "1B2A4A"
GOLD = "C9A84C"
WHITE = "FFFFFF"
LIGHT_GRAY = "F5F6F8"
DARK_GRAY = "333333"
MID_GRAY = "888888"
GREEN = "2D7D46"
LIGHT_GREEN = "D6F0DE"
AMBER = "F5A623"
LIGHT_AMBER = "FFF3CD"
RED = "CC0000"
LIGHT_RED = "FDECEA"


def hdr(color=NAVY, font_color=WHITE, bold=True, size=11):
    f = Font(bold=bold, color=font_color, size=size)
    fill = PatternFill("solid", fgColor=color)
    al = Alignment(horizontal="center", vertical="center", wrap_text=True)
    return f, fill, al


def cell_style(ws, cell_ref, value, font_color=DARK_GRAY, bg=None,
               bold=False, size=10, align="left", wrap=False, number_fmt=None):
    cell = ws[cell_ref]
    cell.value = value
    cell.font = Font(color=font_color, bold=bold, size=size)
    cell.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if bg:
        cell.fill = PatternFill("solid", fgColor=bg)
    if number_fmt:
        cell.number_format = number_fmt
    return cell


def thin_border():
    side = Side(border_style="thin", color="CCCCCC")
    return Border(left=side, right=side, top=side, bottom=side)


def rating_color(rating):
    if rating == "IDEAL":
        return LIGHT_GREEN, GREEN
    elif rating == "STRONG":
        return LIGHT_AMBER, AMBER
    elif rating == "GOOD":
        return "E8F0FE", "2E6DA4"
    return LIGHT_GRAY, MID_GRAY


# ─────────────────────────────────────────────────────────────────────────────
# Dashboard tab
# ─────────────────────────────────────────────────────────────────────────────

def build_dashboard(wb, community):
    c = community
    ws = wb.active
    ws.title = "Dashboard"
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 22

    # Header
    ws.merge_cells("A1:B1")
    cell_style(ws, "A1", f"Campaign Dashboard — {c['name']}", WHITE, NAVY, bold=True, size=14, align="center")
    ws.row_dimensions[1].height = 32

    ws.merge_cells("A2:B2")
    cell_style(ws, "A2", f"Bay Area Shared Postcard Direct Mail  |  {date.today().strftime('%B %Y')}",
               GOLD, NAVY, size=10, align="center")
    ws.row_dimensions[2].height = 20

    # Community stats
    rows = [
        ("Community", c["name"]),
        ("Zip Code(s)", c["zip"]),
        ("Tier", c["tier"]),
        ("Median HHI", c["hhi"]),
        ("Target Households (EDDM)", c["target_hh"]),
        ("Advertisers Needed", c["advertisers_needed"]),
        ("", ""),
        ("FINANCIALS", ""),
        ("Standard Ad Price", f"${c['std_price']:,}"),
        ("Premium Placement Price", f"${c['prem_price']:,}"),
        ("Estimated Gross Revenue", f"${c['gross_est']:,}"),
        ("Print Cost", f"${c['print_cost']:,}"),
        ("EDDM Postage (est.)", f"${c['eddm_cost']:,}"),
        ("Misc Costs", f"${c['misc_cost']:,}"),
        ("Estimated Net Profit",
         f"~${c['gross_est'] - c['print_cost'] - c['eddm_cost'] - c['misc_cost']:,}"),
        ("", ""),
        ("CAMPAIGN STATUS", ""),
        ("Slots Filled", 0),
        ("Slots Remaining", c["advertisers_needed"]),
        ("Deposit Collected ($)", 0),
        ("Final Payment Collected ($)", 0),
        ("Campaign Status", "Pre-launch"),
    ]

    for i, (label, value) in enumerate(rows):
        row = i + 3
        ws.row_dimensions[row].height = 18
        if label in ("FINANCIALS", "CAMPAIGN STATUS"):
            ws.merge_cells(f"A{row}:B{row}")
            cell_style(ws, f"A{row}", label, WHITE, NAVY, bold=True, size=10, align="left")
        elif label == "":
            pass
        elif label == "Estimated Net Profit":
            cell_style(ws, f"A{row}", label, DARK_GRAY, LIGHT_GRAY, bold=True, size=10)
            net = c['gross_est'] - c['print_cost'] - c['eddm_cost'] - c['misc_cost']
            cell_style(ws, f"B{row}", value, GREEN if net > 0 else RED,
                       LIGHT_GRAY, bold=True, size=10, align="right")
        else:
            cell_style(ws, f"A{row}", label, DARK_GRAY, size=10)
            cell_style(ws, f"B{row}", value, DARK_GRAY, align="right", size=10)
            ws[f"A{row}"].border = thin_border()
            ws[f"B{row}"].border = thin_border()

    # Categories
    start = len(rows) + 4
    ws.merge_cells(f"A{start}:B{start}")
    cell_style(ws, f"A{start}", "TARGET CATEGORIES", WHITE, NAVY, bold=True, size=10)
    ws.row_dimensions[start].height = 20
    for j, cat in enumerate(c["categories"]):
        r = start + j + 1
        ws.row_dimensions[r].height = 16
        cell_style(ws, f"A{r}", cat, DARK_GRAY, size=10)
        cell_style(ws, f"B{r}", "OPEN", MID_GRAY, LIGHT_GRAY, align="center", size=9)
        ws[f"A{r}"].border = thin_border()
        ws[f"B{r}"].border = thin_border()


# ─────────────────────────────────────────────────────────────────────────────
# Prospect sheet
# ─────────────────────────────────────────────────────────────────────────────

COLUMNS = [
    ("Business Name", 28),
    ("Category", 20),
    ("Rating", 10),
    ("Address", 25),
    ("Phone", 16),
    ("Decision Maker", 18),
    ("Email", 28),
    ("Email 1 Sent", 13),
    ("Email 2 Sent", 13),
    ("Email 3 Sent", 13),
    ("Called", 10),
    ("Visited", 10),
    ("Status", 16),
    ("Deposit Paid", 13),
    ("Final Paid", 12),
    ("Slot $", 10),
    ("Notes", 40),
]

STATUSES = ["Not Started", "Emailed", "Followed Up", "Called", "Visited",
            "Proposal Sent", "Negotiating", "SIGNED", "PASSED", "No Response"]


def build_prospect_sheet(wb, community):
    c = community
    ws = wb.create_sheet(title=f"{c['name']} Prospects")
    ws.sheet_view.showGridLines = False
    ws.freeze_panes = "A3"

    # Column widths
    for i, (_, width) in enumerate(COLUMNS, 1):
        ws.column_dimensions[get_column_letter(i)].width = width

    # Title row
    ws.merge_cells(f"A1:{get_column_letter(len(COLUMNS))}1")
    cell_style(ws, "A1",
               f"{c['name']} ({c['zip']}) — Prospect Tracker  |  {date.today().strftime('%B %Y')}",
               WHITE, NAVY, bold=True, size=12, align="center")
    ws.row_dimensions[1].height = 28

    # Header row
    for i, (col_name, _) in enumerate(COLUMNS, 1):
        cell = ws.cell(row=2, column=i, value=col_name)
        cell.font = Font(bold=True, color=WHITE, size=10)
        cell.fill = PatternFill("solid", fgColor=NAVY)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border()
    ws.row_dimensions[2].height = 30

    # Seed prospects
    for idx, prospect in enumerate(c["seed_prospects"]):
        row = idx + 3
        ws.row_dimensions[row].height = 18
        biz, category, rating, address, phone, notes = prospect
        bg, fg = rating_color(rating)

        values = [biz, category, rating, address, phone, "", "", "", "", "", "", "",
                  "Not Started", "", "", c["std_price"], notes]
        for col_idx, val in enumerate(values, 1):
            cell = ws.cell(row=row, column=col_idx, value=val)
            cell.border = thin_border()
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = Font(size=10)

            if col_idx == 3:  # Rating column
                cell.fill = PatternFill("solid", fgColor=bg)
                cell.font = Font(bold=True, color=fg, size=10)
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 13:  # Status
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 16:  # Slot $
                cell.number_format = "$#,##0"
                cell.alignment = Alignment(horizontal="right", vertical="center")

    # Add 20 blank rows for manual entry
    for blank_row in range(len(c["seed_prospects"]) + 3, len(c["seed_prospects"]) + 23):
        ws.row_dimensions[blank_row].height = 18
        for col_idx in range(1, len(COLUMNS) + 1):
            cell = ws.cell(row=blank_row, column=col_idx, value="")
            cell.border = thin_border()
            if col_idx == 16:
                cell.number_format = "$#,##0"
            if blank_row % 2 == 0:
                cell.fill = PatternFill("solid", fgColor="FAFAFA")

    # Rating legend below the table
    legend_row = len(c["seed_prospects"]) + 25
    ws.cell(row=legend_row, column=1, value="Rating Legend:").font = Font(bold=True, size=9)
    for i, (label, (bg, fg)) in enumerate(
        [("IDEAL — First call, perfect fit", (LIGHT_GREEN, GREEN)),
         ("STRONG — Good fit, worth pursuing", (LIGHT_AMBER, AMBER)),
         ("GOOD — Acceptable, pitch if IDEAL/STRONG fail", ("E8F0FE", "2E6DA4"))], 1
    ):
        c_cell = ws.cell(row=legend_row + i, column=1, value=label)
        c_cell.fill = PatternFill("solid", fgColor=bg)
        c_cell.font = Font(color=fg, size=9)


# ─────────────────────────────────────────────────────────────────────────────
# Instructions tab
# ─────────────────────────────────────────────────────────────────────────────

def build_instructions(wb):
    ws = wb.create_sheet(title="Instructions")
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 90

    lines = [
        ("BAY AREA SHARED POSTCARD DIRECT MAIL — TRACKER INSTRUCTIONS", NAVY, WHITE, True, 13, 32),
        ("", None, DARK_GRAY, False, 10, 8),
        ("HOW TO USE THIS TRACKER", GOLD, DARK_GRAY, True, 11, 24),
        ("1. DASHBOARD tab: shows campaign summary, pricing, financial projections, and category slots.", None, DARK_GRAY, False, 10, 18),
        ("2. PROSPECT tab: one row per business. Fill in Decision Maker, Email, and outreach dates as you go.", None, DARK_GRAY, False, 10, 18),
        ("3. Rating column: IDEAL = pitch first. STRONG = pitch if IDEAL passes. GOOD = backup.", None, DARK_GRAY, False, 10, 18),
        ("4. Status column: update after each touchpoint (Emailed → Called → Visited → Negotiating → SIGNED).", None, DARK_GRAY, False, 10, 18),
        ("5. Deposit Paid / Final Paid: mark Y when payment is received.", None, DARK_GRAY, False, 10, 18),
        ("", None, DARK_GRAY, False, 10, 8),
        ("OUTREACH SEQUENCE", NAVY, WHITE, True, 11, 24),
        ("Day 0:  Send Email 1 (cold opener). Mark 'Email 1 Sent' date.", None, DARK_GRAY, False, 10, 18),
        ("Day 3:  Send Email 2 (follow-up with ROI math). Mark 'Email 2 Sent' date.", None, DARK_GRAY, False, 10, 18),
        ("Day 7:  Send Email 3 (final ask + local hook). Mark 'Email 3 Sent' date.", None, DARK_GRAY, False, 10, 18),
        ("Day 8+: Call. Visit in person for high-value (IDEAL-rated) prospects.", None, DARK_GRAY, False, 10, 18),
        ("", None, DARK_GRAY, False, 10, 8),
        ("PAYMENT TERMS", NAVY, WHITE, True, 11, 24),
        ("50% deposit at signing. Remaining 50% due before print order is placed.", None, DARK_GRAY, False, 10, 18),
        ("Accepted: check, Zelle, ACH, credit card (add 3% surcharge for CC).", None, DARK_GRAY, False, 10, 18),
        ("", None, DARK_GRAY, False, 10, 8),
        ("CATEGORY LOCKING RULE", NAVY, WHITE, True, 11, 24),
        ("Once a business signs and pays a deposit, their category is LOCKED.", None, DARK_GRAY, False, 10, 18),
        ("Update Dashboard 'Slots Filled' count and change status to SIGNED.", None, DARK_GRAY, False, 10, 18),
        ("Do not pitch any other business in that category for this campaign.", None, DARK_GRAY, False, 10, 18),
        ("", None, DARK_GRAY, False, 10, 8),
        ("FILE NAMING", NAVY, WHITE, True, 11, 24),
        ("Outreach emails:    outreach_[business-name]_email[1-3].md", None, DARK_GRAY, False, 10, 18),
        ("Service agreements: agreement_[business-name]_[community].md", None, DARK_GRAY, False, 10, 18),
        ("Campaign reports:   campaign-report_[community]_[date].xlsx", None, DARK_GRAY, False, 10, 18),
    ]

    for i, (text, bg, fg, bold, size, height) in enumerate(lines, 1):
        ws.row_dimensions[i].height = height
        if bg:
            ws[f"A{i}"].fill = PatternFill("solid", fgColor=bg)
        ws[f"A{i}"].value = text
        ws[f"A{i}"].font = Font(bold=bold, color=fg, size=size)
        ws[f"A{i}"].alignment = Alignment(
            horizontal="left" if bg != NAVY else "left",
            vertical="center",
            indent=1 if not bg else 0
        )


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def build_tracker(community_key):
    c = COMMUNITIES[community_key]
    wb = openpyxl.Workbook()

    build_dashboard(wb, c)
    build_prospect_sheet(wb, c)
    build_instructions(wb)

    filename = f"prospect-tracker_{c['name'].lower().replace(' ', '-')}_{c['zip'].replace('/', '-')}.xlsx"
    wb.save(filename)
    net = c['gross_est'] - c['print_cost'] - c['eddm_cost'] - c['misc_cost']
    print(f"✓ Saved: {filename}")
    print(f"  Community:     {c['name']} ({c['zip']})")
    print(f"  Seed prospects: {len(c['seed_prospects'])}")
    print(f"  Categories:    {len(c['categories'])}")
    print(f"  Est. net:      ~${net:,}")
    print()


def main():
    args = sys.argv[1:] or ["danville"]
    if args == ["all"]:
        args = list(COMMUNITIES.keys())

    unknown = [a for a in args if a not in COMMUNITIES]
    if unknown:
        print(f"Unknown communities: {unknown}")
        print(f"Valid options: {list(COMMUNITIES.keys())} or 'all'")
        sys.exit(1)

    for key in args:
        build_tracker(key)


if __name__ == "__main__":
    main()
