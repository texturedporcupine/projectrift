"""Campaign operations helper for the California direct-mail toolkit.

The script is intentionally local-first. It does not scrape, email, charge,
file government paperwork, or submit USPS forms. It prepares repeatable
artifacts from CSV/JSON inputs so the operator can review and execute the
parts that legally or commercially require human judgment.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from string import Template
from typing import Iterable


BASE = Path(__file__).resolve().parents[1]
WORKFLOW_PATH = BASE / "automation" / "campaign_workflow.json"
OUTREACH_TEMPLATE_PATH = BASE / "outreach" / "three_email_sequence.md"
AGREEMENT_TEMPLATE_PATH = BASE / "agreements" / "service_agreement_ca.md"
POSTAGE_RATE = 0.247
PRINT_COST_PER_PIECE = 0.07
MISC_COST = 100.0


@dataclass(frozen=True)
class Campaign:
    community: str
    zips: str
    tier: str
    household_count: int
    standard_price: float
    premium_price: float
    target_advertisers: int


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def load_campaign(path: Path) -> Campaign:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = {
        "community",
        "zips",
        "tier",
        "household_count",
        "standard_price",
        "premium_price",
        "target_advertisers",
    }
    missing = sorted(required - set(data))
    if missing:
        raise ValueError(f"Missing campaign fields: {', '.join(missing)}")

    return Campaign(
        community=str(data["community"]),
        zips=str(data["zips"]),
        tier=str(data["tier"]),
        household_count=int(data["household_count"]),
        standard_price=float(data["standard_price"]),
        premium_price=float(data["premium_price"]),
        target_advertisers=int(data["target_advertisers"]),
    )


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def write_csv(
    path: Path, rows: Iterable[dict[str, object]], fieldnames: list[str]
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def campaign_summary(
    campaign: Campaign, advertisers_sold: int | None = None
) -> dict[str, float]:
    advertisers = advertisers_sold or campaign.target_advertisers
    revenue = advertisers * campaign.standard_price
    postage = campaign.household_count * POSTAGE_RATE
    printing = campaign.household_count * PRINT_COST_PER_PIECE
    total_cost = postage + printing + MISC_COST
    deposit_due = campaign.standard_price * 0.5
    final_due = campaign.standard_price * 0.5
    return {
        "advertisers": advertisers,
        "revenue": revenue,
        "postage": postage,
        "printing": printing,
        "misc": MISC_COST,
        "total_cost": total_cost,
        "estimated_net": revenue - total_cost,
        "deposit_due_per_ad": deposit_due,
        "final_due_per_ad": final_due,
    }


def render_checklist(campaign: Campaign, output_path: Path) -> None:
    workflow = json.loads(WORKFLOW_PATH.read_text(encoding="utf-8"))
    economics = campaign_summary(campaign)
    lines = [
        f"# Campaign Checklist - {campaign.community}",
        "",
        f"- Zip code(s): {campaign.zips}",
        f"- Tier: {campaign.tier}",
        f"- Household count: {campaign.household_count:,}",
        f"- Standard price: ${campaign.standard_price:,.0f}",
        f"- Premium price: ${campaign.premium_price:,.0f}",
        f"- Target advertisers: {campaign.target_advertisers}",
        f"- Estimated postage: ${economics['postage']:,.2f}",
        f"- Estimated printing: ${economics['printing']:,.2f}",
        f"- Estimated campaign net at target fill: ${economics['estimated_net']:,.2f}",
        "",
        "## Manual vs automated workflow",
        "",
    ]

    for phase in workflow["phases"]:
        lines.append(f"### {phase['name']}")
        lines.append("")
        for task in phase["tasks"]:
            owner = task["owner"].upper()
            lines.append(f"- [ ] **{owner}:** {task['task']}")
            if task.get("automation"):
                lines.append(f"  - Automation: {task['automation']}")
            if task.get("manual_reason"):
                lines.append(f"  - Manual reason: {task['manual_reason']}")
        lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")


def normalize_prospect(row: dict[str, str]) -> dict[str, str]:
    normalized = {
        key.strip().lower().replace(" ", "_"): value.strip()
        for key, value in row.items()
    }
    first_name = normalized.get("first_name", "")
    if not first_name and normalized.get("contact_name"):
        first_name = normalized["contact_name"].split()[0]

    return {
        "business_name": normalized.get(
            "business_name", normalized.get("business", "")
        ),
        "category": normalized.get("category", ""),
        "first_name": first_name,
        "email": normalized.get("email", ""),
        "average_value": normalized.get(
            "average_value", normalized.get("average_customer_value", "")
        ),
        "price": normalized.get("price", ""),
        "premium_price": normalized.get(
            "premium_price", normalized.get("price_premium", "")
        ),
        "exclusivity_status": normalized.get("exclusivity_status", "OPEN").upper(),
        "outreach_status": normalized.get("outreach_status", "Not started"),
        "notes": normalized.get("notes", ""),
    }


def assert_required_prospect_fields(prospect: dict[str, str], row_number: int) -> None:
    missing = [
        field
        for field in ["business_name", "category", "first_name", "email"]
        if not prospect.get(field)
    ]
    if missing:
        raise ValueError(f"Prospect row {row_number} missing: {', '.join(missing)}")


def validate_prospects(prospects_path: Path, output_path: Path) -> None:
    rows = read_csv(prospects_path)
    normalized_rows = [normalize_prospect(row) for row in rows]
    issues: list[str] = []
    warnings: list[str] = []
    seen_emails: dict[str, int] = {}
    locked_by_category: dict[str, list[str]] = {}
    category_counts: dict[str, int] = {}

    for row_number, prospect in enumerate(normalized_rows, start=2):
        try:
            assert_required_prospect_fields(prospect, row_number)
        except ValueError as exc:
            issues.append(str(exc))

        category = prospect.get("category") or "Uncategorized"
        category_counts[category] = category_counts.get(category, 0) + 1

        email = prospect.get("email", "").lower()
        if email:
            if email in seen_emails:
                issues.append(
                    f"Prospect row {row_number} duplicates email from row {seen_emails[email]}: {email}"
                )
            seen_emails[email] = row_number

        if not prospect.get("average_value"):
            warnings.append(
                f"Prospect row {row_number} has no average customer value for ROI framing."
            )
        if not prospect.get("price"):
            warnings.append(
                f"Prospect row {row_number} has no explicit price; campaign default will be used."
            )
        if prospect.get("exclusivity_status") in {"LOCKED", "HELD"}:
            locked_by_category.setdefault(category, []).append(
                prospect["business_name"]
            )

    for category, names in locked_by_category.items():
        if len(names) > 1:
            issues.append(
                f"Category {category} has multiple held/locked prospects: {', '.join(names)}"
            )

    lines = [
        f"# Prospect Validation - {prospects_path.name}",
        "",
        f"- Rows reviewed: {len(normalized_rows)}",
        f"- Categories represented: {len(category_counts)}",
        f"- Blocking issues: {len(issues)}",
        f"- Warnings: {len(warnings)}",
        "",
        "## Category counts",
        "",
    ]
    for category, count in sorted(category_counts.items()):
        lines.append(f"- {category}: {count}")

    lines.extend(["", "## Blocking issues", ""])
    lines.extend([f"- {issue}" for issue in issues] or ["- None"])
    lines.extend(["", "## Warnings", ""])
    lines.extend([f"- {warning}" for warning in warnings] or ["- None"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def export_category_locks(prospects_path: Path, output_path: Path) -> None:
    rows = [normalize_prospect(row) for row in read_csv(prospects_path)]
    by_category: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        by_category.setdefault(row["category"] or "Uncategorized", []).append(row)

    report_rows = []
    for category, prospects in sorted(by_category.items()):
        held_or_locked = [
            prospect
            for prospect in prospects
            if prospect["exclusivity_status"] in {"HELD", "LOCKED"}
        ]
        if len(held_or_locked) > 1:
            status = "CONFLICT"
        elif held_or_locked:
            status = held_or_locked[0]["exclusivity_status"]
        else:
            status = "OPEN"
        report_rows.append(
            {
                "category": category,
                "status": status,
                "held_or_locked_business": ", ".join(
                    prospect["business_name"] for prospect in held_or_locked
                ),
                "prospects_in_category": len(prospects),
                "next_action": "Resolve conflict"
                if status == "CONFLICT"
                else "Collect deposit"
                if status == "HELD"
                else "Proof and final payment"
                if status == "LOCKED"
                else "Continue outreach",
            }
        )

    write_csv(
        output_path,
        report_rows,
        [
            "category",
            "status",
            "held_or_locked_business",
            "prospects_in_category",
            "next_action",
        ],
    )


def extract_email_templates() -> list[tuple[str, str]]:
    content = OUTREACH_TEMPLATE_PATH.read_text(encoding="utf-8")
    sections = re.split(r"\n## Email \d - ", content)
    templates = []
    for index, section in enumerate(sections[1:], start=1):
        body_match = re.search(
            r"\*\*Body\*\*\n\n(?P<body>.*?)(?=\n## Email|\n## Phone|\Z)", section, re.S
        )
        if not body_match:
            continue
        templates.append((f"email{index}", body_match.group("body").strip()))
    return templates


def personalize_text(text: str, prospect: dict[str, str], campaign: Campaign) -> str:
    replacements = {
        "[first name]": prospect["first_name"],
        "[business name]": prospect["business_name"],
        "[category]": prospect["category"],
        "[community]": campaign.community,
        "[price]": f"${float(prospect.get('price') or campaign.standard_price):,.0f}",
        "[premium price]": f"${float(prospect.get('premium_price') or campaign.premium_price):,.0f}",
        "[average value]": prospect.get("average_value") or "$500-$1,500",
        "[sender name]": "$sender_name",
    }
    personalized = text
    for placeholder, value in replacements.items():
        personalized = personalized.replace(placeholder, value)
    return personalized


def render_outreach(
    campaign: Campaign, prospects_path: Path, output_dir: Path, sender_name: str
) -> None:
    templates = extract_email_templates()
    rows = read_csv(prospects_path)
    output_dir.mkdir(parents=True, exist_ok=True)

    for row_number, row in enumerate(rows, start=2):
        prospect = normalize_prospect(row)
        assert_required_prospect_fields(prospect, row_number)
        for template_name, template_body in templates:
            body = personalize_text(template_body, prospect, campaign)
            body = Template(body).safe_substitute(sender_name=sender_name)
            file_name = (
                f"outreach_{slugify(prospect['business_name'])}_{template_name}.md"
            )
            output_path = output_dir / file_name
            output_path.write_text(body + "\n", encoding="utf-8")


def render_agreements(
    campaign: Campaign, prospects_path: Path, output_dir: Path, provider_name: str
) -> None:
    template = AGREEMENT_TEMPLATE_PATH.read_text(encoding="utf-8")
    rows = read_csv(prospects_path)
    output_dir.mkdir(parents=True, exist_ok=True)

    for row_number, row in enumerate(rows, start=2):
        prospect = normalize_prospect(row)
        assert_required_prospect_fields(prospect, row_number)
        amount = float(prospect.get("price") or campaign.standard_price)
        rendered = template
        rendered = rendered.replace("[Provider legal name]", provider_name)
        rendered = rendered.replace(
            "[FBN name if applicable]", "FBN name if applicable"
        )
        rendered = rendered.replace(
            "[Advertiser legal name]", prospect["business_name"]
        )
        rendered = rendered.replace("[Community]", campaign.community)
        rendered = rendered.replace("[Zip codes]", campaign.zips)
        rendered = rendered.replace("[Category]", prospect["category"])
        rendered = rendered.replace("$[amount]", f"${amount:,.0f}")
        file_name = f"agreement_{slugify(prospect['business_name'])}_{slugify(campaign.community)}.md"
        (output_dir / file_name).write_text(rendered, encoding="utf-8")


def export_financials(campaign: Campaign, output_path: Path) -> None:
    scenarios = [
        ("conservative", max(1, campaign.target_advertisers - 1)),
        ("target", campaign.target_advertisers),
        ("full", 8),
    ]
    rows = []
    for scenario, ads_sold in scenarios:
        economics = campaign_summary(campaign, ads_sold)
        rows.append(
            {
                "scenario": scenario,
                "ads_sold": ads_sold,
                "revenue": round(economics["revenue"], 2),
                "postage": round(economics["postage"], 2),
                "printing": round(economics["printing"], 2),
                "misc": round(economics["misc"], 2),
                "total_cost": round(economics["total_cost"], 2),
                "estimated_net": round(economics["estimated_net"], 2),
                "deposit_due_per_ad": round(economics["deposit_due_per_ad"], 2),
                "final_due_per_ad": round(economics["final_due_per_ad"], 2),
            }
        )
    write_csv(
        output_path,
        rows,
        [
            "scenario",
            "ads_sold",
            "revenue",
            "postage",
            "printing",
            "misc",
            "total_cost",
            "estimated_net",
            "deposit_due_per_ad",
            "final_due_per_ad",
        ],
    )


def init_campaign(output_path: Path) -> None:
    sample = {
        "community": "Danville",
        "zips": "94526",
        "tier": "1",
        "household_count": 5000,
        "standard_price": 700,
        "premium_price": 1100,
        "target_advertisers": 6,
        "created_at": date.today().isoformat(),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(sample, indent=2) + "\n", encoding="utf-8")


def init_prospects(output_path: Path) -> None:
    rows = [
        {
            "business_name": "Example HVAC Co",
            "category": "HVAC",
            "first_name": "Alex",
            "email": "alex@example.com",
            "average_value": "$1,200",
            "price": "700",
            "premium_price": "1100",
            "exclusivity_status": "OPEN",
            "outreach_status": "Not started",
            "notes": "Replace with verified local prospect.",
        }
    ]
    write_csv(
        output_path,
        rows,
        [
            "business_name",
            "category",
            "first_name",
            "email",
            "average_value",
            "price",
            "premium_price",
            "exclusivity_status",
            "outreach_status",
            "notes",
        ],
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate direct-mail campaign operating artifacts."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    init = subparsers.add_parser(
        "init", help="Create sample campaign JSON and prospect CSV inputs."
    )
    init.add_argument(
        "--campaign", type=Path, default=BASE / "campaigns" / "danville_94526.json"
    )
    init.add_argument(
        "--prospects", type=Path, default=BASE / "campaigns" / "danville_prospects.csv"
    )

    checklist = subparsers.add_parser(
        "checklist", help="Render a manual/automation campaign checklist."
    )
    checklist.add_argument("--campaign", type=Path, required=True)
    checklist.add_argument("--output", type=Path, required=True)

    outreach = subparsers.add_parser(
        "outreach", help="Personalize outreach email drafts."
    )
    outreach.add_argument("--campaign", type=Path, required=True)
    outreach.add_argument("--prospects", type=Path, required=True)
    outreach.add_argument("--output-dir", type=Path, required=True)
    outreach.add_argument("--sender-name", required=True)

    validate = subparsers.add_parser(
        "validate-prospects", help="Validate a prospect CSV."
    )
    validate.add_argument("--prospects", type=Path, required=True)
    validate.add_argument("--output", type=Path, required=True)

    locks = subparsers.add_parser(
        "category-locks", help="Export category lock status as CSV."
    )
    locks.add_argument("--prospects", type=Path, required=True)
    locks.add_argument("--output", type=Path, required=True)

    agreements = subparsers.add_parser(
        "agreements", help="Personalize agreement markdown drafts."
    )
    agreements.add_argument("--campaign", type=Path, required=True)
    agreements.add_argument("--prospects", type=Path, required=True)
    agreements.add_argument("--output-dir", type=Path, required=True)
    agreements.add_argument("--provider-name", required=True)

    financials = subparsers.add_parser(
        "financials", help="Export campaign economics scenarios as CSV."
    )
    financials.add_argument("--campaign", type=Path, required=True)
    financials.add_argument("--output", type=Path, required=True)

    return parser


def main() -> None:
    args = build_parser().parse_args()

    if args.command == "init":
        init_campaign(args.campaign)
        init_prospects(args.prospects)
        print(f"Wrote {args.campaign}")
        print(f"Wrote {args.prospects}")
        return

    if args.command == "validate-prospects":
        validate_prospects(args.prospects, args.output)
        return

    if args.command == "category-locks":
        export_category_locks(args.prospects, args.output)
        return

    campaign = load_campaign(args.campaign)

    if args.command == "checklist":
        render_checklist(campaign, args.output)
    elif args.command == "outreach":
        render_outreach(campaign, args.prospects, args.output_dir, args.sender_name)
    elif args.command == "agreements":
        render_agreements(campaign, args.prospects, args.output_dir, args.provider_name)
    elif args.command == "financials":
        export_financials(campaign, args.output)
    else:
        raise ValueError(f"Unknown command: {args.command}")


if __name__ == "__main__":
    main()
