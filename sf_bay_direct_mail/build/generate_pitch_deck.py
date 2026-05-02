"""Generate the 5-slide Bay Area pitch deck (.pptx)."""
from datetime import date
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

OUT = Path(__file__).resolve().parent.parent / "deck" / f"pitch-deck_bay-area_{date.today():%Y-%m}.pptx"

NAVY = RGBColor(0x0E, 0x1F, 0x3A)
GOLD = RGBColor(0xD4, 0xA0, 0x3A)
LIGHT = RGBColor(0xF4, 0xF1, 0xEA)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK = RGBColor(0x22, 0x2B, 0x3D)
GRAY = RGBColor(0x6A, 0x70, 0x80)


def add_solid_bg(slide, color):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg


def add_text(slide, left, top, width, height, text, *, font_size=18, bold=False,
             color=DARK, align=PP_ALIGN.LEFT):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = color
    return tb


def slide1_cover(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_solid_bg(s, NAVY)

    add_text(s, Inches(0.7), Inches(0.5), Inches(10), Inches(0.6),
             "SF BAY AREA · SHARED POSTCARD DIRECT MAIL",
             font_size=14, bold=True, color=GOLD)

    add_text(s, Inches(0.7), Inches(2.0), Inches(12), Inches(2.0),
             "Reach 6,000 Bay Area homes.",
             font_size=54, bold=True, color=WHITE)

    add_text(s, Inches(0.7), Inches(3.2), Inches(12), Inches(2.0),
             "Share the cost. Own your category.",
             font_size=44, bold=True, color=GOLD)

    add_text(s, Inches(0.7), Inches(5.2), Inches(12), Inches(0.5),
             "One postcard. 8 non-competing local businesses. USPS Every Door Direct Mail.",
             font_size=20, color=LIGHT)

    add_text(s, Inches(0.7), Inches(6.6), Inches(8), Inches(0.4),
             f"Prepared {date.today():%B %Y} · Confidential",
             font_size=12, color=LIGHT)


def slide2_community(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_solid_bg(s, LIGHT)

    add_text(s, Inches(0.7), Inches(0.4), Inches(12), Inches(0.6),
             "WHO YOU'RE REACHING", font_size=14, bold=True, color=GOLD)
    add_text(s, Inches(0.7), Inches(0.9), Inches(12), Inches(1.0),
             "Danville, CA — 94526",
             font_size=40, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(1.85), Inches(12), Inches(0.5),
             "Affluent East Bay community along the I-680 corridor.",
             font_size=18, color=DARK)

    stats = [
        ("$185K+", "Median household income"),
        ("18,000+", "Households in 94526"),
        ("~80%", "Owner-occupied"),
        ("6,000", "Pieces delivered per campaign"),
    ]

    left = Inches(0.7)
    top = Inches(2.7)
    w = Inches(2.95)
    h = Inches(2.0)
    gap = Inches(0.1)
    for i, (num, label) in enumerate(stats):
        x = left + (w + gap) * i
        card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = NAVY
        card.line.width = Pt(0.75)
        card.adjustments[0] = 0.06

        tb = s.shapes.add_textbox(x, top + Inches(0.25), w, Inches(0.95))
        p = tb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = num
        run.font.size = Pt(36)
        run.font.bold = True
        run.font.color.rgb = NAVY

        tb2 = s.shapes.add_textbox(x + Inches(0.15), top + Inches(1.25), w - Inches(0.3), Inches(0.65))
        tf = tb2.text_frame
        tf.word_wrap = True
        p2 = tf.paragraphs[0]
        p2.alignment = PP_ALIGN.CENTER
        run2 = p2.add_run()
        run2.text = label
        run2.font.size = Pt(13)
        run2.font.color.rgb = GRAY

    add_text(s, Inches(0.7), Inches(5.2), Inches(12), Inches(0.4),
             "Why Danville works for direct mail",
             font_size=18, bold=True, color=NAVY)
    bullets = [
        "Strong HOA infrastructure — residents read community mail.",
        "Top-rated schools (San Ramon Valley USD) keep families anchored long-term.",
        "Dense local-business corridor along Hartz Ave, Diablo Rd, and Camino Tassajara.",
        "Tier 1 EDDM walks: Tassajara, Sycamore, Westside, Diablo Road.",
    ]
    tb = s.shapes.add_textbox(Inches(0.7), Inches(5.55), Inches(12), Inches(1.6))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, b in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = "• " + b
        run.font.size = Pt(14)
        run.font.color.rgb = DARK


def slide3_how(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_solid_bg(s, WHITE)

    add_text(s, Inches(0.7), Inches(0.4), Inches(12), Inches(0.6),
             "HOW IT WORKS", font_size=14, bold=True, color=GOLD)
    add_text(s, Inches(0.7), Inches(0.9), Inches(12), Inches(1.0),
             "8 businesses. 1 postcard. 1 winner per category.",
             font_size=32, bold=True, color=NAVY)

    steps = [
        ("1", "Lock your category", "Only one HVAC, one dentist, one pool service. We hold your slot from day one."),
        ("2", "We design + print", "Pro postcard design. Your logo, offer, photo, QR code. You approve every proof."),
        ("3", "USPS EDDM delivery", "We blanket every household on the route — 6,000 doors in Danville 94526."),
        ("4", "You answer the calls", "Track results with a unique phone number, QR code, or promo code."),
    ]
    cols = 4
    left = Inches(0.7)
    top = Inches(2.5)
    w = Inches(2.95)
    h = Inches(3.6)
    gap = Inches(0.1)
    for i, (n, title, body) in enumerate(steps):
        x = left + (w + gap) * i
        card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = LIGHT
        card.line.fill.background()
        card.adjustments[0] = 0.06

        circle = s.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.25), top + Inches(0.25), Inches(0.7), Inches(0.7))
        circle.fill.solid()
        circle.fill.fore_color.rgb = GOLD
        circle.line.fill.background()
        ctf = circle.text_frame
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = 0
        cp = ctf.paragraphs[0]
        cp.alignment = PP_ALIGN.CENTER
        crun = cp.add_run()
        crun.text = n
        crun.font.size = Pt(22)
        crun.font.bold = True
        crun.font.color.rgb = WHITE

        tb = s.shapes.add_textbox(x + Inches(0.2), top + Inches(1.1), w - Inches(0.4), Inches(0.6))
        p = tb.text_frame.paragraphs[0]
        run = p.add_run()
        run.text = title
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = NAVY

        tb2 = s.shapes.add_textbox(x + Inches(0.2), top + Inches(1.75), w - Inches(0.4), Inches(1.7))
        tf = tb2.text_frame
        tf.word_wrap = True
        p2 = tf.paragraphs[0]
        run2 = p2.add_run()
        run2.text = body
        run2.font.size = Pt(12)
        run2.font.color.rgb = DARK

    add_text(s, Inches(0.7), Inches(6.4), Inches(12), Inches(0.5),
             "Exclusive category lock — no competitor on the same card. Ever.",
             font_size=16, bold=True, color=NAVY, align=PP_ALIGN.CENTER)


def slide4_roi(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_solid_bg(s, NAVY)

    add_text(s, Inches(0.7), Inches(0.4), Inches(12), Inches(0.6),
             "THE MATH", font_size=14, bold=True, color=GOLD)
    add_text(s, Inches(0.7), Inches(0.9), Inches(12), Inches(1.0),
             "What's it really worth?",
             font_size=36, bold=True, color=WHITE)

    add_text(s, Inches(0.7), Inches(2.1), Inches(6), Inches(0.5),
             "Tier 2 baseline · 6,000 households", font_size=14, color=GOLD)

    table = s.shapes.add_table(rows=6, cols=2,
                               left=Inches(0.7), top=Inches(2.6),
                               width=Inches(5.8), height=Inches(3.4)).table
    table.columns[0].width = Inches(3.6)
    table.columns[1].width = Inches(2.2)
    rows = [
        ("Households reached", "6,000"),
        ("Typical response rate (1%)", "60 calls"),
        ("Booked job conversion (50%)", "30 jobs"),
        ("Avg ticket (HVAC tune-up + repair)", "$280"),
        ("Gross revenue from one card", "$8,400"),
        ("Your ad investment", "$650"),
    ]
    for i, (k, v) in enumerate(rows):
        c0 = table.cell(i, 0)
        c1 = table.cell(i, 1)
        c0.text = k
        c1.text = v
        for cell in (c0, c1):
            cell.fill.solid()
            cell.fill.fore_color.rgb = WHITE if i % 2 == 0 else LIGHT
            for p in cell.text_frame.paragraphs:
                for r in p.runs:
                    r.font.size = Pt(13)
                    r.font.color.rgb = DARK

    add_text(s, Inches(7.0), Inches(2.1), Inches(6), Inches(0.5),
             "Break-even", font_size=14, color=GOLD)
    add_text(s, Inches(7.0), Inches(2.6), Inches(6), Inches(1.4),
             "3 jobs.",
             font_size=72, bold=True, color=GOLD)
    add_text(s, Inches(7.0), Inches(4.2), Inches(6), Inches(2.0),
             "Three booked jobs at average ticket clears your $650 investment. "
             "Everything after that is margin — for the next 6–8 weeks of "
             "fridge-magnet life on this card.",
             font_size=16, color=WHITE)

    add_text(s, Inches(0.7), Inches(6.5), Inches(12), Inches(0.5),
             "Trackable: dedicated phone number + QR code + promo code. You see exactly what works.",
             font_size=14, color=LIGHT, align=PP_ALIGN.CENTER)


def slide5_pricing(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_solid_bg(s, LIGHT)

    add_text(s, Inches(0.7), Inches(0.4), Inches(12), Inches(0.6),
             "PRICING & NEXT STEPS", font_size=14, bold=True, color=GOLD)
    add_text(s, Inches(0.7), Inches(0.9), Inches(12), Inches(1.0),
             "Lock your category today.",
             font_size=36, bold=True, color=NAVY)

    cards = [
        ("Standard ad", "$650", "1 of 8 category-exclusive slots. Full-color layout, your logo, offer, QR code, and dedicated tracking phone number.", False),
        ("Premium placement", "$950", "Cover-side placement, 30% larger panel, opening-fold position. Best fit for HVAC, med spa, dentist, roofing.", True),
        ("Multi-campaign", "Save 15%", "Lock 2+ consecutive campaigns and save 15%. We hold your category between drops so no competitor can buy in.", False),
    ]
    left = Inches(0.7)
    top = Inches(2.3)
    w = Inches(3.95)
    h = Inches(3.7)
    gap = Inches(0.15)
    for i, (title, price, body, highlight) in enumerate(cards):
        x = left + (w + gap) * i
        card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = NAVY if highlight else WHITE
        card.line.color.rgb = GOLD if highlight else NAVY
        card.line.width = Pt(1.5 if highlight else 0.75)
        card.adjustments[0] = 0.06

        tb = s.shapes.add_textbox(x + Inches(0.3), top + Inches(0.3), w - Inches(0.6), Inches(0.6))
        p = tb.text_frame.paragraphs[0]
        run = p.add_run()
        run.text = title.upper()
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = GOLD if highlight else GOLD

        tb2 = s.shapes.add_textbox(x + Inches(0.3), top + Inches(0.8), w - Inches(0.6), Inches(1.0))
        p2 = tb2.text_frame.paragraphs[0]
        run2 = p2.add_run()
        run2.text = price
        run2.font.size = Pt(44)
        run2.font.bold = True
        run2.font.color.rgb = WHITE if highlight else NAVY

        tb3 = s.shapes.add_textbox(x + Inches(0.3), top + Inches(2.0), w - Inches(0.6), Inches(1.6))
        tf3 = tb3.text_frame
        tf3.word_wrap = True
        p3 = tf3.paragraphs[0]
        run3 = p3.add_run()
        run3.text = body
        run3.font.size = Pt(13)
        run3.font.color.rgb = LIGHT if highlight else DARK

    add_text(s, Inches(0.7), Inches(6.3), Inches(12), Inches(0.5),
             "Next step: 50% deposit secures your category. We send proofs in 5 business days.",
             font_size=16, bold=True, color=NAVY, align=PP_ALIGN.CENTER)


def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    slide1_cover(prs)
    slide2_community(prs)
    slide3_how(prs)
    slide4_roi(prs)
    slide5_pricing(prs)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
