const pptxgen = require("pptxgenjs");

// ─── Community Data ──────────────────────────────────────────────────────────

const COMMUNITIES = {
  danville: {
    name: "Danville",
    zip: "94526",
    state: "CA",
    tier: "Tier 1 — Premium",
    medianHHI: "$185,000+",
    households: "18,000+",
    homeownership: "~80%",
    medianHomeValue: "$1.8M+",
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
    description:
      "Affluent Tri-Valley suburb with strong community identity, active HOAs, and a walkable downtown on Hartz Avenue.",
    standardAd: "$700–900",
    premiumAd: "$1,100–1,400",
    routeHouseholds: "5,000–7,000",
  },
  sanramon: {
    name: "San Ramon",
    zip: "94582/94583",
    state: "CA",
    tier: "Tier 1–2",
    medianHHI: "$160,000+",
    households: "30,000+",
    homeownership: "~70%",
    medianHomeValue: "$1.4M+",
    topCategories: [
      "HVAC",
      "Tutoring",
      "Family Dentist",
      "Pest Control",
      "House Cleaning",
      "Landscaping",
      "Med Spa",
      "Orthodontics",
    ],
    description:
      "Master-planned Tri-Valley city anchored by Bishop Ranch business park. High-income tech and corporate professionals.",
    standardAd: "$550–750",
    premiumAd: "$850–1,100",
    routeHouseholds: "5,000–8,000",
  },
  pleasanton: {
    name: "Pleasanton",
    zip: "94566/94588",
    state: "CA",
    tier: "Tier 2 — Strong",
    medianHHI: "$155,000+",
    households: "28,000+",
    homeownership: "~70%",
    medianHomeValue: "$1.3M+",
    topCategories: [
      "Pool Service",
      "Landscaping",
      "Orthodontics",
      "House Cleaning",
      "HVAC",
      "Pest Control",
      "Dentist",
      "Plumbing",
    ],
    description:
      "Well-established Tri-Valley city with charming downtown, excellent schools, and strong family orientation.",
    standardAd: "$550–750",
    premiumAd: "$850–1,100",
    routeHouseholds: "5,000–8,000",
  },
  losgatos: {
    name: "Los Gatos",
    zip: "95030/95032",
    state: "CA",
    tier: "Tier 1 — Premium",
    medianHHI: "$200,000+",
    households: "12,000+",
    homeownership: "~65%",
    medianHomeValue: "$2.2M+",
    topCategories: [
      "Med Spa",
      "Luxury Reno",
      "Pool Service",
      "Dentist",
      "Landscaping",
      "House Cleaning",
      "Plumbing",
      "Estate Planning",
    ],
    description:
      "Charming hillside town at base of Santa Cruz Mountains. Upscale boutique character with walkable downtown.",
    standardAd: "$700–900",
    premiumAd: "$1,100–1,400",
    routeHouseholds: "4,000–6,000",
  },
  dublin: {
    name: "Dublin",
    zip: "94568",
    state: "CA",
    tier: "Tier 2 — Strong",
    medianHHI: "$145,000+",
    households: "22,000+",
    homeownership: "~60%",
    medianHomeValue: "$1.1M+",
    topCategories: [
      "HVAC",
      "Pest Control",
      "Tutoring",
      "Family Dentist",
      "Landscaping",
      "House Cleaning",
      "Pediatric Dentist",
      "Home Organization",
    ],
    description:
      "Fast-growing Tri-Valley city with master-planned developments and young professional families.",
    standardAd: "$400–600",
    premiumAd: "$650–850",
    routeHouseholds: "5,000–7,000",
  },
};

// ─── Color Palette ───────────────────────────────────────────────────────────

const COLORS = {
  navy: "1B2A4A",
  gold: "D4A843",
  white: "FFFFFF",
  lightGray: "F5F5F5",
  darkGray: "333333",
  medGray: "666666",
  accent: "2E86AB",
  green: "2D8659",
  lightBlue: "E8F4F8",
};

// ─── Slide Builders ──────────────────────────────────────────────────────────

