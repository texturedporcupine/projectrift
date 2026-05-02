/**
 * Build the 5-slide Bay Area pitch deck (pptxgenjs).
 *
 * Mirror of deck/build_deck.py — same structure, same data.
 *
 * Quirk note (carried over from the Austin build): on dark backgrounds avoid
 * fill transparency; use solid hex fills only. pptxgenjs respects this when
 * the `fill: { color: "0B1F3A" }` form is used (no `transparency`).
 *
 * Usage:
 *   npm i pptxgenjs
 *   node deck/build-deck.js                       # default: danville
 *   node deck/build-deck.js --community=san_ramon
 */

const path = require("path");
const PptxGenJS = require("pptxgenjs");

const NAVY = "0B1F3A";
const GOLD = "D4A84B";
const WHITE = "FFFFFF";
const LIGHT = "F4EFE6";
const SLATE = "324466";
const ACCENT = "C9574A";

const COMMUNITY_PROFILES = {
  danville: {
    name: "Danville, CA",
    zip: "94526",
    tier: "Tier 1",
    medHhi: "$185K+",
    homes: "18,000+",
    homeownership: "~80%",
    schools: "SRVUSD (top 5% in CA)",
    adFloor: 700,
    adCeiling: 900,
    premium: "$1,100-$1,400",
    categories: "HVAC, landscape, pool, dentist, med spa",
    anchor: "Blackhawk + Diablo + downtown Hartz Ave.",
    hhPerDrop: 6000,
  },
  san_ramon: {
    name: "San Ramon, CA",
    zip: "94582 / 94583",
    tier: "Tier 1-2",
    medHhi: "$160K+",
    homes: "30,000+",
    homeownership: "~73%",
    schools: "SRVUSD",
    adFloor: 550,
    adCeiling: 800,
    premium: "$850-$1,100",
    categories: "HVAC, tutoring, family dentist, pest ctrl",
    anchor: "Dougherty Valley + Bishop Ranch corridor",
    hhPerDrop: 6000,
  },
  pleasanton: {
    name: "Pleasanton, CA",
    zip: "94566 / 94588",
    tier: "Tier 2",
    medHhi: "$155K+",
    homes: "28,000+",
    homeownership: "~70%",
    schools: "PUSD",
    adFloor: 550,
    adCeiling: 750,
    premium: "$850-$1,100",
    categories: "Pool, landscape, ortho, cleaning, HVAC",
    anchor: "Ruby Hill + downtown Main Street",
    hhPerDrop: 6000,
  },
  los_gatos: {
    name: "Los Gatos, CA",
    zip: "95030 / 95032",
    tier: "Tier 1",
    medHhi: "$200K+",
    homes: "12,000+",
    homeownership: "~70%",
    schools: "LGUSD",
    adFloor: 700,
    adCeiling: 900,
    premium: "$1,100-$1,400",
    categories: "Med spa, luxury reno, pool, dentist, landscape",
    anchor: "Santa Cruz Ave. + Los Gatos Blvd.",
    hhPerDrop: 5500,
  },
  saratoga: {
    name: "Saratoga, CA",
    zip: "95070",
    tier: "Tier 1 Premium",
    medHhi: "$250K+",
    homes: "10,000+",
    homeownership: "~83%",
    schools: "Saratoga Union",
    adFloor: 850,
    adCeiling: 1100,
    premium: "$1,400-$1,800",
    categories: "Luxury reno, med spa, estate planning, fine landscape",
    anchor: "Big Basin Way + Saratoga Village",
    hhPerDrop: 5000,
  },
};

function parseArgs() {
  const out = { community: "danville", out: null };
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.replace(/^--/, "").split("=");
    if (k === "community") out.community = v;
    if (k === "out") out.out = v;
  }
  return out;
}

