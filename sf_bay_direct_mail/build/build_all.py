"""Run every Bay Area generator in the build/ folder."""
import importlib
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

GENERATORS = [
    "generate_communities_guide",
    "generate_business_plan",
    "generate_pitch_deck",
    "generate_trackers",
    "generate_agreement",
    "generate_creative_brief",
    "generate_pitch_scripts",
]


def main():
    for name in GENERATORS:
        mod = importlib.import_module(name)
        print(f"\n=== {name} ===")
        mod.main()


if __name__ == "__main__":
    main()