function buildSlide1_Cover(pres, community) {
  const slide = pres.addSlide();

  // Navy background
  slide.background = { fill: COLORS.navy };

  // Top gold accent line
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.06,
    fill: { color: COLORS.gold },
  });

  // Main headline
  slide.addText("Reach Every Household in", {
    x: 0.8,
    y: 1.2,
    w: 8.4,
    h: 0.8,
    fontSize: 28,
    color: COLORS.white,
    fontFace: "Arial",
    align: "center",
  });

  slide.addText(`${community.name}, ${community.state}`, {
    x: 0.8,
    y: 1.9,
    w: 8.4,
    h: 1.0,
    fontSize: 44,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  // Subheadline
  slide.addText(
    `${community.routeHouseholds} households  •  One postcard  •  Your exclusive ad space`,
    {
      x: 0.8,
      y: 3.1,
      w: 8.4,
      h: 0.6,
      fontSize: 18,
      color: COLORS.white,
      fontFace: "Arial",
      align: "center",
    }
  );

  // Divider
  slide.addShape(pres.ShapeType.rect, {
    x: 3.5,
    y: 3.9,
    w: 3.0,
    h: 0.02,
    fill: { color: COLORS.gold },
  });

  // EDDM description
  slide.addText("USPS Every Door Direct Mail  •  Shared Postcard Advertising", {
    x: 0.8,
    y: 4.2,
    w: 8.4,
    h: 0.5,
    fontSize: 14,
    color: COLORS.medGray,
    fontFace: "Arial",
    align: "center",
    italic: true,
  });

  // Bottom bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 5.25,
    w: "100%",
    h: 0.25,
    fill: { color: COLORS.gold },
  });

  slide.addText("Shared Postcard Direct Mail  •  SF Bay Area", {
    x: 0.5,
    y: 5.27,
    w: 9.0,
    h: 0.2,
    fontSize: 10,
    color: COLORS.navy,
    fontFace: "Arial",
    align: "center",
    bold: true,
  });
}