function addFooter(slide, idx, total, label) {
  slide.addShape("rect", { x: 0, y: 7.15, w: 13.333, h: 0.35, fill: { color: NAVY }, line: { type: "none" } });
  slide.addText(label, { x: 0.4, y: 7.18, w: 8, h: 0.3, fontSize: 10, color: GOLD });
  slide.addText(`${idx} / ${total}`, { x: 11, y: 7.18, w: 1.9, h: 0.3, fontSize: 10, color: GOLD, align: "right" });
}

function buildSlide1(pres, c) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape("rect", { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: GOLD }, line: { type: "none" } });
  s.addText("SF BAY AREA DIRECT MAIL", { x: 0.8, y: 0.6, w: 8.4, h: 0.5, fontSize: 14, bold: true, color: GOLD });
  s.addText(`Reach every door in\n${c.name}.`, { x: 0.8, y: 1.4, w: 11, h: 2.0, fontSize: 54, bold: true, color: WHITE });
  s.addText(
    `One advertiser per category. ${c.hhPerDrop.toLocaleString()} households per drop. Exclusive — by design.`,
    { x: 0.8, y: 4.2, w: 11, h: 0.6, fontSize: 22, color: LIGHT },
  );
  s.addText(`${c.tier}  |  ${c.zip}  |  Med. HHI ${c.medHhi}`, {
    x: 0.8, y: 5.4, w: 11, h: 0.5, fontSize: 18, bold: true, color: GOLD,
  });
  addFooter(s, 1, 5, `${c.name} — Shared Postcard Direct Mail`);
}

function statBlock(slide, x, y, w, h, big, label) {
  slide.addShape("rect", { x, y, w, h, fill: { color: WHITE }, line: { color: "E0D8C8" } });
  slide.addText(big, { x, y: y + 0.2, w, h: 0.9, fontSize: 36, bold: true, color: NAVY, align: "center" });
  slide.addText(label, { x, y: y + 1.05, w, h: 0.5, fontSize: 12, color: SLATE, align: "center" });
}

function buildSlide2(pres, c) {
  const s = pres.addSlide();
  s.background = { color: LIGHT };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.95, fill: { color: NAVY }, line: { type: "none" } });
  s.addText(`${c.name} — by the numbers`, { x: 0.5, y: 0.18, w: 11, h: 0.6, fontSize: 26, bold: true, color: WHITE });
  s.addText(`${c.tier} community  |  Zip ${c.zip}`, { x: 0.5, y: 0.55, w: 11, h: 0.4, fontSize: 12, color: GOLD });
  const top = 1.4, bw = 2.85, bh = 1.7, left = 0.5;
  statBlock(s, left,           top, bw, bh, c.medHhi, "Median household income");
  statBlock(s, left + 3.0,     top, bw, bh, c.homes, "Households in community");
  statBlock(s, left + 6.0,     top, bw, bh, c.homeownership, "Homeownership rate");
  statBlock(s, left + 9.0,     top, bw, bh, c.hhPerDrop.toLocaleString(), "HHs reached per drop");
  s.addText("Why this community fits the model", { x: 0.5, y: 3.5, w: 12.3, h: 0.5, fontSize: 18, bold: true, color: NAVY });
  const bullets = [
    `Anchor neighborhoods: ${c.anchor}`,
    `Schools: ${c.schools} — long-tenured, mail-reading families`,
    "Active HOAs and a community newsletter culture",
    `Strong demand verticals: ${c.categories}`,
    "2-3 EDDM carrier routes deliver ~6,000 households per drop",
  ].map((t) => ({ text: t, options: { bullet: true } }));
  s.addText(bullets, { x: 0.5, y: 4.1, w: 12.3, h: 2.6, fontSize: 16, color: SLATE });
  addFooter(s, 2, 5, `${c.name} — Shared Postcard Direct Mail`);
}

