/**
 * EatTheElephant — SF Bay Area Direct Mail Launch Tracker
 *
 * React task tracker with persistent storage, energy-level filtering,
 * streak tracking, and per-phase progress. Adapted from Austin TX version
 * for Bay Area communities, zip codes, and pricing.
 */

const PHASES = {
  setup: { label: "Setup & Legal", emoji: "⚙️", color: "#2E86AB" },
  research: { label: "Community Research", emoji: "🔍", color: "#A23B72" },
  prep: { label: "Sales Prep", emoji: "📋", color: "#F18F01" },
  outreach: { label: "Outreach", emoji: "📞", color: "#C73E1D" },
  production: { label: "Production & Delivery", emoji: "🖨️", color: "#3B1F2B" },
  followup: { label: "Follow-Up & Growth", emoji: "📈", color: "#2D8659" },
};

const ENERGY_LEVELS = {
  low: { label: "Low Energy", emoji: "🔋", desc: "Admin, filing, copy-paste" },
  medium: { label: "Medium Energy", emoji: "⚡", desc: "Research, writing, design" },
  high: { label: "High Energy", emoji: "🔥", desc: "Calls, meetings, selling" },
};

const TASKS = [
  // ── Setup & Legal ──
  { id: "s1", phase: "setup", energy: "low", title: "Choose business name and check CA availability", notes: "Search CalGold (calgold.ca.gov) for requirements. Check name availability with CA Secretary of State." },
  { id: "s2", phase: "setup", energy: "low", title: "File FBN (Fictitious Business Name) with county recorder", notes: "File with your county recorder (NOT clerk — CA is different from TX). Cost: $26–100 depending on county. Must publish in adjudicated newspaper within 30 days." },
  { id: "s3", phase: "setup", energy: "low", title: "Publish FBN in local newspaper for 4 consecutive weeks", notes: "Required by CA law. Budget $50–150. Keep the Affidavit of Publication on file. Renew every 5 years." },
  { id: "s4", phase: "setup", energy: "low", title: "Get local business license", notes: "Most CA cities require a local business license ($50–200/year). Check with your specific city clerk." },
  { id: "s5", phase: "setup", energy: "low", title: "Open business bank account", notes: "Separate account for business income/expenses. Bring FBN filing receipt as proof of business name." },
  { id: "s6", phase: "setup", energy: "low", title: "Set up accounting (Wave, QuickBooks, or spreadsheet)", notes: "Track: ad revenue, printing costs, EDDM postage, misc expenses. Quarterly estimated tax payments required in CA." },
  { id: "s7", phase: "setup", energy: "medium", title: "Create service agreement template (CA jurisdiction)", notes: "Include: ad space terms, payment schedule (50/50), proof approval process, CA jurisdiction clause. See templates folder." },
  { id: "s8", phase: "setup", energy: "low", title: "Research CA sales tax implications (CDTFA)", notes: "Advertising services generally not taxable in CA. Printed materials sold to clients may be. Check cdtfa.ca.gov." },
  { id: "s9", phase: "setup", energy: "low", title: "Decide on LLC vs. sole prop", notes: "LLC = $800/year min CA franchise tax regardless of revenue. Sole prop = simpler but less liability protection. First-year LLC may have franchise tax waived if formed in Q4." },

  // ── Community Research ──
  { id: "r1", phase: "research", energy: "medium", title: "Run EDDM route selection for Danville (94526)", notes: "Go to eddm.usps.com → enter 94526 → filter HHI $100K+, household size 2.5+ → screenshot 2–3 viable routes → note household counts. Target 5,000–7,000 total." },
  { id: "r2", phase: "research", energy: "medium", title: "Run EDDM route selection for San Ramon (94582/94583)", notes: "Same process as Danville. San Ramon has more routes — pick 2–3 in the Dougherty Valley or Bishop Ranch corridor area." },
  { id: "r3", phase: "research", energy: "medium", title: "Verify Danville HOA activity", notes: "Search 'Danville HOA' and 'Danville community newsletter.' Confirm active HOA = residents who read community mail. Check Blackhawk HOA, Diablo Country Club HOA." },
  { id: "r4", phase: "research", energy: "medium", title: "Map Danville commercial corridors", notes: "Use Google Maps to identify: Hartz Avenue (downtown), Sycamore Valley Rd, Camino Ramon, Crow Canyon Road. These are where your advertisers operate." },
  { id: "r5", phase: "research", energy: "medium", title: "Build 30-business prospect list for Danville", notes: "Across 8–10 categories: HVAC, landscaping, pool, dentist, med spa, house cleaning, plumbing, roofing, pest control, pediatric dentist. Use Google Maps, Yelp, Chamber directory." },
  { id: "r6", phase: "research", energy: "medium", title: "Build 30-business prospect list for San Ramon", notes: "Same categories. Check Bishop Ranch Business Park area, Bollinger Canyon Rd, San Ramon Chamber of Commerce." },
  { id: "r7", phase: "research", energy: "low", title: "Locate DDU post offices for target communities", notes: "Danville PO: 200 Railroad Ave, Danville 94526. San Ramon PO: 2551 San Ramon Valley Blvd, San Ramon 94583. Verify hours and EDDM drop-off procedures." },
  { id: "r8", phase: "research", energy: "medium", title: "Research local print vendors", notes: "Search for commercial printers in Contra Costa / Alameda County. Get quotes for: 5,000–7,000 units, 8.5×11 or 6.5×9, 14pt cardstock, full color both sides. Compare 3+ vendors." },

  // ── Sales Prep ──
  { id: "p1", phase: "prep", energy: "medium", title: "Customize pitch deck for Danville", notes: "Run: node generate_deck.js --community danville. Review slides: community stats on slide 2, pricing on slide 4. Convert to PDF for email attachment." },
  { id: "p2", phase: "prep", energy: "medium", title: "Customize pitch deck for San Ramon", notes: "Run: node generate_deck.js --community sanramon. Same review process." },
  { id: "p3", phase: "prep", energy: "medium", title: "Set pricing for first campaign", notes: "Danville = Tier 1: $700–900 standard, $1,100–1,400 premium. San Ramon = Tier 1–2: $550–750 standard, $850–1,100 premium. Set your actual price within range." },
  { id: "p4", phase: "prep", energy: "medium", title: "Customize 3-email outreach sequence", notes: "Fill in all variables in email templates: community name, zip, HHI, households, pricing, your contact info. Save as ready-to-send versions." },
  { id: "p5", phase: "prep", energy: "medium", title: "Review and customize all 10 pitch scripts", notes: "Swap in Bay Area local hooks for your target community. Practice the opening hook and objection handling out loud." },
  { id: "p6", phase: "prep", energy: "medium", title: "Generate prospect tracker Excel for Danville", notes: "Run: python generate_tracker.py --community danville --output ./trackers/. Open and verify columns, categories, and summary sheet." },
  { id: "p7", phase: "prep", energy: "medium", title: "Generate prospect tracker Excel for San Ramon", notes: "Run: python generate_tracker.py --community sanramon --output ./trackers/." },
  { id: "p8", phase: "prep", energy: "medium", title: "Create sample postcard mockup", notes: "Design a sample layout showing 6–8 ad spaces on an 8.5×11 card. Include EDDM indicia placement. Use for prospect meetings." },
  { id: "p9", phase: "prep", energy: "low", title: "Set up dedicated phone number for tracking", notes: "Google Voice, OpenPhone, or Grasshopper. Use this number on all prospect outreach so you can track campaign-related calls." },

  // ── Outreach ──
  { id: "o1", phase: "outreach", energy: "high", title: "Send Email 1 to first 10 prospects (Danville)", notes: "Use email1_cold_opener.md template. Personalize each one with business name and category. Track sends in prospect tracker." },
  { id: "o2", phase: "outreach", energy: "medium", title: "Send Email 2 (day-3 follow-up) to non-responders", notes: "Use email2_day3_followup.md. Only send to prospects who didn't reply to Email 1." },
  { id: "o3", phase: "outreach", energy: "medium", title: "Send Email 3 (day-7 value-add) to remaining non-responders", notes: "Use email3_day7_value_add.md. Final email in sequence — switch to phone after this." },
  { id: "o4", phase: "outreach", energy: "high", title: "Phone call round 1 — top 10 IDEAL-rated prospects", notes: "Use category pitch scripts. Call in the morning (9–11am) for best pickup rates. Log all calls in tracker." },
  { id: "o5", phase: "outreach", energy: "high", title: "Phone call round 2 — STRONG-rated prospects", notes: "Follow up with anyone who showed interest on email or previous calls. Push for in-person meeting." },
  { id: "o6", phase: "outreach", energy: "high", title: "In-person visits to high-value prospects", notes: "Bring printed pitch deck + sample postcard mockup. Visit during business hours. Dress professionally. Target HVAC, dental, med spa first (highest lifetime value categories)." },
  { id: "o7", phase: "outreach", energy: "high", title: "Close first 3 advertisers — collect deposits", notes: "Target: 3 signed agreements with 50% deposits. Use service agreement template. Record in tracker as DEPOSIT RECEIVED." },
  { id: "o8", phase: "outreach", energy: "high", title: "Close remaining 3–5 advertisers", notes: "Fill the card to 6–8 advertisers. Use urgency: 'Only X slots left.' Update category lock status in tracker." },
  { id: "o9", phase: "outreach", energy: "medium", title: "Send signed agreements to all advertisers", notes: "Email signed service agreements with payment receipts. Confirm ad specs needed: logo, headline, offer, phone number, website." },

  // ── Production & Delivery ──
  { id: "d1", phase: "production", energy: "medium", title: "Collect ad materials from all advertisers", notes: "Need from each: logo (vector/high-res), headline or key message, offer/coupon, phone number, website. Set a deadline." },
  { id: "d2", phase: "production", energy: "medium", title: "Design postcard layout", notes: "8.5×11 or 6.5×9, 14pt cardstock. Front: main offers. Back: EDDM indicia (upper-right), remaining ads, EDDM address block. Use professional designer or Canva Pro." },
  { id: "d3", phase: "production", energy: "medium", title: "Send proofs to all advertisers for approval", notes: "Each advertiser must approve their ad space in writing (email OK). Set 48-hour approval deadline. Track in prospect tracker." },
  { id: "d4", phase: "production", energy: "medium", title: "Collect final 50% payments from all advertisers", notes: "All payments must be received before sending to print. Update tracker: Final Payment = Yes." },
  { id: "d5", phase: "production", energy: "low", title: "Send final artwork to printer", notes: "Confirm: correct size, 14pt cardstock, full color both sides, EDDM-compliant layout, quantity matches route household count + 5% overage." },
  { id: "d6", phase: "production", energy: "low", title: "Complete EDDM paperwork at eddm.usps.com", notes: "Create EDDM mailing at eddm.usps.com. Select your carrier routes. Generate facing slips. Print facing slips and postage statements." },
  { id: "d7", phase: "production", energy: "medium", title: "Pick up printed postcards and quality check", notes: "Verify: color accuracy, card thickness, EDDM indicia legible, no typos, trim is clean. Compare to approved proofs." },
  { id: "d8", phase: "production", energy: "medium", title: "Bundle postcards by carrier route", notes: "Bundle per USPS EDDM requirements. Attach facing slips to each bundle. Prepare postage payment ($0.247/piece)." },
  { id: "d9", phase: "production", energy: "medium", title: "Drop postcards at DDU post office", notes: "Deliver to the Destination Delivery Unit (DDU). Pay $0.247/piece at drop-off. Get receipt. Delivery typically happens within 3–7 business days." },

  // ── Follow-Up & Growth ──
  { id: "f1", phase: "followup", energy: "medium", title: "Contact all advertisers 2 weeks after delivery", notes: "Ask: 'How's the response been? Getting calls?' Document their feedback. This builds the relationship for renewal." },
  { id: "f2", phase: "followup", energy: "low", title: "Collect testimonials from satisfied advertisers", notes: "Ask for a 1–2 sentence quote you can use in future pitches. 'What would you tell another business owner about this campaign?'" },
  { id: "f3", phase: "followup", energy: "medium", title: "Compile campaign results report", notes: "Total revenue, total costs, net profit, per-advertiser response data (if available), testimonials. Use for future sales pitches." },
  { id: "f4", phase: "followup", energy: "high", title: "Pitch renewal to all advertisers (15–20% discount)", notes: "Offer multi-campaign discount for commitment to next 2–3 campaigns. Lock in recurring revenue." },
  { id: "f5", phase: "followup", energy: "medium", title: "Begin research for second community", notes: "If first campaign was Danville → move to San Ramon. If San Ramon → try Pleasanton. Run the full research phase for the next community." },
  { id: "f6", phase: "followup", energy: "high", title: "Launch second campaign prospecting", notes: "Apply everything learned from campaign 1. Faster this time — you have testimonials, samples, and proven results." },
];

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "eatTheElephant_bayArea_v1";

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fall through
  }
  return null;
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // silent fail
  }
}

