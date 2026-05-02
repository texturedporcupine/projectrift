# SF Bay Area Shared Postcard Direct Mail — Build Kit

Adapted from the Austin TX playbook. Everything an operator (or Cursor) needs to
launch a Bay Area shared-postcard EDDM campaign.

## Quick Start

```bash
cd bay_area_direct_mail

# Build all generated artifacts (deck + trackers)
python scripts_build/build_all.py

# Or build pieces individually
python deck/build_deck.py                          # generates deck/pitch-deck_bayarea.pptx
python prospects/build_prospect_tracker.py        # generates prospect-tracker_*.xlsx
python templates/build_service_agreement.py       # generates service_agreement_ca.docx
```

## Folder Map

| Folder | Contents |
|---|---|
| `CURSOR_CONTEXT.md` | Drop-in project context block for Cursor / Claude |
| `docs/` | CA business plan, Bay Area communities guide |
| `sales/` | Universal objection handler, pricing tiers |
| `prospects/` | Excel prospect tracker generator + sample sheets |
| `deck/` | 5-slide pitch deck generator (python-pptx) |
| `emails/` | 3-email outreach sequence (markdown) |
| `scripts/` | 10 category-specific pitch scripts |
| `templates/` | Service agreement (CA), creative brief |
| `app/` | EatTheElephant.jsx task tracker (Bay Area version) |
| `scripts_build/` | Build orchestration (build_all.py, cowork_instructions.md) |

## Build Order (recommended)

1. `docs/bay_area_communities_guide.md` — foundation everything else references.
2. `deck/build_deck.py` -> visual sell sheet for in-person meetings.
3. `emails/` — start prospecting while the rest of the docs are produced.
4. `prospects/build_prospect_tracker.py` — clone for your first community.
5. `scripts/` — one per business category.
6. `app/EatTheElephant.jsx` + `scripts_build/cowork_instructions.md` — last.

## Getting Started Today

1. **File your CA FBN** with your county recorder.
2. Go to **eddm.usps.com** and enter **94526** (Danville).
3. Pick **2-3 routes** totaling 5,000-7,000 households. Note the household counts.
4. Build a **30-business prospect list** in `prospects/prospect-tracker_danville-94526.xlsx`.
5. Send Email #1 from `emails/email_1_cold_opener.md` to your first 10 prospects.

The rest follows.