function buildSlide3(pres, c) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.95, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("How it works — and why it works", { x: 0.5, y: 0.18, w: 12, h: 0.6, fontSize: 26, bold: true, color: WHITE });
  s.addText("One business per category per postcard. Exclusivity is the product.",
    { x: 0.5, y: 0.55, w: 12, h: 0.4, fontSize: 12, color: GOLD });
  const steps = [
    ["1", "Pick the community", `Lock 2-3 EDDM routes in ${c.name} (${c.zip}).`],
    ["2", "Lock category exclusivity", "One HVAC, one dentist, one pool, one med spa..."],
    ["3", "Design + proof + print", "8.5x11, 14pt cardstock. Sign-off from every advertiser."],
    ["4", "EDDM drop at the DDU", `~${c.hhPerDrop.toLocaleString()} households at $0.247/piece postage.`],
    ["5", "Renew & expand", "2-week follow-up. Multi-campaign discount. Compounding pipeline."],
  ];
  const top = 1.4;
  steps.forEach(([num, title, body], i) => {
    const y = top + 0.95 * i;
    s.addShape("ellipse", { x: 0.5, y, w: 0.7, h: 0.7, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(num, { x: 0.5, y, w: 0.7, h: 0.7, fontSize: 22, bold: true, color: NAVY, align: "center", valign: "middle" });
    s.addText(title, { x: 1.4, y: y + 0.03, w: 11.5, h: 0.4, fontSize: 18, bold: true, color: NAVY });
    s.addText(body, { x: 1.4, y: y + 0.42, w: 11.5, h: 0.45, fontSize: 14, color: SLATE });
  });
  addFooter(s, 3, 5, `${c.name} — Shared Postcard Direct Mail`);
}

function buildSlide4(pres, c) {
  const s = pres.addSlide();
  s.background = { color: LIGHT };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.95, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("ROI math — your side of the postcard", { x: 0.5, y: 0.18, w: 12, h: 0.6, fontSize: 26, bold: true, color: WHITE });
  s.addText("Conservative response, Bay Area pricing assumptions.",
    { x: 0.5, y: 0.55, w: 12, h: 0.4, fontSize: 12, color: GOLD });
  const avgPrice = Math.round((c.adFloor + c.adCeiling) / 2);
  const drop = c.hhPerDrop;
  const leadsLow = Math.round(drop * 0.005);
  const leadsHigh = Math.round(drop * 0.015);
  const rows = [
    ["Households reached this drop", drop.toLocaleString()],
    ["Your ad space (Tier average)", `$${avgPrice.toLocaleString()}`],
    ["Conservative response (0.5%)", `${leadsLow} calls / clicks`],
    ["Strong response (1.5%)", `${leadsHigh} calls / clicks`],
    ["If 5% of those leads convert at $400 avg job",
     `$${Math.round(leadsLow * 0.05 * 400).toLocaleString()} - $${Math.round(leadsHigh * 0.05 * 400).toLocaleString()}`],
    ["Cost per impression", `$${(avgPrice / drop).toFixed(3)}`],
    ["Break-even at 1 closed job", "Yes, on most categories"],
  ];
  const top = 1.4, rh = 0.55;
  s.addShape("rect", { x: 0.5, y: top, w: 12.3, h: rh, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("Metric",   { x: 0.7, y: top, w: 7.5, h: rh, fontSize: 14, bold: true, color: WHITE, valign: "middle" });
  s.addText("Estimate", { x: 8.4, y: top, w: 4.2, h: rh, fontSize: 14, bold: true, color: GOLD,  valign: "middle" });
  rows.forEach(([k, v], i) => {
    const y = top + rh * (i + 1);
    const bg = i % 2 === 0 ? WHITE : "ECE5D4";
    s.addShape("rect", { x: 0.5, y, w: 12.3, h: rh, fill: { color: bg }, line: { color: "D8CEB6" } });
    s.addText(k, { x: 0.7, y, w: 7.5, h: rh, fontSize: 13, color: SLATE, valign: "middle" });
    s.addText(v, { x: 8.4, y, w: 4.2, h: rh, fontSize: 14, bold: true, color: NAVY, valign: "middle" });
  });
  s.addText("One closed job typically pays for the ad. Everything after is margin — for a year.",
    { x: 0.5, y: 6.4, w: 12.3, h: 0.6, fontSize: 14, bold: true, color: ACCENT });
  addFooter(s, 4, 5, `${c.name} — Shared Postcard Direct Mail`);
}

function buildSlide5(pres, c) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("Pricing — and what you walk away with today", {
    x: 0.5, y: 0.5, w: 12, h: 0.6, fontSize: 26, bold: true, color: WHITE,
  });
  s.addText("All prices include design, proof rounds, print, and EDDM delivery.",
    { x: 0.5, y: 1.0, w: 12, h: 0.4, fontSize: 13, color: GOLD });
  const cards = [
    {
      name: "Standard",
      price: `$${c.adFloor}-$${c.adCeiling}`,
      subtitle: "1 of 6-8 ad slots",
      bullets: [
        "Category exclusivity for the campaign",
        "Logo + offer + phone + URL + QR",
        "Front or back placement, balanced",
        "All design + print + delivery included",
      ],
      color: SLATE,
    },
    {
      name: "Premium placement",
      price: c.premium,
      subtitle: "Back panel or featured anchor",
      bullets: [
        "Largest ad block on the postcard",
        "First-page mention in cover panel",
        "Right-of-first-refusal on next campaign",
        "All design + print + delivery included",
      ],
      color: GOLD,
    },
    {
      name: "Renewal partner",
      price: "15-20% off",
      subtitle: "Lock category for 3+ campaigns",
      bullets: [
        "Locked category exclusivity",
        "Discounted slot price every campaign",
        "Quarterly performance review",
        "First call on premium placement",
      ],
      color: ACCENT,
    },
  ];
  const top = 1.7, cw = 4.0, ch = 4.0, gap = 0.3, left0 = 0.5;
  cards.forEach((card, i) => {
    const x = left0 + (cw + gap) * i;
    s.addShape("rect", { x, y: top, w: cw, h: ch, fill: { color: WHITE }, line: { type: "none" } });
    s.addShape("rect", { x, y: top, w: cw, h: 0.5, fill: { color: card.color }, line: { type: "none" } });
    s.addText(card.name, { x, y: top + 0.05, w: cw, h: 0.4, fontSize: 16, bold: true, color: WHITE, align: "center" });
    s.addText(card.price, { x, y: top + 0.7, w: cw, h: 0.6, fontSize: 28, bold: true, color: NAVY, align: "center" });
    s.addText(card.subtitle, { x, y: top + 1.3, w: cw, h: 0.4, fontSize: 12, color: SLATE, align: "center" });
    const body = card.bullets.map((b) => ({ text: b, options: { bullet: true } }));
    s.addText(body, { x: x + 0.25, y: top + 1.85, w: cw - 0.5, h: ch - 2, fontSize: 12, color: SLATE });
  });
  s.addText("Hold your category by signing today. 50% deposit locks the slot, 50% before printing.",
    { x: 0.5, y: 6.0, w: 12.3, h: 0.55, fontSize: 15, bold: true, color: GOLD });
  s.addText("hello@yourdomain.com  |  (510) 555-0142  |  yourdomain.com",
    { x: 0.5, y: 6.5, w: 12.3, h: 0.55, fontSize: 14, color: WHITE });
  addFooter(s, 5, 5, `${c.name} — Shared Postcard Direct Mail`);
}

async function main() {
  const args = parseArgs();
  if (!COMMUNITY_PROFILES[args.community]) {
    console.error(`Unknown community: ${args.community}. Choose from: ${Object.keys(COMMUNITY_PROFILES).join(", ")}`);
    process.exit(1);
  }
  const c = COMMUNITY_PROFILES[args.community];
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.title = `Bay Area Direct Mail — ${c.name}`;
  buildSlide1(pres, c);
  buildSlide2(pres, c);
  buildSlide3(pres, c);
  buildSlide4(pres, c);
  buildSlide5(pres, c);
  const today = new Date().toISOString().slice(0, 10);
  const out = args.out || path.join(__dirname, `pitch-deck_${args.community}_${today}.pptx`);
  await pres.writeFile({ fileName: out });
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
