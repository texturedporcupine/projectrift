"""
Prospect Tracker Generator — SF Bay Area Shared Postcard Direct Mail

Generates Excel workbooks with one sheet per community. Each sheet has
pre-formatted columns for prospect tracking, category locking, contact
management, and outreach status.

Usage:
    python generate_tracker.py                    # Danville only (default)
    python generate_tracker.py --community danville sanramon
    python generate_tracker.py --all              # All communities
"""

import argparse
from datetime import datetime
from pathlib import Path

import pandas as pd

# ── Community Definitions ────────────────────────────────────────────────────

COMMUNITIES = {
    "danville": {
        "name": "Danville",
        "zip": "94526",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$185,000+",
        "households": "18,000+",
        "standard_price": "$700–900",
        "premium_price": "$1,100–1,400",
        "categories": [
            "HVAC",
            "Landscaping",
            "Pool Service",
            "General Dentist",
            "Med Spa / Aesthetics",
            "House Cleaning",
            "Plumbing",
            "Roofing",
            "Pest Control",
            "Pediatric Dentist",
        ],
    },
    "sanramon": {
        "name": "San Ramon",
        "zip": "94582/94583",
        "tier": "Tier 1–2",
        "median_hhi": "$160,000+",
        "households": "30,000+",
        "standard_price": "$550–750",
        "premium_price": "$850–1,100",
        "categories": [
            "HVAC",
            "Tutoring / Test Prep",
            "Family Dentist",
            "Pest Control",
            "House Cleaning",
            "Landscaping",
            "Med Spa / Aesthetics",
            "Orthodontics",
            "Plumbing",
            "Roofing",
        ],
    },
    "pleasanton": {
        "name": "Pleasanton",
        "zip": "94566/94588",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$155,000+",
        "households": "28,000+",
        "standard_price": "$550–750",
        "premium_price": "$850–1,100",
        "categories": [
            "Pool Service",
            "Landscaping",
            "Orthodontics",
            "House Cleaning",
            "HVAC",
            "Pest Control",
            "General Dentist",
            "Plumbing",
            "Med Spa / Aesthetics",
            "Roofing",
        ],
    },
    "dublin": {
        "name": "Dublin",
        "zip": "94568",
        "tier": "Tier 2 — Strong",
        "median_hhi": "$145,000+",
        "households": "22,000+",
        "standard_price": "$400–600",
        "premium_price": "$650–850",
        "categories": [
            "HVAC",
            "Pest Control",
            "Tutoring / Test Prep",
            "Family Dentist",
            "Landscaping",
            "House Cleaning",
            "Pediatric Dentist",
            "Home Organization",
            "Plumbing",
            "Roofing",
        ],
    },
    "losgatos": {
        "name": "Los Gatos",
        "zip": "95030/95032",
        "tier": "Tier 1 — Premium",
        "median_hhi": "$200,000+",
        "households": "12,000+",
        "standard_price": "$700–900",
        "premium_price": "$1,100–1,400",
        "categories": [
            "Med Spa / Aesthetics",
            "Luxury Home Renovation",
            "Pool Service",
            "General Dentist",
            "Landscaping",
            "House Cleaning",
            "Plumbing",
            "Estate Planning",
            "HVAC",
            "Roofing",
        ],
    },
}

# ── Column Definitions ───────────────────────────────────────────────────────

TRACKER_COLUMNS = [
    "Category",
    "Business Name",
    "Contact Name",
    "Title",
    "Phone",
    "Email",
    "Address",
    "Website",
    "Google Rating",
    "Review Count",
    "Prospect Rating",
    "Category Lock Status",
    "Outreach Status",
    "Email 1 Sent",
    "Email 2 Sent",
    "Email 3 Sent",
    "Phone Call Date",
    "In-Person Visit",
    "Response Notes",
    "Quoted Price",
    "Ad Tier",
    "Deposit Received",
    "Deposit Amount",
    "Proof Approved",
    "Final Payment",
    "Notes",
]

PROSPECT_RATINGS = ["IDEAL", "STRONG", "GOOD", "MAYBE", "SKIP"]
LOCK_STATUSES = ["OPEN", "PITCHED", "VERBAL YES", "DEPOSIT RECEIVED", "LOCKED", "PASSED"]
OUTREACH_STATUSES = [
    "NOT STARTED",
    "EMAIL 1 SENT",
    "EMAIL 2 SENT",
    "EMAIL 3 SENT",
    "PHONE ATTEMPTED",
    "PHONE CONNECTED",
    "MEETING SCHEDULED",
    "PROPOSAL SENT",
    "CLOSED — WON",
    "CLOSED — LOST",
    "FOLLOW UP LATER",
]
AD_TIERS = ["Standard", "Premium"]


