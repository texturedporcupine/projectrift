"""
Build the 5-slide Bay Area pitch deck (python-pptx).

Mirrors the structure used by the Austin pptxgenjs build:
    Slide 1: Hook / cover
    Slide 2: Community stats
    Slide 3: How it works + exclusivity
    Slide 4: ROI calculator + break-even math
    Slide 5: Pricing + close

Quirk note (carried over): use solid hex fills only on dark backgrounds; no
fill transparency.

Usage:
    python deck/build_deck.py                        # default: Danville
    python deck/build_deck.py --community san_ramon  # see COMMUNITY_PROFILES below
"""
from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt


NAVY = RGBColor(0x0B, 0x1F, 0x3A)
GOLD = RGBColor(0xD4, 0xA8, 0x4B)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xF4, 0xEF, 0xE6)
SLATE = RGBColor(0x32, 0x44, 0x66)
ACCENT = RGBColor(0xC9, 0x57, 0x4A)


COMMUNITY_PROFILES = {
    "danville": {
        "name": "Danville, CA",
        "zip": "94526",
        "tier": "Tier 1",
        "med_hhi": "$185K+",
        "homes": "18,000+",
        "homeownership": "~80%",
        "schools": "SRVUSD (top 5% in CA)",
        "ad_floor": 700,
        "ad_ceiling": 900,
        "premium": "$1,100-$1,400",
        "categories": "HVAC, landscape, pool, dentist, med spa",
        "anchor": "Blackhawk + Diablo + downtown Hartz Ave.",
        "hh_per_drop": 6000,
    },
    "san_ramon": {
        "name": "San Ramon, CA",
        "zip": "94582 / 94583",
        "tier": "Tier 1-2",
        "med_hhi": "$160K+",
        "homes": "30,000+",
        "homeownership": "~73%",
        "schools": "SRVUSD",
        "ad_floor": 550,
        "ad_ceiling": 800,
        "premium": "$850-$1,100",
        "categories": "HVAC, tutoring, family dentist, pest ctrl",
        "anchor": "Dougherty Valley + Bishop Ranch corridor",
        "hh_per_drop": 6000,
    },
    "pleasanton": {
        "name": "Pleasanton, CA",
        "zip": "94566 / 94588",
        "tier": "Tier 2",
        "med_hhi": "$155K+",
        "homes": "28,000+",
        "homeownership": "~70%",
        "schools": "PUSD",
        "ad_floor": 550,
        "ad_ceiling": 750,
        "premium": "$850-$1,100",
        "categories": "Pool, landscape, ortho, cleaning, HVAC",
        "anchor": "Ruby Hill + downtown Main Street",
        "hh_per_drop": 6000,
    },
    "los_gatos": {
        "name": "Los Gatos, CA",
        "zip": "95030 / 95032",
        "tier": "Tier 1",
        "med_hhi": "$200K+",
        "homes": "12,000+",
        "homeownership": "~70%",
        "schools": "LGUSD",
        "ad_floor": 700,
        "ad_ceiling": 900,
        "premium": "$1,100-$1,400",
        "categories": "Med spa, luxury reno, pool, dentist, landscape",
        "anchor": "Santa Cruz Ave. + Los Gatos Blvd.",
        "hh_per_drop": 5500,
    },
    "saratoga": {
        "name": "Saratoga, CA",
        "zip": "95070",
        "tier": "Tier 1 Premium",
        "med_hhi": "$250K+",
        "homes": "10,000+",
        "homeownership": "~83%",
        "schools": "Saratoga Union",
        "ad_floor": 850,
        "ad_ceiling": 1100,
        "premium": "$1,400-$1,800",
        "categories": "Luxury reno, med spa, estate planning, fine landscape",
        "anchor": "Big Basin Way + Saratoga Village",
        "hh_per_drop": 5000,
    },
}


def slide_blank(prs: Presentation):
    return prs.slides.add_slide(prs.slide_layouts[6])  # blank layout