function buildSlide2_CommunityStats(pres, community) {
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };

  // Header bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.8,
    fill: { color: COLORS.navy },
  });

  slide.addText(`Why ${community.name}?`, {
    x: 0.5,
    y: 0.1,
    w: 9.0,
    h: 0.6,
    fontSize: 28,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "left",
  });

  // Community description
  slide.addText(community.description, {
    x: 0.5,
    y: 1.1,
    w: 9.0,
    h: 0.6,
    fontSize: 14,
    color: COLORS.medGray,
    fontFace: "Arial",
    italic: true,
  });

  // Stats boxes
  const stats = [
    { label: "Median HHI", value: community.medianHHI, icon: "💰" },
    { label: "Households", value: community.households, icon: "🏠" },
    { label: "Homeownership", value: community.homeownership, icon: "🔑" },
    { label: "Home Value", value: community.medianHomeValue, icon: "📈" },
  ];

  stats.forEach((stat, i) => {
    const x = 0.5 + i * 2.35;
    const y = 2.0;

    slide.addShape(pres.ShapeType.rect, {
      x: x,
      y: y,
      w: 2.1,
      h: 1.3,
      fill: { color: COLORS.lightBlue },
      rectRadius: 0.1,
    });

    slide.addText(stat.value, {
      x: x,
      y: y + 0.15,
      w: 2.1,
      h: 0.6,
      fontSize: 22,
      color: COLORS.navy,
      fontFace: "Arial",
      bold: true,
      align: "center",
    });

    slide.addText(stat.label, {
      x: x,
      y: y + 0.75,
      w: 2.1,
      h: 0.4,
      fontSize: 12,
      color: COLORS.medGray,
      fontFace: "Arial",
      align: "center",
    });
  });

  // Zip code and tier info
  slide.addText(`ZIP: ${community.zip}  •  ${community.tier}`, {
    x: 0.5,
    y: 3.6,
    w: 9.0,
    h: 0.4,
    fontSize: 14,
    color: COLORS.accent,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  // Target route info
  slide.addText(
    `Target campaign: ${community.routeHouseholds} households via 2–3 USPS carrier routes`,
    {
      x: 0.5,
      y: 4.0,
      w: 9.0,
      h: 0.4,
      fontSize: 13,
      color: COLORS.darkGray,
      fontFace: "Arial",
      align: "center",
    }
  );

  // Top categories
  const catText = community.topCategories.join("  •  ");
  slide.addText(`Top Categories: ${catText}`, {
    x: 0.5,
    y: 4.6,
    w: 9.0,
    h: 0.5,
    fontSize: 11,
    color: COLORS.medGray,
    fontFace: "Arial",
    align: "center",
  });
}

function buildSlide3_HowItWorks(pres, community) {
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };

  // Header
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.8,
    fill: { color: COLORS.navy },
  });

  slide.addText("How It Works — Your Exclusive Ad Space", {
    x: 0.5,
    y: 0.1,
    w: 9.0,
    h: 0.6,
    fontSize: 26,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
  });

  // Steps
  const steps = [
    {
      num: "1",
      title: "One Postcard, One Category",
      desc: `A professionally designed 8.5"×11" postcard mailed to ${community.routeHouseholds} households in ${community.name}. Your business is the ONLY one in your category — no competing ads.`,
    },
    {
      num: "2",
      title: "USPS Every Door Direct Mail",
      desc: "USPS delivers to every residential address on selected carrier routes. No mailing list required. No addresses to buy. Just blanket coverage of your target neighborhood.",
    },
    {
      num: "3",
      title: "Professional Design Included",
      desc: "Your ad space is designed by our team. You provide your logo, key message, and offer — we handle layout, proofing, and print coordination. Full proof approval before print.",
    },
    {
      num: "4",
      title: "Category Exclusivity Guaranteed",
      desc: "Only one HVAC company. Only one dentist. Only one landscaper. Your competitors cannot buy space on the same card. Exclusivity is the core value proposition.",
    },
  ];

  steps.forEach((step, i) => {
    const y = 1.1 + i * 1.05;

    // Step number circle
    slide.addShape(pres.ShapeType.ellipse, {
      x: 0.5,
      y: y + 0.05,
      w: 0.5,
      h: 0.5,
      fill: { color: COLORS.navy },
    });

    slide.addText(step.num, {
      x: 0.5,
      y: y + 0.05,
      w: 0.5,
      h: 0.5,
      fontSize: 18,
      color: COLORS.gold,
      fontFace: "Arial",
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Step content
    slide.addText(step.title, {
      x: 1.2,
      y: y,
      w: 8.3,
      h: 0.35,
      fontSize: 16,
      color: COLORS.navy,
      fontFace: "Arial",
      bold: true,
    });

    slide.addText(step.desc, {
      x: 1.2,
      y: y + 0.35,
      w: 8.3,
      h: 0.55,
      fontSize: 11,
      color: COLORS.medGray,
      fontFace: "Arial",
    });
  });
}

function buildSlide4_ROI(pres, community) {
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.white };

  // Header
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.8,
    fill: { color: COLORS.navy },
  });

  slide.addText("The Math — Your Investment & Return", {
    x: 0.5,
    y: 0.1,
    w: 9.0,
    h: 0.6,
    fontSize: 26,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
  });

  // Pricing table
  const tableRows = [
    [
      { text: "Option", options: { bold: true, color: COLORS.white, fill: { color: COLORS.navy } } },
      { text: "Your Investment", options: { bold: true, color: COLORS.white, fill: { color: COLORS.navy } } },
      { text: "Households Reached", options: { bold: true, color: COLORS.white, fill: { color: COLORS.navy } } },
      { text: "Cost per Household", options: { bold: true, color: COLORS.white, fill: { color: COLORS.navy } } },
    ],
    [
      { text: "Standard Ad Space" },
      { text: community.standardAd, options: { bold: true, color: COLORS.navy } },
      { text: community.routeHouseholds },
      { text: "$0.08–0.18" },
    ],
    [
      { text: "Premium Placement" },
      { text: community.premiumAd, options: { bold: true, color: COLORS.navy } },
      { text: community.routeHouseholds },
      { text: "$0.14–0.28" },
    ],
  ];

  slide.addTable(tableRows, {
    x: 0.5,
    y: 1.1,
    w: 9.0,
    fontSize: 12,
    fontFace: "Arial",
    border: { type: "solid", pt: 0.5, color: "CCCCCC" },
    colW: [2.5, 2.2, 2.2, 2.1],
    rowH: [0.4, 0.4, 0.4],
    align: "center",
    valign: "middle",
  });

  // ROI calculator
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5,
    y: 2.5,
    w: 9.0,
    h: 1.8,
    fill: { color: COLORS.lightBlue },
    rectRadius: 0.1,
  });

  slide.addText("Break-Even Calculator", {
    x: 0.7,
    y: 2.6,
    w: 8.6,
    h: 0.4,
    fontSize: 18,
    color: COLORS.navy,
    fontFace: "Arial",
    bold: true,
  });

  const roiLines = [
    `If your average job is $500 and you close just 1 customer from ${community.routeHouseholds} households…`,
    "→ You've already BROKEN EVEN on a Standard Ad Space.",
    "",
    "If your average job is $2,000+ (HVAC, roofing, dental)…",
    "→ One new customer pays for your ad space 2–4x over.",
    "",
    "Direct mail averages a 4.4% response rate vs. 0.12% for email (DMA 2023).",
  ];

  slide.addText(roiLines.join("\n"), {
    x: 0.7,
    y: 3.0,
    w: 8.6,
    h: 1.2,
    fontSize: 12,
    color: COLORS.darkGray,
    fontFace: "Arial",
    lineSpacingMultiple: 1.3,
  });

  // Bottom callout
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5,
    y: 4.6,
    w: 9.0,
    h: 0.5,
    fill: { color: COLORS.green },
    rectRadius: 0.1,
  });

  slide.addText(
    "Multi-campaign discount: 15–20% off when you commit to 2+ campaigns",
    {
      x: 0.5,
      y: 4.6,
      w: 9.0,
      h: 0.5,
      fontSize: 14,
      color: COLORS.white,
      fontFace: "Arial",
      bold: true,
      align: "center",
      valign: "middle",
    }
  );
}

