#!/usr/bin/env python3
"""Build pandas-compatible prospect tracker workbooks (one sheet per community)."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

COLUMNS = [
    "business_name",
    "category",
    "rating",
    "contact_name",
    "phone",
    "email",
    "address",
    "notes",
    "category_locked",
    "outreach_status",
    "last_contact",
]

SAMPLE_ROWS = [
    {
        "business_name": "[Example — replace]",
        "category": "HVAC",
        "rating": "IDEAL",
        "contact_name": "",
        "phone": "",
        "email": "",
        "address": "",
        "notes": "",
        "category_locked": "",
        "outreach_status": "not_contacted",
        "last_contact": "",
    }
]


def sheet_for_community(name: str, zips: str) -> pd.DataFrame:
    df = pd.DataFrame(SAMPLE_ROWS, columns=COLUMNS)
    df.attrs["community"] = name
    df.attrs["zips"] = zips
    return df


def build_workbook(path: Path, communities: list[tuple[str, str]]) -> None:
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        for name, zips in communities:
            safe_name = name.replace("/", "-")[:31]
            df = sheet_for_community(name, zips)
            df.to_excel(writer, sheet_name=safe_name, index=False)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build prospect tracker xlsx files.")
    parser.add_argument(
        "-o",
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "trackers",
        help="Output directory",
    )
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    danville = args.output_dir / "prospect-tracker_Danville-94526.xlsx"
    san_ramon = args.output_dir / "prospect-tracker_San-Ramon-94582-83.xlsx"

    build_workbook(
        danville,
        [("Danville", "94526")],
    )
    build_workbook(
        san_ramon,
        [("San Ramon 94582", "94582"), ("San Ramon 94583", "94583")],
    )
    print(f"Wrote {danville}")
    print(f"Wrote {san_ramon}")


if __name__ == "__main__":
    main()