def add_rect(slide, left, top, width, height, fill=NAVY, line=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
    shape.shadow.inherit = False
    return shape


def add_text(slide, left, top, width, height, text, *,
             font_size=18, bold=False, color=WHITE, align=PP_ALIGN.LEFT,
             anchor=MSO_ANCHOR.TOP, font="Calibri"):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    lines = text.split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = color
        run.font.name = font
    return tb


def add_footer(slide, prs, idx, total, label):
    add_rect(slide, Inches(0), prs.slide_height - Inches(0.35),
             prs.slide_width, Inches(0.35), fill=NAVY)
    add_text(slide, Inches(0.4), prs.slide_height - Inches(0.32),
             Inches(8), Inches(0.3),
             label, font_size=10, color=GOLD, align=PP_ALIGN.LEFT)
    add_text(slide, prs.slide_width - Inches(2.4),
             prs.slide_height - Inches(0.32),
             Inches(2), Inches(0.3),
             f"{idx} / {total}", font_size=10, color=GOLD,
             align=PP_ALIGN.RIGHT)


def build_slide_1_cover(prs, c):
    s = slide_blank(prs)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, prs.slide_height,
             fill=NAVY)
    add_rect(s, Inches(0), Inches(0), Inches(0.35), prs.slide_height,
             fill=GOLD)
    add_text(s, Inches(0.8), Inches(0.6), Inches(8.4), Inches(0.5),
             "SF BAY AREA DIRECT MAIL", font_size=14, bold=True,
             color=GOLD, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.8), Inches(1.4), Inches(11), Inches(2.0),
             "Reach every door in\n" + c["name"] + ".",
             font_size=54, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.8), Inches(4.2), Inches(11), Inches(0.6),
             f"One advertiser per category. {c['hh_per_drop']:,} households "
             "per drop. Exclusive — by design.",
             font_size=22, color=LIGHT, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.8), Inches(5.4), Inches(11), Inches(0.5),
             f"{c['tier']}  |  {c['zip']}  |  Med. HHI {c['med_hhi']}",
             font_size=18, bold=True, color=GOLD, align=PP_ALIGN.LEFT)
    add_footer(s, prs, 1, 5, c["name"] + " — Shared Postcard Direct Mail")


def stat_block(slide, left, top, width, height, big, label):
    add_rect(slide, left, top, width, height, fill=WHITE,
             line=RGBColor(0xE0, 0xD8, 0xC8))
    add_text(slide, left, top + Inches(0.2), width, Inches(0.9),
             big, font_size=36, bold=True, color=NAVY,
             align=PP_ALIGN.CENTER)
    add_text(slide, left, top + Inches(1.05), width, Inches(0.5),
             label, font_size=12, color=SLATE, align=PP_ALIGN.CENTER)


def build_slide_2_community(prs, c):
    s = slide_blank(prs)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, prs.slide_height,
             fill=LIGHT)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, Inches(0.95), fill=NAVY)
    add_text(s, Inches(0.5), Inches(0.18), Inches(11), Inches(0.6),
             c["name"] + " — by the numbers",
             font_size=26, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(0.55), Inches(11), Inches(0.4),
             f"{c['tier']} community  |  Zip {c['zip']}",
             font_size=12, color=GOLD, align=PP_ALIGN.LEFT)
    bw = Inches(2.85); bh = Inches(1.7); top = Inches(1.4); left = Inches(0.5)
    stat_block(s, left,                  top, bw, bh, c["med_hhi"], "Median household income")
    stat_block(s, left + Inches(3.0),    top, bw, bh, c["homes"], "Households in community")
    stat_block(s, left + Inches(6.0),    top, bw, bh, c["homeownership"], "Homeownership rate")
    stat_block(s, left + Inches(9.0),    top, bw, bh, f"{c['hh_per_drop']:,}", "HHs reached per drop")
    add_text(s, Inches(0.5), Inches(3.5), Inches(12.3), Inches(0.5),
             "Why this community fits the model",
             font_size=18, bold=True, color=NAVY, align=PP_ALIGN.LEFT)
    bullets = (
        f"• Anchor neighborhoods: {c['anchor']}\n"
        f"• Schools: {c['schools']} — long-tenured, mail-reading families\n"
        "• Active HOAs and a community newsletter culture\n"
        f"• Strong demand verticals: {c['categories']}\n"
        "• 2-3 EDDM carrier routes deliver ~6,000 households per drop"
    )
    add_text(s, Inches(0.5), Inches(4.1), Inches(12.3), Inches(2.6),
             bullets, font_size=16, color=SLATE, align=PP_ALIGN.LEFT)
    add_footer(s, prs, 2, 5, c["name"] + " — Shared Postcard Direct Mail")