// ─── App Component ───────────────────────────────────────────────────────────

function App() {
  const [completedIds, setCompletedIds] = React.useState(() => {
    const saved = loadState();
    return saved?.completedIds || [];
  });
  const [energyFilter, setEnergyFilter] = React.useState("all");
  const [phaseFilter, setPhaseFilter] = React.useState("all");
  const [expandedId, setExpandedId] = React.useState(null);
  const [streak, setStreak] = React.useState(() => {
    const saved = loadState();
    return saved?.streak || { count: 0, lastDate: null };
  });

  React.useEffect(() => {
    saveState({ completedIds, streak });
  }, [completedIds, streak]);

  const toggleTask = (id) => {
    setCompletedIds((prev) => {
      const isCompleting = !prev.includes(id);
      const next = isCompleting ? [...prev, id] : prev.filter((x) => x !== id);

      if (isCompleting) {
        const today = new Date().toDateString();
        setStreak((s) => {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (s.lastDate === today) return s;
          if (s.lastDate === yesterday) return { count: s.count + 1, lastDate: today };
          return { count: 1, lastDate: today };
        });
      }

      return next;
    });
  };

  const filteredTasks = TASKS.filter((t) => {
    if (energyFilter !== "all" && t.energy !== energyFilter) return false;
    if (phaseFilter !== "all" && t.phase !== phaseFilter) return false;
    return true;
  });

  const totalTasks = TASKS.length;
  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / totalTasks) * 100);

  const phaseStats = {};
  Object.keys(PHASES).forEach((p) => {
    const phaseTasks = TASKS.filter((t) => t.phase === p);
    const done = phaseTasks.filter((t) => completedIds.includes(t.id)).length;
    phaseStats[p] = { total: phaseTasks.length, done };
  });

  return React.createElement("div", { style: styles.container },
    // Header
    React.createElement("div", { style: styles.header },
      React.createElement("h1", { style: styles.title }, "🐘 EatTheElephant"),
      React.createElement("p", { style: styles.subtitle }, "SF Bay Area Direct Mail — Launch Tracker"),
      streak.count > 0 && React.createElement("div", { style: styles.streak },
        `🔥 ${streak.count} day streak`
      )
    ),

    // Progress bar
    React.createElement("div", { style: styles.progressContainer },
      React.createElement("div", { style: styles.progressBar },
        React.createElement("div", { style: { ...styles.progressFill, width: `${progressPct}%` } })
      ),
      React.createElement("span", { style: styles.progressText },
        `${completedCount}/${totalTasks} tasks (${progressPct}%)`
      )
    ),

    // Phase overview
    React.createElement("div", { style: styles.phaseGrid },
      Object.entries(PHASES).map(([key, phase]) =>
        React.createElement("div", {
          key,
          style: {
            ...styles.phaseCard,
            borderLeft: `4px solid ${phase.color}`,
            opacity: phaseStats[key].done === phaseStats[key].total ? 0.6 : 1,
          },
          onClick: () => setPhaseFilter(phaseFilter === key ? "all" : key),
        },
          React.createElement("div", { style: styles.phaseEmoji }, phase.emoji),
          React.createElement("div", { style: styles.phaseLabel }, phase.label),
          React.createElement("div", { style: styles.phaseCount },
            `${phaseStats[key].done}/${phaseStats[key].total}`
          )
        )
      )
    ),

    // Filters
    React.createElement("div", { style: styles.filters },
      React.createElement("span", { style: styles.filterLabel }, "Energy:"),
      ["all", "low", "medium", "high"].map((level) =>
        React.createElement("button", {
          key: level,
          style: {
            ...styles.filterBtn,
            background: energyFilter === level ? "#2E86AB" : "#1a2733",
          },
          onClick: () => setEnergyFilter(level),
        }, level === "all" ? "All" : ENERGY_LEVELS[level].emoji + " " + ENERGY_LEVELS[level].label)
      ),
      React.createElement("button", {
        style: {
          ...styles.filterBtn,
          background: phaseFilter === "all" ? "#2E86AB" : "#1a2733",
          marginLeft: 16,
        },
        onClick: () => setPhaseFilter("all"),
      }, "All Phases")
    ),

    // Task list
    React.createElement("div", { style: styles.taskList },
      filteredTasks.map((task) => {
        const done = completedIds.includes(task.id);
        const expanded = expandedId === task.id;
        const phase = PHASES[task.phase];

        return React.createElement("div", {
          key: task.id,
          style: {
            ...styles.taskCard,
            borderLeft: `3px solid ${phase.color}`,
            opacity: done ? 0.5 : 1,
          },
        },
          React.createElement("div", {
            style: styles.taskHeader,
            onClick: () => setExpandedId(expanded ? null : task.id),
          },
            React.createElement("input", {
              type: "checkbox",
              checked: done,
              onChange: (e) => { e.stopPropagation(); toggleTask(task.id); },
              style: styles.checkbox,
            }),
            React.createElement("span", {
              style: { ...styles.taskTitle, textDecoration: done ? "line-through" : "none" },
            }, task.title),
            React.createElement("span", { style: styles.taskEnergy },
              ENERGY_LEVELS[task.energy].emoji
            ),
            React.createElement("span", { style: styles.taskPhase }, phase.label)
          ),
          expanded && React.createElement("div", { style: styles.taskNotes }, task.notes)
        );
      })
    ),

    // Reset button
    React.createElement("div", { style: { textAlign: "center", marginTop: 30 } },
      React.createElement("button", {
        style: styles.resetBtn,
        onClick: () => {
          if (window.confirm("Reset all progress? This cannot be undone.")) {
            setCompletedIds([]);
            setStreak({ count: 0, lastDate: null });
          }
        },
      }, "Reset All Progress")
    )
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: 20 },
  header: { textAlign: "center", marginBottom: 24 },
  title: { fontSize: 36, color: "#D4A843", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 8 },
  streak: { display: "inline-block", background: "#2D1810", color: "#F18F01", padding: "4px 12px", borderRadius: 12, fontSize: 13 },
  progressContainer: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  progressBar: { flex: 1, height: 12, background: "#1a2733", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #2E86AB, #2D8659)", borderRadius: 6, transition: "width 0.3s" },
  progressText: { fontSize: 13, color: "#aaa", whiteSpace: "nowrap" },
  phaseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 20 },
  phaseCard: { background: "#1a2733", borderRadius: 6, padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "transform 0.1s" },
  phaseEmoji: { fontSize: 20 },
  phaseLabel: { fontSize: 11, color: "#aaa", marginTop: 4 },
  phaseCount: { fontSize: 14, color: "#e0e0e0", fontWeight: "bold", marginTop: 2 },
  filters: { display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  filterLabel: { fontSize: 13, color: "#888" },
  filterBtn: { border: "1px solid #2a3a4a", borderRadius: 4, padding: "4px 10px", fontSize: 12, color: "#e0e0e0", cursor: "pointer" },
  taskList: { display: "flex", flexDirection: "column", gap: 6 },
  taskCard: { background: "#1a2733", borderRadius: 6, overflow: "hidden" },
  taskHeader: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" },
  checkbox: { width: 18, height: 18, cursor: "pointer", flexShrink: 0 },
  taskTitle: { flex: 1, fontSize: 14, color: "#e0e0e0" },
  taskEnergy: { fontSize: 14 },
  taskPhase: { fontSize: 11, color: "#666", whiteSpace: "nowrap" },
  taskNotes: { padding: "0 12px 12px 40px", fontSize: 12, color: "#999", lineHeight: 1.5 },
  resetBtn: { background: "#3a1a1a", border: "1px solid #5a2a2a", color: "#e55", borderRadius: 4, padding: "6px 16px", fontSize: 12, cursor: "pointer" },
};

// ─── Render ──────────────────────────────────────────────────────────────────

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