def build_community_sheet(community_data: dict) -> pd.DataFrame:
    """Build a pre-populated DataFrame for one community's prospect tracker."""
    rows = []
    for category in community_data["categories"]:
        for i in range(4):
            row = {col: "" for col in TRACKER_COLUMNS}
            row["Category"] = category
            row["Prospect Rating"] = ""
            row["Category Lock Status"] = "OPEN"
            row["Outreach Status"] = "NOT STARTED"
            row["Ad Tier"] = ""
            row["Deposit Received"] = "No"
            row["Proof Approved"] = "No"
            row["Final Payment"] = "No"
            rows.append(row)
    return pd.DataFrame(rows, columns=TRACKER_COLUMNS)


def build_summary_sheet(community_data: dict) -> pd.DataFrame:
    """Build a campaign summary sheet with community metadata."""
    summary = {
        "Field": [
            "Community",
            "ZIP Code(s)",
            "Tier",
            "Median HHI",
            "Total Households",
            "Standard Ad Price",
            "Premium Ad Price",
            "Target Route Households",
            "EDDM Postage Rate",
            "Estimated Postage Cost",
            "Estimated Print Cost",
            "Target Advertisers",
            "Revenue Target (Low)",
            "Revenue Target (High)",
            "Campaign Status",
            "Print Vendor",
            "EDDM Drop Date",
            "DDU Facility",
        ],
        "Value": [
            community_data["name"],
            community_data["zip"],
            community_data["tier"],
            community_data["median_hhi"],
            community_data["households"],
            community_data["standard_price"],
            community_data["premium_price"],
            "5,000–7,000",
            "$0.247/piece",
            "~$1,235–1,729",
            "~$350",
            "6–8",
            "",
            "",
            "PLANNING",
            "",
            "",
            "",
        ],
    }
    return pd.DataFrame(summary)


def build_category_status_sheet(community_data: dict) -> pd.DataFrame:
    """Build a category lock status overview sheet."""
    rows = []
    for category in community_data["categories"]:
        rows.append(
            {
                "Category": category,
                "Status": "OPEN",
                "Locked Business": "",
                "Contact": "",
                "Price Agreed": "",
                "Deposit": "No",
                "Proof": "No",
                "Final": "No",
            }
        )
    return pd.DataFrame(rows)


def generate_tracker(community_keys: list[str], output_dir: str = "."):
    """Generate an Excel workbook with prospect tracker sheets."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    for key in community_keys:
        if key not in COMMUNITIES:
            print(f"Unknown community: {key}. Skipping.")
            continue

        community = COMMUNITIES[key]
        today = datetime.now().strftime("%Y-%m-%d")
        filename = (
            f"prospect-tracker_{community['name'].lower().replace(' ', '-')}"
            f"-{community['zip'].split('/')[0]}_{today}.xlsx"
        )
        filepath = output_path / filename

        with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
            summary_df = build_summary_sheet(community)
            summary_df.to_excel(writer, sheet_name="Campaign Summary", index=False)

            status_df = build_category_status_sheet(community)
            status_df.to_excel(
                writer, sheet_name="Category Status", index=False
            )

            tracker_df = build_community_sheet(community)
            tracker_df.to_excel(
                writer, sheet_name=f"{community['name']} Prospects", index=False
            )

            # Auto-adjust column widths
            for sheet_name in writer.sheets:
                ws = writer.sheets[sheet_name]
                for column_cells in ws.columns:
                    max_length = 0
                    column_letter = column_cells[0].column_letter
                    for cell in column_cells:
                        if cell.value:
                            max_length = max(max_length, len(str(cell.value)))
                    ws.column_dimensions[column_letter].width = min(
                        max_length + 4, 30
                    )

        print(f"Generated: {filepath}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate prospect tracker Excel workbooks for Bay Area communities"
    )
    parser.add_argument(
        "--community",
        nargs="+",
        default=["danville"],
        help="Community key(s): danville, sanramon, pleasanton, dublin, losgatos",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Generate trackers for all communities",
    )
    parser.add_argument(
        "--output",
        default=".",
        help="Output directory (default: current directory)",
    )

    args = parser.parse_args()

    if args.all:
        keys = list(COMMUNITIES.keys())
    else:
        keys = args.community

    generate_tracker(keys, args.output)


if __name__ == "__main__":
    main()
