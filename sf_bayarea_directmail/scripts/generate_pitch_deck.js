#!/usr/bin/env node
/**
 * SF Bay Area Shared Postcard Direct Mail — Pitch Deck Generator
 * Uses pptxgenjs to produce a 5-slide deck customized per community.
 *
 * Usage:
 *   node generate_pitch_deck.js [community]
 *   node generate_pitch_deck.js danville
 *   node generate_pitch_deck.js san_ramon
 *   node generate_pitch_deck.js pleasanton
 *
 * Output: pitch-deck_[community]_[YYYY-MM-DD].pptx
 */

const PptxGenJS = require("pptxgenjs");

const COMMUNITIES = {
  danville: {
    name: "Danville",
    zip: "94526",
    tier: "Tier 1 — Premium",
    medianHHI: "$185,000+",
    households: "18,000+",
    homeownership: "~85%",
    campaignHouseholds: "5,000–7,000",
    standardPrice: "$700–900",
    premiumPrice: "$1,100–1,400",
    topCategories: [
      "HVAC",
      "Landscaping",
      "Pool Service",
      "Dentist",
      "Med Spa",
      "House Cleaning",
      "Plumbing",
      "Roofing",
    ],
    hook: "Danville's tight-knit community reads their mail — 85% homeownership and active HOAs mean your postcard lands in the hands of high-income homeowners who buy local.",
    character:
      "Affluent suburban town with strong community identity, walkable downtown, and active neighborhood associations.",
  },
  san_ramon: {
    name: "San Ramon",
    zip: "94582 / 94583",
    tier: "Tier 1–2",
    medianHHI: "$160,000+",
    households: "30,000+",
    homeownership: "~75%",
    campaignHouseholds: "5,000–7,000",
    standardPrice: "$550–750",
    premiumPrice: "$850–1,100",
    topCategories: [
      "HVAC",
      "Tutoring",
      "Family Dentist",
      "Pest Control",
      "Landscaping",
      "Pool Service",
      "House Cleaning",
      "Orthodontics",
    ],
    hook: "30,000+ households of dual-income tech families actively seeking quality local services — your ad reaches them at home, where buying decisions happen.",
    character:
      "Master-planned suburban city with Bishop Ranch business park, Dougherty Valley, and family-focused demographics.",
  },
  pleasanton: {
    name: "Pleasanton",
    zip: "94566 / 94588",
    tier: "Tier 2 — Strong",
    medianHHI: "$155,000+",
    households: "28,000+",
    homeownership: "~72%",
    campaignHouseholds: "5,000–7,000",
    standardPrice: "$550–750",
    premiumPrice: "$850–1,100",
    topCategories: [
      "Pool Service",
      "Landscaping",
      "Orthodontics",
      "House Cleaning",
      "HVAC",
      "Pest Control",
      "Plumbing",
      "Tutoring",
    ],
    hook: "Pleasanton's top-rated schools and family-first culture create a community where homeowners invest in their properties — and read every piece of mail that arrives.",
    character:
      "Charming downtown, strong schools (Amador Valley, Foothill), and established suburban neighborhoods with high property values.",
  },
  dublin: {
    name: "Dublin",
    zip: "94568",
    tier: "Tier 2 — Strong",
    medianHHI: "$145,000+",
    households: "22,000+",
    homeownership: "~68%",
    campaignHouseholds: "5,000–7,000",
    standardPrice: "$550–750",
    premiumPrice: "$850–1,100",
    topCategories: [
      "HVAC",
      "Pest Control",
      "Tutoring",
      "Family Dentist",
      "Landscaping",
      "House Cleaning",
      "Plumbing",
      "Pool Service",
    ],
    hook: "Dublin is the East Bay's fastest-growing city — new homeowners are actively searching for trusted local service providers. Be the first they find.",
    character:
      "Rapidly growing master-planned communities, young families, BART-accessible, and expanding commercial corridors.",
  },
  los_gatos: {
    name: "Los Gatos",
    zip: "95030 / 95032",
    tier: "Tier 1 — Premium",
    medianHHI: "$200,000+",
    households: "12,000+",
    homeownership: "~70%",
    campaignHouseholds: "4,000–5,000",
    standardPrice: "$700–900",
    premiumPrice: "$1,100–1,400",
    topCategories: [
      "Med Spa",
      "Luxury Home Reno",
      "Pool Service",
      "Dentist",
      "Landscaping",
      "House Cleaning",
      "Interior Design",
      "Financial Planning",
    ],
    hook: "Los Gatos residents are discerning consumers with $200K+ household incomes — they expect quality, pay for quality, and respond to professionally presented offers.",
    character:
      "Upscale hillside town with walkable downtown, village feel, and clientele that values exclusivity and premium service.",
  },
};