def build_slide_3_how_it_works(prs, c):
    s = slide_blank(prs)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, prs.slide_height, fill=WHITE)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, Inches(0.95), fill=NAVY)
    add_text(s, Inches(0.5), Inches(0.18), Inches(12), Inches(0.6),
             "How it works — and why it works",
             font_size=26, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(0.55), Inches(12), Inches(0.4),
             "One business per category per postcard. Exclusivity is the product.",
             font_size=12, color=GOLD, align=PP_ALIGN.LEFT)
    steps = [
        ("1", "Pick the community", f"Lock 2-3 EDDM routes in {c['name']} ({c['zip']})."),
        ("2", "Lock category exclusivity", "One HVAC, one dentist, one pool, one med spa..."),
        ("3", "Design + proof + print", "8.5x11, 14pt cardstock. Sign-off from every advertiser."),
        ("4", "EDDM drop at the DDU", f"~{c['hh_per_drop']:,} households at $0.247/piece postage."),
        ("5", "Renew & expand", "2-week follow-up. Multi-campaign discount. Compounding pipeline."),
    ]
    top = Inches(1.4)
    for i, (num, title, body) in enumerate(steps):
        y = top + Inches(0.95) * i
        circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.5), y,
                                  Inches(0.7), Inches(0.7))
        circ.fill.solid()
        circ.fill.fore_color.rgb = GOLD
        circ.line.fill.background()
        add_text(s, Inches(0.5), y, Inches(0.7), Inches(0.7),
                 num, font_size=22, bold=True, color=NAVY,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, Inches(1.4), y + Inches(0.03), Inches(11.5), Inches(0.4),
                 title, font_size=18, bold=True, color=NAVY,
                 align=PP_ALIGN.LEFT)
        add_text(s, Inches(1.4), y + Inches(0.42), Inches(11.5), Inches(0.45),
                 body, font_size=14, color=SLATE, align=PP_ALIGN.LEFT)
    add_footer(s, prs, 3, 5, c["name"] + " — Shared Postcard Direct Mail")


def build_slide_4_roi(prs, c):
    s = slide_blank(prs)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, prs.slide_height, fill=LIGHT)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, Inches(0.95), fill=NAVY)
    add_text(s, Inches(0.5), Inches(0.18), Inches(12), Inches(0.6),
             "ROI math — your side of the postcard",
             font_size=26, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(0.55), Inches(12), Inches(0.4),
             "Conservative response, Bay Area pricing assumptions.",
             font_size=12, color=GOLD, align=PP_ALIGN.LEFT)
    avg_price = (c["ad_floor"] + c["ad_ceiling"]) // 2
    drop = c["hh_per_drop"]
    rate_low = 0.005   # 0.5% response
    rate_high = 0.015  # 1.5% response
    leads_low = int(drop * rate_low)
    leads_high = int(drop * rate_high)
    rows = [
        ("Households reached this drop", f"{drop:,}"),
        ("Your ad space (Tier average)", f"${avg_price:,}"),
        ("Conservative response (0.5%)", f"{leads_low} calls / clicks"),
        ("Strong response (1.5%)", f"{leads_high} calls / clicks"),
        ("If 5% of those leads convert at $400 avg job",
         f"${int(leads_low*0.05*400):,} - ${int(leads_high*0.05*400):,}"),
        ("Cost per impression", f"${avg_price/drop:.3f}"),
        ("Break-even at 1 closed job",
         "Yes, on most categories"),
    ]
    top = Inches(1.4)
    rh = Inches(0.55)
    add_rect(s, Inches(0.5), top, Inches(12.3), rh, fill=NAVY)
    add_text(s, Inches(0.7), top, Inches(7.5), rh,
             "Metric", font_size=14, bold=True, color=WHITE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(8.4), top, Inches(4.2), rh,
             "Estimate", font_size=14, bold=True, color=GOLD,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    for i, (k, v) in enumerate(rows):
        y = top + rh * (i + 1)
        bg = WHITE if i % 2 == 0 else RGBColor(0xEC, 0xE5, 0xD4)
        add_rect(s, Inches(0.5), y, Inches(12.3), rh,
                 fill=bg, line=RGBColor(0xD8, 0xCE, 0xB6))
        add_text(s, Inches(0.7), y, Inches(7.5), rh,
                 k, font_size=13, color=SLATE,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, Inches(8.4), y, Inches(4.2), rh,
                 v, font_size=14, bold=True, color=NAVY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.5), Inches(6.4), Inches(12.3), Inches(0.6),
             "One closed job typically pays for the ad. Everything after is "
             "margin — for a year.",
             font_size=14, bold=True, color=ACCENT, align=PP_ALIGN.LEFT)
    add_footer(s, prs, 4, 5, c["name"] + " — Shared Postcard Direct Mail")


