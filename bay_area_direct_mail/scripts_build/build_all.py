"""
Build all generated artifacts for the SF Bay Area direct mail kit.

Runs:
    1. Pitch deck for Danville, San Ramon, Pleasanton (python-pptx)
    2. Prospect tracker xlsx files for all communities
    3. CA service agreement docx (template + a sample filled-in version)

Usage:
    python scripts_build/build_all.py
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd: list[str], cwd: Path = ROOT) -> None:
    print(f"\n$ {' '.join(cmd)}")
    res = subprocess.run(cmd, cwd=cwd, check=False)
    if res.returncode != 0:
        sys.exit(res.returncode)


def main():
    py = sys.executable

    for community in ("danville", "san_ramon", "pleasanton"):
        run([py, "deck/build_deck.py", "--community", community])

    run([py, "prospects/build_prospect_tracker.py"])

    run([py, "templates/build_service_agreement.py"])
    run([py, "templates/build_service_agreement.py",
         "--advertiser", "Sycamore Valley Dental",
         "--community", "Danville",
         "--zip", "94526",
         "--total-fee", "700"])

    print("\nAll artifacts built.")


if __name__ == "__main__":
    main()