const BRAND = {
  primary: "1B3A5C",
  accent: "D4A843",
  white: "FFFFFF",
  lightGray: "F5F5F5",
  darkText: "2D2D2D",
  mediumText: "555555",
  companyName: "Bay Area Direct Mail Co.",
  tagline: "Exclusive Local Advertising — Delivered to Every Door",
};

function buildDeck(communityKey) {
  const c = COMMUNITIES[communityKey];
  if (!c) {
    console.error(
      `Unknown community: ${communityKey}\nAvailable: ${Object.keys(COMMUNITIES).join(", ")}`
    );
    process.exit(1);
  }

  const pptx = new PptxGenJS();
  pptx.author = BRAND.companyName;
  pptx.title = `Shared Postcard Advertising — ${c.name}, CA`;
  pptx.subject = "Direct Mail Advertising Partnership";
  pptx.layout = "LAYOUT_16x9";

  // --- SLIDE 1: Hook / Cover ---
  const slide1 = pptx.addSlide();
  slide1.background = { color: BRAND.primary };

  slide1.addText(
    [
      {
        text: `Reach ${c.campaignHouseholds} Homes\nin ${c.name}`,
        options: {
          fontSize: 36,
          bold: true,
          color: BRAND.white,
          breakLine: true,
        },
      },
      {
        text: "\nExclusive Direct Mail Advertising — One Business Per Category",
        options: { fontSize: 16, color: BRAND.accent },
      },
    ],
    { x: 0.8, y: 1.2, w: 8.4, h: 3.5, align: "left", valign: "middle" }
  );

  slide1.addText(BRAND.companyName, {
    x: 0.8,
    y: 4.8,
    w: 5,
    h: 0.5,
    fontSize: 14,
    color: BRAND.accent,
    bold: true,
  });

  slide1.addText(BRAND.tagline, {
    x: 0.8,
    y: 5.2,
    w: 5,
    h: 0.4,
    fontSize: 11,
    color: BRAND.white,
    italic: true,
  });

  // --- SLIDE 2: Community Stats ---
  const slide2 = pptx.addSlide();
  slide2.background = { color: BRAND.white };

  slide2.addText(`Why ${c.name}?`, {
    x: 0.8,
    y: 0.4,
    w: 8.4,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: BRAND.primary,
  });

  slide2.addText(c.hook, {
    x: 0.8,
    y: 1.2,
    w: 8.4,
    h: 0.8,
    fontSize: 13,
    color: BRAND.mediumText,
    italic: true,
  });

  const statsData = [
    ["Metric", "Value"],
    ["Zip Code(s)", c.zip],
    ["Classification", c.tier],
    ["Median Household Income", c.medianHHI],
    ["Total Households", c.households],
    ["Homeownership Rate", c.homeownership],
    ["Campaign Reach", `${c.campaignHouseholds} households`],
    ["Community Character", c.character],
  ];

  slide2.addTable(statsData, {
    x: 0.8,
    y: 2.2,
    w: 8.4,
    colW: [3.0, 5.4],
    fontSize: 12,
    border: { type: "solid", pt: 0.5, color: "CCCCCC" },
    rowH: 0.4,
    autoPage: false,
    color: BRAND.darkText,
  });

  // --- SLIDE 3: How It Works + Exclusivity ---
  const slide3 = pptx.addSlide();
  slide3.background = { color: BRAND.lightGray };

  slide3.addText("How It Works", {
    x: 0.8,
    y: 0.4,
    w: 8.4,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: BRAND.primary,
  });

  const steps = [
    [
      "1. Category Exclusivity",
      "You are the ONLY business in your category on the postcard. No competing dentists. No competing HVAC companies. Your ad stands alone.",
    ],
    [
      "2. Professional Design",
      "We design a premium 8.5\" x 11\" postcard featuring 6–8 local businesses. You approve your ad space before printing.",
    ],
    [
      "3. USPS Every Door Direct Mail",
      `We use the USPS EDDM program to deliver to ${c.campaignHouseholds} households in ${c.name} — every single mailbox on selected carrier routes.`,
    ],
    [
      "4. Guaranteed Delivery",
      "Unlike digital ads that get scrolled past or blocked, EDDM puts a physical postcard in every resident's hands. No algorithms. No ad blockers.",
    ],
  ];

  steps.forEach((step, i) => {
    const yPos = 1.3 + i * 1.0;
    slide3.addText(step[0], {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: BRAND.primary,
    });
    slide3.addText(step[1], {
      x: 0.8,
      y: yPos + 0.35,
      w: 8.4,
      h: 0.5,
      fontSize: 11,
      color: BRAND.mediumText,
    });
  });

  // --- SLIDE 4: ROI Calculator + Pricing ---
  const slide4 = pptx.addSlide();
  slide4.background = { color: BRAND.white };

  slide4.addText("Your Investment & ROI", {
    x: 0.8,
    y: 0.4,
    w: 8.4,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: BRAND.primary,
  });

  const pricingTable = [
    ["", "Standard Ad Space", "Premium Placement"],
    ["Your Investment", c.standardPrice, c.premiumPrice],
    ["Households Reached", c.campaignHouseholds, c.campaignHouseholds],
    [
      "Cost Per Household",
      `As low as $0.10/home`,
      "Includes premium position (front or back feature)",
    ],
    [
      "Category Exclusivity",
      "Yes — sole provider in your category",
      "Yes — sole provider + prime positioning",
    ],
  ];

  slide4.addTable(pricingTable, {
    x: 0.8,
    y: 1.3,
    w: 8.4,
    colW: [2.8, 2.8, 2.8],
    fontSize: 11,
    border: { type: "solid", pt: 0.5, color: "CCCCCC" },
    rowH: 0.5,
    autoPage: false,
    color: BRAND.darkText,
  });

  slide4.addText("Break-Even Example", {
    x: 0.8,
    y: 3.8,
    w: 8.4,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: BRAND.primary,
  });

  const roiText = [
    `If your average job is $500 and you close just 2 new customers from this campaign,`,
    `you've made back your investment — and then some.`,
    ``,
    `Most local service businesses see a 3–5x return on direct mail campaigns`,
    `targeting affluent, high-homeownership communities like ${c.name}.`,
  ].join("\n");

  slide4.addText(roiText, {
    x: 0.8,
    y: 4.2,
    w: 8.4,
    h: 1.3,
    fontSize: 12,
    color: BRAND.mediumText,
  });

  // --- SLIDE 5: Pricing Summary + Close ---
  const slide5 = pptx.addSlide();
  slide5.background = { color: BRAND.primary };

  slide5.addText("Let's Get Started", {
    x: 0.8,
    y: 0.5,
    w: 8.4,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: BRAND.white,
  });

  const closePoints = [
    `Only ${c.topCategories.length} ad spaces available — one per business category`,
    "First come, first served — once your category is taken, it's locked",
    "50% deposit reserves your exclusive spot",
    "Full proof approval before we go to print",
    `${c.campaignHouseholds} households in ${c.name} will see your business`,
    "Multi-campaign discounts: 15–20% off when you commit to 2+ campaigns",
  ];

  closePoints.forEach((point, i) => {
    slide5.addText(`✓  ${point}`, {
      x: 0.8,
      y: 1.5 + i * 0.55,
      w: 8.4,
      h: 0.5,
      fontSize: 13,
      color: BRAND.white,
    });
  });

  slide5.addText("Available Categories:", {
    x: 0.8,
    y: 4.9,
    w: 2.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: BRAND.accent,
  });

  slide5.addText(c.topCategories.join("  |  "), {
    x: 3.3,
    y: 4.9,
    w: 6.0,
    h: 0.4,
    fontSize: 10,
    color: BRAND.white,
  });

  // Save
  const today = new Date().toISOString().split("T")[0];
  const filename = `pitch-deck_${communityKey}_${today}.pptx`;
  pptx.writeFile({ fileName: filename }).then(() => {
    console.log(`Deck generated: ${filename}`);
  });
}

// --- Main ---
const community = process.argv[2] || "danville";
buildDeck(community.toLowerCase().replace(/\s+/g, "_"));