function buildSlide5_Close(pres, community) {
  const slide = pres.addSlide();
  slide.background = { fill: COLORS.navy };

  // Gold accent
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.06,
    fill: { color: COLORS.gold },
  });

  // Headline
  slide.addText("Secure Your Exclusive Category", {
    x: 0.8,
    y: 0.8,
    w: 8.4,
    h: 0.7,
    fontSize: 32,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText(
    `Only ONE business per category on the ${community.name} postcard.\nCategories are filling — don't let your competitor take your spot.`,
    {
      x: 0.8,
      y: 1.6,
      w: 8.4,
      h: 0.8,
      fontSize: 16,
      color: COLORS.white,
      fontFace: "Arial",
      align: "center",
      lineSpacingMultiple: 1.4,
    }
  );

  // Pricing summary
  slide.addShape(pres.ShapeType.rect, {
    x: 1.5,
    y: 2.7,
    w: 3.3,
    h: 1.3,
    fill: { color: "243A5E" },
    rectRadius: 0.1,
  });

  slide.addText("Standard Ad Space", {
    x: 1.5,
    y: 2.8,
    w: 3.3,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText(community.standardAd, {
    x: 1.5,
    y: 3.15,
    w: 3.3,
    h: 0.5,
    fontSize: 28,
    color: COLORS.white,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText(`${community.routeHouseholds} households`, {
    x: 1.5,
    y: 3.6,
    w: 3.3,
    h: 0.3,
    fontSize: 11,
    color: COLORS.medGray,
    fontFace: "Arial",
    align: "center",
  });

  slide.addShape(pres.ShapeType.rect, {
    x: 5.2,
    y: 2.7,
    w: 3.3,
    h: 1.3,
    fill: { color: "243A5E" },
    rectRadius: 0.1,
  });

  slide.addText("Premium Placement", {
    x: 5.2,
    y: 2.8,
    w: 3.3,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText(community.premiumAd, {
    x: 5.2,
    y: 3.15,
    w: 3.3,
    h: 0.5,
    fontSize: 28,
    color: COLORS.white,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText("Larger space + preferred position", {
    x: 5.2,
    y: 3.6,
    w: 3.3,
    h: 0.3,
    fontSize: 11,
    color: COLORS.medGray,
    fontFace: "Arial",
    align: "center",
  });

  // Next steps
  slide.addText("Next Steps", {
    x: 0.8,
    y: 4.2,
    w: 8.4,
    h: 0.4,
    fontSize: 18,
    color: COLORS.gold,
    fontFace: "Arial",
    bold: true,
    align: "center",
  });

  slide.addText(
    "1. Choose your category  →  2. 50% deposit secures your spot  →  3. We design your ad  →  4. Approve proof  →  5. Postcards delivered",
    {
      x: 0.5,
      y: 4.6,
      w: 9.0,
      h: 0.5,
      fontSize: 12,
      color: COLORS.white,
      fontFace: "Arial",
      align: "center",
    }
  );

  // Bottom bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 5.25,
    w: "100%",
    h: 0.25,
    fill: { color: COLORS.gold },
  });

  slide.addText(
    "Shared Postcard Direct Mail  •  SF Bay Area  •  USPS EDDM",
    {
      x: 0.5,
      y: 5.27,
      w: 9.0,
      h: 0.2,
      fontSize: 10,
      color: COLORS.navy,
      fontFace: "Arial",
      align: "center",
      bold: true,
    }
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

function generateDeck(communityKey) {
  const community = COMMUNITIES[communityKey];
  if (!community) {
    console.error(
      `Unknown community: ${communityKey}. Available: ${Object.keys(COMMUNITIES).join(", ")}`
    );
    process.exit(1);
  }

  const pres = new pptxgen();
  pres.title = `Shared Postcard Direct Mail — ${community.name}, CA`;
  pres.subject = "EDDM Shared Postcard Advertising";
  pres.author = "SF Bay Area Direct Mail";

  buildSlide1_Cover(pres, community);
  buildSlide2_CommunityStats(pres, community);
  buildSlide3_HowItWorks(pres, community);
  buildSlide4_ROI(pres, community);
  buildSlide5_Close(pres, community);

  const today = new Date().toISOString().split("T")[0];
  const filename = `pitch-deck_${community.name.toLowerCase().replace(/\s+/g, "-")}_${today}.pptx`;

  pres
    .writeFile({ fileName: filename })
    .then(() => console.log(`Generated: ${filename}`))
    .catch((err) => console.error("Error generating deck:", err));
}

// ─── CLI Handling ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let communityArg = "danville";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--community" && args[i + 1]) {
    communityArg = args[i + 1].toLowerCase();
  }
}

if (args.includes("--all")) {
  Object.keys(COMMUNITIES).forEach((key) => generateDeck(key));
} else {
  generateDeck(communityArg);
}
