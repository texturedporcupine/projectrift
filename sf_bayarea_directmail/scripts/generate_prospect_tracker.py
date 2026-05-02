#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SF Bay Area Shared Postcard Direct Mail — Prospect Tracker Generator
Generates an Excel workbook with one sheet per community.
Each sheet has pre-built columns for business prospecting, category locking,
outreach status, and contact management.

Usage:
    python generate_prospect_tracker.py [community]
    python generate_prospect_tracker.py danville
    python generate_prospect_tracker.py san_ramon
    python generate_prospect_tracker.py all

Output: prospect-tracker_[community]-[zip].xlsx
"""

import sys
from datetime import datetime

import pandas as pd

COMMUNITIES = {
    "danville": {
        "name": "Danville",
        "zip": "94526",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$185,000+",
        "standard_price": "$700–900",
        "premium_price": "$1,100–1,400",
        "categories": [
            "HVAC",
            "Landscaping",
            "Pool Service",
            "General Dentistry",
            "Med Spa / Aesthetics",
            "House Cleaning",
            "Plumbing",
            "Roofing",
            "Pest Control",
            "Interior Design",
        ],
    },
    "san_ramon": {
        "name": "San Ramon",
        "zip": "94582-94583",
        "tier": "Tier 1–2",
        "median_hhi": "$160,000+",
        "standard_price": "$550–750",
        "premium_price": "$850–1,100",
        "categories": [
            "HVAC",
            "Tutoring / Test Prep",
            "Family Dentistry",
            "Pest Control",
            "Landscaping",
            "Pool Service",
            "House Cleaning",
            "Orthodontics",
            "Home Remodeling",
            "Insurance",
        ],
    },
    "pleasanton": {
        "name": "Pleasanton",
        "zip": "94566",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$155,000+",
        "standard_price": "$550–750",
        "premium_price": "$850–1,100",
        "categories": [
            "Pool Service",
            "Landscaping",
            "Orthodontics",
            "House Cleaning",
            "HVAC",
            "Pest Control",
            "Plumbing",
            "Tutoring",
            "Home Renovation",
            "Med Spa",
        ],
    },
    "dublin": {
        "name": "Dublin",
        "zip": "94568",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$145,000+",
        "standard_price": "$550–750",
        "premium_price": "$850–1,100",
        "categories": [
            "HVAC",
            "Pest Control",
            "Tutoring",
            "Family Dentistry",
            "Landscaping",
            "House Cleaning",
            "Plumbing",
            "Pool Service",
            "Pediatric Dentistry",
            "Home Warranty",
        ],
    },
    "los_gatos": {
        "name": "Los Gatos",
        "zip": "95030",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$200,000+",
        "standard_price": "$700–900",
        "premium_price": "$1,100–1,400",
        "categories": [
            "Med Spa / Aesthetics",
            "Luxury Home Renovation",
            "Pool Service",
            "Cosmetic Dentistry",
            "Landscaping / Hardscaping",
            "House Cleaning (Premium)",
            "Interior Design",
            "Financial Planning",
            "Wine Cellar / Specialty Home",
            "HVAC (Premium Systems)",
        ],
    },
}

COLUMNS = [
    "Category",
    "Business Name",
    "Rating (IDEAL/GOOD/STRONG)",
    "Google Rating",
    "Google Reviews Count",
    "Contact Name",
    "Title",
    "Phone",
    "Email",
    "Website",
    "Address",
    "Years in Business",
    "Serves Target Area",
    "Category Locked",
    "Outreach Status",
    "Email 1 Sent",
    "Email 2 Sent",
    "Email 3 Sent",
    "Phone Call Date",
    "Meeting Date",
    "Proposal Sent",
    "Deposit Received",
    "Final Payment",
    "Notes",
]

OUTREACH_STATUSES = [
    "Not Started",
    "Email 1 Sent",
    "Email 2 Sent",
    "Email 3 Sent",
    "Phone Follow-Up",
    "Meeting Scheduled",
    "Proposal Sent",
    "Negotiating",
    "Signed — Deposit Received",
    "Signed — Paid in Full",
    "Declined",
    "No Response",
]


def generate_tracker(community_key):
    if community_key == "all":
        for key in COMMUNITIES:
            generate_tracker(key)
        return

    if community_key not in COMMUNITIES:
        print(f"Unknown community: {community_key}")
        print(f"Available: {', '.join(COMMUNITIES.keys())}, all")
        sys.exit(1)

    c = COMMUNITIES[community_key]
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"prospect-tracker_{community_key}-{c['zip'].replace('/', '-')}.xlsx"

    rows = []
    for category in c["categories"]:
        for i in range(4):
            row = {col: "" for col in COLUMNS}
            row["Category"] = category
            row["Category Locked"] = "No"
            row["Outreach Status"] = "Not Started"
            row["Serves Target Area"] = "TBD"
            rows.append(row)

    df = pd.DataFrame(rows, columns=COLUMNS)

    with pd.ExcelWriter(filename, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name=c["name"], index=False)

        info_data = {
            "Field": [
                "Community",
                "Zip Code(s)",
                "Tier",
                "Median HHI",
                "Standard Ad Price",
                "Premium Ad Price",
                "Date Generated",
                "",
                "Rating Guide",
                "IDEAL",
                "GOOD",
                "STRONG",
                "",
                "Outreach Status Options",
            ]
            + OUTREACH_STATUSES,
            "Value": [
                c["name"],
                c["zip"],
                c["tier"],
                c["median_hhi"],
                c["standard_price"],
                c["premium_price"],
                today,
                "",
                "",
                "Perfect fit — right category, serves area, strong reviews, decision-maker accessible",
                "Good fit — right category, likely serves area, decent reviews",
                "Worth a call — right category but may need to verify fit",
                "",
                "",
            ]
            + ["" for _ in OUTREACH_STATUSES],
        }
        info_df = pd.DataFrame(info_data)
        info_df.to_excel(writer, sheet_name="Reference", index=False)

    print(f"Tracker generated: {filename}")
    print(f"  Community: {c['name']} ({c['zip']})")
    print(f"  Categories: {len(c['categories'])}")
    print(f"  Rows: {len(rows)} (4 prospect slots per category)")


if __name__ == "__main__":
    community = sys.argv[1] if len(sys.argv) > 1 else "danville"
    generate_tracker(community.lower().replace(" ", "_"))