def build_slide_5_pricing(prs, c):
    s = slide_blank(prs)
    add_rect(s, Inches(0), Inches(0), prs.slide_width, prs.slide_height, fill=NAVY)
    add_text(s, Inches(0.5), Inches(0.5), Inches(12), Inches(0.6),
             "Pricing — and what you walk away with today",
             font_size=26, bold=True, color=WHITE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(1.0), Inches(12), Inches(0.4),
             "All prices include design, proof rounds, print, and EDDM delivery.",
             font_size=13, color=GOLD, align=PP_ALIGN.LEFT)
    cards = [
        {
            "name": "Standard",
            "price": f"${c['ad_floor']}-${c['ad_ceiling']}",
            "subtitle": "1 of 6-8 ad slots",
            "bullets": [
                "Category exclusivity for the campaign",
                "Logo + offer + phone + URL + QR",
                "Front or back placement, balanced",
                "All design + print + delivery included",
            ],
            "color": SLATE,
        },
        {
            "name": "Premium placement",
            "price": c["premium"],
            "subtitle": "Back panel or featured anchor",
            "bullets": [
                "Largest ad block on the postcard",
                "First-page mention in cover panel",
                "Right-of-first-refusal on next campaign",
                "All design + print + delivery included",
            ],
            "color": GOLD,
        },
        {
            "name": "Renewal partner",
            "price": "15-20% off",
            "subtitle": "Lock category for 3+ campaigns",
            "bullets": [
                "Locked category exclusivity",
                "Discounted slot price every campaign",
                "Quarterly performance review",
                "First call on premium placement",
            ],
            "color": ACCENT,
        },
    ]
    top = Inches(1.7)
    cw = Inches(4.0); ch = Inches(4.0); gap = Inches(0.3)
    left0 = Inches(0.5)
    for i, card in enumerate(cards):
        x = left0 + (cw + gap) * i
        add_rect(s, x, top, cw, ch, fill=WHITE)
        add_rect(s, x, top, cw, Inches(0.5), fill=card["color"])
        add_text(s, x, top + Inches(0.05), cw, Inches(0.4),
                 card["name"], font_size=16, bold=True, color=WHITE,
                 align=PP_ALIGN.CENTER)
        add_text(s, x, top + Inches(0.7), cw, Inches(0.6),
                 card["price"], font_size=28, bold=True, color=NAVY,
                 align=PP_ALIGN.CENTER)
        add_text(s, x, top + Inches(1.3), cw, Inches(0.4),
                 card["subtitle"], font_size=12, color=SLATE,
                 align=PP_ALIGN.CENTER)
        body = "\n".join(f"• {b}" for b in card["bullets"])
        add_text(s, x + Inches(0.25), top + Inches(1.85),
                 cw - Inches(0.5), ch - Inches(2),
                 body, font_size=12, color=SLATE, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(6.0), Inches(12.3), Inches(0.55),
             "Hold your category by signing today. 50% deposit locks the slot, "
             "50% before printing.",
             font_size=15, bold=True, color=GOLD, align=PP_ALIGN.LEFT)
    add_text(s, Inches(0.5), Inches(6.5), Inches(12.3), Inches(0.55),
             "hello@yourdomain.com  |  (510) 555-0142  |  yourdomain.com",
             font_size=14, color=WHITE, align=PP_ALIGN.LEFT)
    add_footer(s, prs, 5, 5, c["name"] + " — Shared Postcard Direct Mail")


def build_deck(community_key: str, out_path: Path) -> Path:
    if community_key not in COMMUNITY_PROFILES:
        raise SystemExit(
            f"Unknown community '{community_key}'. "
            f"Choose from: {', '.join(COMMUNITY_PROFILES)}"
        )
    c = COMMUNITY_PROFILES[community_key]
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    build_slide_1_cover(prs, c)
    build_slide_2_community(prs, c)
    build_slide_3_how_it_works(prs, c)
    build_slide_4_roi(prs, c)
    build_slide_5_pricing(prs, c)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    prs.save(out_path)
    return out_path


def main():
    ap = argparse.ArgumentParser(description="Build the Bay Area pitch deck.")
    ap.add_argument("--community", default="danville",
                    choices=sorted(COMMUNITY_PROFILES))
    ap.add_argument("--out", default=None,
                    help="Override output path (defaults to deck/pitch-deck_<community>_<date>.pptx)")
    args = ap.parse_args()
    today = date.today().strftime("%Y-%m-%d")
    out = Path(args.out) if args.out else (
        Path(__file__).parent / f"pitch-deck_{args.community}_{today}.pptx"
    )
    saved = build_deck(args.community, out)
    print(f"Wrote {saved}")


if __name__ == "__main__":
    main()
