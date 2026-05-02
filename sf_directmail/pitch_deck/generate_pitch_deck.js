#!/usr/bin/env node
/**
 * SF Bay Area Shared Postcard Direct Mail — Pitch Deck Generator
 * Usage: node generate_pitch_deck.js [community]
 *   community: danville | sanramon | pleasanton | dublin | losgatos (default: danville)
 *
 * Requires: npm install pptxgenjs
 * QA:  soffice --headless --convert-to pdf pitch-deck_*.pptx
 *      pdftoppm -jpeg -r 150 pitch-deck_*.pdf slide
 *
 * Known quirk: avoid fill transparency on dark backgrounds — use solid hex fills only.
 */

const PptxGenJS = require("pptxgenjs");

const COMMUNITIES = {
  danville: {
    name: "Danville",
    zip: "94526",
    tier: "Tier 2",
    hhi: "$185,000+",
    households: "18,000+",
    homeownership: "75%",
    hook: "Blackhawk & Sycamore Valley",
    description:
      "Affluent San Ramon Valley suburb with strong HOA culture and a tight-knit mail-reading community — the Marin County of the East Bay.",
    topCategories: ["HVAC", "Landscaping", "Pool Service", "Med Spa", "Pest Control"],
    routes: "2-3 carrier routes targeting Blackhawk, Sycamore Valley, and downtown Danville",
    targetHH: "5,000-7,000",
    stdPrice: "$600",
    premPrice: "$900",
    advertisers: 6,
    gross: "$3,600",
    printCost: "$350",
    eddmCost: "$1,359",
    misc: "$100",
    net: "~$1,900",
  },
  sanramon: {
    name: "San Ramon",
    zip: "94582 / 94583",
    tier: "Tier 2",
    hhi: "$160,000+",
    households: "30,000+",
    homeownership: "70%",
    hook: "Gale Ranch & Bishop Ranch Corridor",
    description:
      "Master-planned community of tech and business professionals. Dense family demographic with intense demand for tutoring, dentistry, and premium home services.",
    topCategories: ["HVAC", "Tutoring", "Family Dentist", "Pest Control", "House Cleaning"],
    routes: "2-3 carrier routes targeting Gale Ranch, Bent Creek, or Dougherty Valley",
    targetHH: "5,000-6,000",
    stdPrice: "$625",
    premPrice: "$950",
    advertisers: 7,
    gross: "$4,375",
    printCost: "$350",
    eddmCost: "$1,359",
    misc: "$100",
    net: "~$2,566",
  },
  pleasanton: {
    name: "Pleasanton",
    zip: "94566 / 94588",
    tier: "Tier 2",
    hhi: "$155,000+",
    households: "28,000+",
    homeownership: "72%",
    hook: "Ruby Hill & Val Vista",
    description:
      "Established East Bay suburb named one of America's Best Places to Live. Ruby Hill's gated golf community delivers a premium captive audience for home services and aesthetics.",
    topCategories: ["Pool Service", "Landscaping", "Orthodontics", "House Cleaning", "HVAC"],
    routes: "2-3 carrier routes targeting Ruby Hill, Val Vista, or SW Pleasanton",
    targetHH: "5,000-6,500",
    stdPrice: "$650",
    premPrice: "$1,000",
    advertisers: 6,
    gross: "$3,900",
    printCost: "$350",
    eddmCost: "$1,235",
    misc: "$100",
    net: "~$2,315",
  },
  dublin: {
    name: "Dublin",
    zip: "94568",
    tier: "Tier 3",
    hhi: "$145,000+",
    households: "22,000+",
    homeownership: "65%",
    hook: "Fallon Village & Jordan Ranch",
    description:
      "One of California's fastest-growing cities. New master-planned communities mean unestablished vendor relationships and families who need every service at once.",
    topCategories: ["HVAC", "Tutoring", "Pest Control", "Family Dentist", "Landscaping"],
    routes: "2-3 carrier routes targeting Fallon Village, Jordan Ranch, or Schaefer Ranch",
    targetHH: "5,000-7,000",
    stdPrice: "$500",
    premPrice: "$750",
    advertisers: 7,
    gross: "$3,500",
    printCost: "$350",
    eddmCost: "$1,359",
    misc: "$100",
    net: "~$1,691",
  },
  losgatos: {
    name: "Los Gatos",
    zip: "95030 / 95032",
    tier: "Tier 1",
    hhi: "$200,000+",
    households: "12,000+",
    homeownership: "80%",
    hook: "Hillside Estates & Monte Sereno",
    description:
      "Silicon Valley's premier foothill community. Tech executives, investors, and established professionals who demand quality and respond to exclusivity.",
    topCategories: ["Med Spa", "Luxury Reno", "Pool Service", "Cosmetic Dentistry", "Landscaping"],
    routes: "2-3 carrier routes targeting hillside Los Gatos and Monte Sereno",
    targetHH: "4,500-5,500",
    stdPrice: "$800",
    premPrice: "$1,200",
    advertisers: 6,
    gross: "$4,800",
    printCost: "$350",
    eddmCost: "$1,112",
    misc: "$100",
    net: "~$3,238",
  },
};

