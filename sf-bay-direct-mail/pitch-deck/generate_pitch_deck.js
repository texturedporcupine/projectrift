/**
 * 5-slide Bay Area pitch deck. Run: npm install && npm run build
 * Quirk: use solid hex fills on dark backgrounds (no transparency).
 */

const pptxgen = require("pptxgenjs");

const communities = [
  { name: "Danville, CA", zip: "94526", hhi: "$185K+", homes: "18,000+", tier: "Tier 1" },
  { name: "San Ramon, CA", zip: "94582 / 94583", hhi: "$160K+", homes: "30,000+", tier: "Tier 1–2" },
  { name: "Pleasanton, CA", zip: "94566 / 94588", hhi: "$155K+", homes: "28,000+", tier: "Tier 2" },
];

const pricingTier2 = { standard: "$550 – $750", premium: "$850 – $1,100" };
const pricingTier1 = { standard: "$700 – $900", premium: "$1,100 – $1,400" };

function addTitleSlide(ppt) {
  const slide = ppt.addSlide();
  slide.background = { color: "1a1a2e" };
  slide.addText("Shared Postcard — Local EDDM", {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 1,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
  });
  slide.addText("San Francisco Bay Area • Exclusive category placement • 5k–8k households", {
    x: 0.5,
    y: 2.4,
    w: 9,
    h: 0.6,
    fontSize: 16,
    color: "EAEAEA",
  });
  slide.addText("Confidential — for qualified local advertisers", {
    x: 0.5,
    y: 5,
    w: 9,
    fontSize: 12,
    color: "AAAAAA",
  });
}

function addCommunitySlide(ppt) {
  const slide = ppt.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("Target communities (start here)", {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: "1a1a2e",
  });
  let y = 1.1;
  communities.forEach((c) => {
    slide.addShape(ppt.ShapeType.rect, {
      x: 0.5,
      y,
      w: 9,
      h: 1.15,
      fill: { color: "F4F4F8" },
      line: { color: "CCCCCC", width: 1 },
    });
    slide.addText(`${c.name} (${c.zip})`, {
      x: 0.65,
      y: y + 0.1,
      w: 8.7,
      h: 0.35,
      fontSize: 16,
      bold: true,
      color: "1a1a2e",
    });
    slide.addText(`Median HHI ${c.hhi} • ${c.homes} homes • ${c.tier}`, {
      x: 0.65,
      y: y + 0.45,
      w: 8.7,
      h: 0.35,
      fontSize: 13,
      color: "333333",
    });
    y += 1.35;
  });
}

function addHowItWorksSlide(ppt) {
  const slide = ppt.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("How it works + exclusivity", {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: "1a1a2e",
  });
  const bullets = [
    "One shared postcard mailed with USPS EDDM to ~5,000–8,000 households in your community.",
    "One advertiser per category — no competing dentists, HVAC, or pest companies on the same card.",
    "We handle design coordination, print-ready proofs, and EDDM paperwork; you approve creative.",
    "50% deposit to reserve your category; 50% before print after approvals.",
  ];
  slide.addText(bullets.join("\n\n"), {
    x: 0.5,
    y: 1.1,
    w: 9,
    h: 4.5,
    fontSize: 15,
    color: "222222",
    valign: "top",
  });
}

function addRoiSlide(ppt) {
  const slide = ppt.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("ROI snapshot (illustrative)", {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: "1a1a2e",
  });
  slide.addText(
    [
      "Households reached: ~6,000 (example)",
      "Postage (EDDM retail): $0.247 × 6,000 ≈ $1,482",
      "Your investment: Tier 2 standard placement (see next slide)",
      "Break-even: a handful of new jobs or patients covers the slot — track calls/URL.",
    ].join("\n\n"),
    {
      x: 0.5,
      y: 1.1,
      w: 9,
      h: 4.2,
      fontSize: 15,
      color: "222222",
      valign: "top",
    }
  );
}

function addPricingSlide(ppt) {
  const slide = ppt.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addText("Bay Area pricing (defaults)", {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: "1a1a2e",
  });
  slide.addText("Tier 2 — Strong markets (e.g., Danville, San Ramon, Pleasanton, Los Gatos)", {
    x: 0.5,
    y: 1,
    w: 9,
    fontSize: 14,
    bold: true,
    color: "333333",
  });
  slide.addText(`Standard ad: ${pricingTier2.standard}\nPremium placement: ${pricingTier2.premium}`, {
    x: 0.5,
    y: 1.35,
    w: 9,
    h: 0.8,
    fontSize: 15,
    color: "222222",
  });
  slide.addText("Tier 1 — Premium (e.g., Palo Alto, Saratoga, Los Altos)", {
    x: 0.5,
    y: 2.4,
    w: 9,
    fontSize: 14,
    bold: true,
    color: "333333",
  });
  slide.addText(`Standard ad: ${pricingTier1.standard}\nPremium placement: ${pricingTier1.premium}`, {
    x: 0.5,
    y: 2.75,
    w: 9,
    h: 0.8,
    fontSize: 15,
    color: "222222",
  });
  slide.addText("Payment: 50% at signing to lock category exclusivity • 50% before print", {
    x: 0.5,
    y: 4.2,
    w: 9,
    fontSize: 14,
    bold: true,
    color: "1a1a2e",
  });
}

function main() {
  const ppt = new pptxgen();
  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "SF Bay Direct Mail";
  ppt.title = "Shared Postcard — Bay Area";

  addTitleSlide(ppt);
  addCommunitySlide(ppt);
  addHowItWorksSlide(ppt);
  addRoiSlide(ppt);
  addPricingSlide(ppt);

  const outPath = require("path").join(__dirname, "pitch-deck_Bay-Area_2026-05.pptx");
  ppt.writeFile({ fileName: outPath }).then(() => {
    console.log("Wrote", outPath);
  });
}

main();