const COLORS = {
  navy: "1B2A4A",
  gold: "C9A84C",
  white: "FFFFFF",
  lightGray: "F5F6F8",
  darkGray: "333333",
  midGray: "666666",
  accentBlue: "2E6DA4",
  successGreen: "2D7D46",
};

function createTextStyle(opts = {}) {
  return {
    fontFace: opts.fontFace || "Calibri",
    fontSize: opts.fontSize || 18,
    color: opts.color || COLORS.darkGray,
    bold: opts.bold || false,
    italic: opts.italic || false,
    align: opts.align || "left",
  };
}

function addSlideBg(slide, color = COLORS.navy) {
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color },
    line: { color },
  });
}

function addAccentBar(slide, y = 0.85) {
  slide.addShape("rect", {
    x: 0, y, w: "100%", h: 0.06,
    fill: { color: COLORS.gold },
    line: { color: COLORS.gold },
  });
}

function buildDeck(community) {
  const c = COMMUNITIES[community];
  if (!c) {
    console.error(`Unknown community: ${community}`);
    console.error(`Valid options: ${Object.keys(COMMUNITIES).join(", ")}`);
    process.exit(1);
  }

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 1 — Hook / Cover
  // ─────────────────────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addSlideBg(slide, COLORS.navy);
    addAccentBar(slide, 6.6);

    slide.addText("REACH EVERY HOUSEHOLD IN", {
      x: 0.5, y: 1.2, w: 12.33, h: 0.5,
      ...createTextStyle({ fontSize: 14, color: COLORS.gold, bold: true, align: "center" }),
    });

    slide.addText(`${c.name}, CA`, {
      x: 0.5, y: 1.65, w: 12.33, h: 1.4,
      ...createTextStyle({ fontSize: 52, color: COLORS.white, bold: true, align: "center" }),
    });

    slide.addText("WITHOUT BUYING A LIST", {
      x: 0.5, y: 3.0, w: 12.33, h: 0.5,
      ...createTextStyle({ fontSize: 14, color: COLORS.gold, bold: true, align: "center" }),
    });

    slide.addText(
      `USPS Every Door Direct Mail  •  ${c.targetHH} Households  •  One Business Per Category`,
      {
        x: 0.5, y: 3.7, w: 12.33, h: 0.5,
        ...createTextStyle({ fontSize: 16, color: COLORS.lightGray, align: "center" }),
      }
    );

    slide.addText("Shared Postcard Direct Mail Program", {
      x: 0.5, y: 6.7, w: 12.33, h: 0.4,
      ...createTextStyle({ fontSize: 11, color: COLORS.midGray, align: "center" }),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 2 — Community Stats
  // ─────────────────────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addSlideBg(slide, COLORS.lightGray);
    addAccentBar(slide, 0.0);

    slide.addText(`Why ${c.name}?`, {
      x: 0.5, y: 0.3, w: 12.33, h: 0.65,
      ...createTextStyle({ fontSize: 30, color: COLORS.navy, bold: true }),
    });

    slide.addText(c.description, {
      x: 0.5, y: 0.95, w: 12.33, h: 0.8,
      ...createTextStyle({ fontSize: 14, color: COLORS.darkGray, italic: true }),
    });

    // Stat boxes
    const stats = [
      { label: "Median HHI", value: c.hhi },
      { label: "Total Households", value: c.households },
      { label: "Homeownership", value: c.homeownership },
      { label: "Target EDDM Routes", value: c.targetHH + " HH" },
    ];

    stats.forEach((stat, i) => {
      const x = 0.4 + i * 3.2;
      slide.addShape("rect", {
        x, y: 1.85, w: 2.9, h: 1.5,
        fill: { color: COLORS.navy },
        line: { color: COLORS.navy },
        rectRadius: 0.08,
      });
      slide.addText(stat.value, {
        x, y: 1.9, w: 2.9, h: 0.9,
        ...createTextStyle({ fontSize: 24, color: COLORS.gold, bold: true, align: "center" }),
      });
      slide.addText(stat.label, {
        x, y: 2.75, w: 2.9, h: 0.5,
        ...createTextStyle({ fontSize: 12, color: COLORS.white, align: "center" }),
      });
    });

    slide.addText(`Zip: ${c.zip}  •  Tier: ${c.tier}  •  Focus Area: ${c.hook}`, {
      x: 0.5, y: 3.5, w: 12.33, h: 0.4,
      ...createTextStyle({ fontSize: 13, color: COLORS.accentBlue, bold: true }),
    });

    slide.addText("Top Categories for This Community:", {
      x: 0.5, y: 4.05, w: 12.33, h: 0.4,
      ...createTextStyle({ fontSize: 14, color: COLORS.navy, bold: true }),
    });

    slide.addText(c.topCategories.join("   •   "), {
      x: 0.5, y: 4.45, w: 12.33, h: 0.5,
      ...createTextStyle({ fontSize: 14, color: COLORS.darkGray }),
    });

    slide.addText(c.routes, {
      x: 0.5, y: 5.1, w: 12.33, h: 0.5,
      ...createTextStyle({ fontSize: 12, color: COLORS.midGray, italic: true }),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 3 — How It Works + Exclusivity
  // ─────────────────────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addSlideBg(slide, COLORS.white);
    addAccentBar(slide, 0.0);

    slide.addText("One Postcard. One Business Per Category. Every Door.", {
      x: 0.5, y: 0.3, w: 12.33, h: 0.65,
      ...createTextStyle({ fontSize: 26, color: COLORS.navy, bold: true }),
    });

    const steps = [
      { num: "1", title: "We select your community", body: `${c.name} (${c.zip}) — ${c.targetHH} households via USPS EDDM carrier routes` },
      { num: "2", title: "6-8 local businesses share the card", body: "One HVAC company. One dentist. One landscaper. No competing ads on the same postcard — ever." },
      { num: "3", title: "We design, print, and deliver", body: "Professional 8.5\"×11\" postcard, 14pt cardstock. Delivered to every mailbox in the target area via USPS." },
      { num: "4", title: "You receive every lead", body: "Your business is the ONLY option in your category. No sharing. No competing offers. Pure exclusivity." },
    ];

    steps.forEach((step, i) => {
      const y = 1.1 + i * 1.35;
      slide.addShape("rect", {
        x: 0.4, y, w: 0.65, h: 0.65,
        fill: { color: COLORS.gold },
        line: { color: COLORS.gold },
        rectRadius: 0.33,
      });
      slide.addText(step.num, {
        x: 0.4, y, w: 0.65, h: 0.65,
        ...createTextStyle({ fontSize: 22, color: COLORS.white, bold: true, align: "center" }),
      });
      slide.addText(step.title, {
        x: 1.25, y: y + 0.02, w: 11.5, h: 0.35,
        ...createTextStyle({ fontSize: 15, color: COLORS.navy, bold: true }),
      });
      slide.addText(step.body, {
        x: 1.25, y: y + 0.35, w: 11.5, h: 0.45,
        ...createTextStyle({ fontSize: 13, color: COLORS.darkGray }),
      });
    });

    slide.addShape("rect", {
      x: 0.4, y: 6.55, w: 12.53, h: 0.55,
      fill: { color: COLORS.navy },
      line: { color: COLORS.navy },
    });
    slide.addText(
      "USPS delivers to 98%+ of households. No opt-in required. No algorithm. Just mail.",
      {
        x: 0.4, y: 6.55, w: 12.53, h: 0.55,
        ...createTextStyle({ fontSize: 13, color: COLORS.gold, bold: true, align: "center" }),
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 4 — ROI Calculator + Pricing
  // ─────────────────────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addSlideBg(slide, COLORS.lightGray);
    addAccentBar(slide, 0.0);

    slide.addText("Your ROI: The Math Is Simple", {
      x: 0.5, y: 0.3, w: 12.33, h: 0.65,
      ...createTextStyle({ fontSize: 28, color: COLORS.navy, bold: true }),
    });

    // Left: ROI calculator
    slide.addText("Break-Even Analysis", {
      x: 0.5, y: 1.0, w: 5.8, h: 0.4,
      ...createTextStyle({ fontSize: 16, color: COLORS.navy, bold: true }),
    });

    const roiRows = [
      ["Your ad investment", c.stdPrice],
      ["Households reached", `${c.targetHH}`],
      ["Estimated response rate (EDDM avg)", "1-3%"],
      ["Leads generated", `50-210 leads`],
      ["Close rate (typical home services)", "20-30%"],
      ["New customers", `10-60 customers`],
      ["Average customer lifetime value", "$500-2,000+"],
      ["Break-even: need just", "1-2 customers"],
    ];

    roiRows.forEach(([label, value], i) => {
      const y = 1.45 + i * 0.5;
      const isLast = i === roiRows.length - 1;
      if (isLast) {
        slide.addShape("rect", {
          x: 0.4, y: y - 0.05, w: 6.1, h: 0.55,
          fill: { color: COLORS.successGreen },
          line: { color: COLORS.successGreen },
        });
      }
      slide.addText(label, {
        x: 0.5, y, w: 4.2, h: 0.4,
        ...createTextStyle({ fontSize: 12, color: isLast ? COLORS.white : COLORS.darkGray, bold: isLast }),
      });
      slide.addText(value, {
        x: 4.7, y, w: 1.8, h: 0.4,
        ...createTextStyle({ fontSize: 13, color: isLast ? COLORS.gold : COLORS.navy, bold: true, align: "right" }),
      });
    });

    // Right: Pricing table
    slide.addText(`Pricing — ${c.name}`, {
      x: 6.9, y: 1.0, w: 6.0, h: 0.4,
      ...createTextStyle({ fontSize: 16, color: COLORS.navy, bold: true }),
    });

    const pricingRows = [
      ["Standard Ad Space", c.stdPrice, COLORS.navy],
      ["Premium / Cover Position", c.premPrice, COLORS.accentBlue],
    ];

    pricingRows.forEach(([label, price, color], i) => {
      const y = 1.45 + i * 0.8;
      slide.addShape("rect", {
        x: 6.8, y, w: 6.1, h: 0.65,
        fill: { color: color },
        line: { color: color },
        rectRadius: 0.06,
      });
      slide.addText(label, {
        x: 7.0, y: y + 0.12, w: 4.0, h: 0.4,
        ...createTextStyle({ fontSize: 14, color: COLORS.white }),
      });
      slide.addText(price, {
        x: 10.0, y: y + 0.12, w: 2.7, h: 0.4,
        ...createTextStyle({ fontSize: 18, color: COLORS.gold, bold: true, align: "right" }),
      });
    });

    slide.addText("What's included:", {
      x: 6.9, y: 3.2, w: 6.0, h: 0.4,
      ...createTextStyle({ fontSize: 13, color: COLORS.navy, bold: true }),
    });

    const included = [
      "✓  Professional ad design (your artwork or we design)",
      "✓  Proof approval before print — you see it first",
      "✓  USPS EDDM delivery to every targeted household",
      "✓  Category exclusivity — no competitor on the same card",
      "✓  Campaign report with delivery confirmation",
      "✓  15-20% multi-campaign renewal discount",
    ];

    included.forEach((item, i) => {
      slide.addText(item, {
        x: 6.9, y: 3.65 + i * 0.48, w: 6.2, h: 0.42,
        ...createTextStyle({ fontSize: 12, color: COLORS.darkGray }),
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 5 — Pricing + Close
  // ─────────────────────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addSlideBg(slide, COLORS.navy);
    addAccentBar(slide, 0.85);

    slide.addText("Ready to Own Your Category?", {
      x: 0.5, y: 0.3, w: 12.33, h: 0.8,
      ...createTextStyle({ fontSize: 34, color: COLORS.white, bold: true, align: "center" }),
    });

    slide.addText(
      `We have one open slot for ${c.topCategories[0]} in ${c.name}.\nOnce it's filled, your competitors can't join this campaign.`,
      {
        x: 0.5, y: 1.1, w: 12.33, h: 0.9,
        ...createTextStyle({ fontSize: 17, color: COLORS.lightGray, align: "center" }),
      }
    );

    // Campaign summary box
    slide.addShape("rect", {
      x: 1.0, y: 2.15, w: 11.33, h: 2.6,
      fill: { color: "243552" },
      line: { color: COLORS.gold },
    });

    slide.addText(`${c.name} Campaign Summary`, {
      x: 1.2, y: 2.3, w: 11.0, h: 0.45,
      ...createTextStyle({ fontSize: 16, color: COLORS.gold, bold: true, align: "center" }),
    });

    const summaryItems = [
      [`Target area: ${c.name} (${c.zip})`, `Households reached: ${c.targetHH}`],
      [`Standard ad investment: ${c.stdPrice}`, `Premium placement: ${c.premPrice}`],
      [`Payment: 50% deposit at signing`, `Balance: 50% due before print`],
      [`Delivery method: USPS EDDM (every household)`, `Estimated net ROI: break-even at 1-2 new customers`],
    ];

    summaryItems.forEach(([left, right], i) => {
      const y = 2.8 + i * 0.44;
      slide.addText(left, {
        x: 1.2, y, w: 5.3, h: 0.38,
        ...createTextStyle({ fontSize: 12, color: COLORS.white }),
      });
      slide.addText(right, {
        x: 6.5, y, w: 5.6, h: 0.38,
        ...createTextStyle({ fontSize: 12, color: COLORS.lightGray }),
      });
    });

    slide.addShape("rect", {
      x: 3.0, y: 5.05, w: 7.33, h: 0.8,
      fill: { color: COLORS.gold },
      line: { color: COLORS.gold },
      rectRadius: 0.08,
    });
    slide.addText("RESERVE YOUR CATEGORY — 50% DEPOSIT TO LOCK IN", {
      x: 3.0, y: 5.05, w: 7.33, h: 0.8,
      ...createTextStyle({ fontSize: 15, color: COLORS.navy, bold: true, align: "center" }),
    });

    slide.addText(
      "Questions? We'll walk you through every step. No contracts you can't understand.",
      {
        x: 0.5, y: 6.05, w: 12.33, h: 0.45,
        ...createTextStyle({ fontSize: 12, color: COLORS.midGray, align: "center" }),
      }
    );

    slide.addText("Shared Postcard Direct Mail  •  Bay Area", {
      x: 0.5, y: 6.9, w: 12.33, h: 0.35,
      ...createTextStyle({ fontSize: 10, color: "44556F", align: "center" }),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10);
  const filename = `pitch-deck_${c.name.toLowerCase().replace(/\s/g, "-")}_${date}.pptx`;

  pptx.writeFile({ fileName: filename }).then(() => {
    console.log(`✓ Saved: ${filename}`);
    console.log(`  Community:   ${c.name} (${c.zip})`);
    console.log(`  HHI:         ${c.hhi}`);
    console.log(`  Target HH:   ${c.targetHH}`);
    console.log(`  Std price:   ${c.stdPrice}  |  Premium: ${c.premPrice}`);
    console.log(`  Est. net:    ${c.net}`);
    console.log(``);
    console.log(`  QA:  soffice --headless --convert-to pdf ${filename}`);
    console.log(`       pdftoppm -jpeg -r 150 *.pdf slide`);
  });
}

const community = process.argv[2] || "danville";
buildDeck(community.toLowerCase());
