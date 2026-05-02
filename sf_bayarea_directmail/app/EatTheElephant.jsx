/**
 * EatTheElephant — Bay Area Direct Mail Launch Task Tracker
 *
 * React app with persistent storage, energy-level filtering,
 * streak tracking, and per-phase progress.
 *
 * Phases: Setup (s), Prep (p), Outreach (o), Design (d), Delivery (v), Follow-Up (f)
 *
 * Usage: Include in an HTML file with React 18 CDN, or use with a bundler.
 */

const { useState, useEffect, useCallback } = React;

const PHASES = {
  s: { name: "Setup", color: "#1B3A5C", icon: "🔧" },
  p: { name: "Prep", color: "#2E7D32", icon: "📋" },
  o: { name: "Outreach", color: "#E65100", icon: "📞" },
  d: { name: "Design", color: "#6A1B9A", icon: "🎨" },
  v: { name: "Delivery", color: "#00838F", icon: "📬" },
  f: { name: "Follow-Up", color: "#D4A843", icon: "🔄" },
};

const ENERGY_LEVELS = {
  high: { label: "High Energy", emoji: "⚡", desc: "Calls, meetings, big decisions" },
  medium: { label: "Medium Energy", emoji: "💪", desc: "Research, writing, planning" },
  low: { label: "Low Energy", emoji: "🧘", desc: "Data entry, filing, simple tasks" },
};

const TASKS = [
  // --- SETUP PHASE ---
  { id: "s1", phase: "s", energy: "medium", text: "File California FBN (Fictitious Business Name) with county recorder", notes: "Cost: $26–100 depending on county. File with county RECORDER (not clerk — CA-specific). Must publish in adjudicated newspaper within 30 days for 4 consecutive weeks." },
  { id: "s2", phase: "s", energy: "low", text: "Publish FBN in local newspaper (4 consecutive weeks)", notes: "Budget $50–150 for publication. Keep the affidavit of publication on file. Renew every 5 years." },
  { id: "s3", phase: "s", energy: "medium", text: "Research EDDM routes for Danville (94526)", notes: "Go to eddm.usps.com → enter 94526 → filter HHI $100K+, household size 2.5+. Screenshot 2–3 routes totaling 5,000–7,000 households." },
  { id: "s4", phase: "s", energy: "medium", text: "Research EDDM routes for San Ramon (94582/94583)", notes: "Two zip codes. 94583 = central/older San Ramon, 94582 = Dougherty Valley/newer. Pick one or both for 5,000–7,000 households." },
  { id: "s5", phase: "s", energy: "medium", text: "Research EDDM routes for Pleasanton (94566)", notes: "Start with 94566. Target Ruby Hill, Vintage Hills, Birdland neighborhoods for highest income density." },
  { id: "s6", phase: "s", energy: "low", text: "Obtain city business license", notes: "California cities require local business licenses ($50–200/year). Check with your specific city's business license office." },
  { id: "s7", phase: "s", energy: "medium", text: "Set up business bank account", notes: "Sole prop can use DBA. Bring FBN filing, ID, and initial deposit. Keep business and personal finances separate." },
  { id: "s8", phase: "s", energy: "low", text: "Decide: sole proprietorship vs. LLC", notes: "LLC = $800/year CA franchise tax minimum (regardless of revenue). Sole prop is simpler to start. First-year LLC may get waiver if formed Q4." },
  { id: "s9", phase: "s", energy: "medium", text: "Research print vendors (Bay Area)", notes: "Get quotes for 8.5x11 or 6.5x9, 14pt cardstock, full bleed, 5,000–8,000 quantity. Compare local vs. online (e.g., PrintingForLess, NextDayFlyers)." },
  { id: "s10", phase: "s", energy: "low", text: "Locate DDU (Destination Delivery Unit) for target zip codes", notes: "Find the specific post office that serves as DDU for 94526/94582/94566. Call to confirm EDDM drop-off hours and bundling requirements." },

  // --- PREP PHASE ---
  { id: "p1", phase: "p", energy: "medium", text: "Build prospect list — Danville (30–40 businesses)", notes: "Use Google Maps to identify businesses on Hartz Ave, Diablo Rd, Crow Canyon Rd. Cover 8–10 non-competing categories. Record name, phone, address, Google rating." },
  { id: "p2", phase: "p", energy: "medium", text: "Build prospect list — San Ramon (30–40 businesses)", notes: "Focus on Bollinger Canyon Rd, San Ramon Valley Blvd, Crow Canyon near I-680, Dougherty Valley commercial center." },
  { id: "p3", phase: "p", energy: "medium", text: "Finalize pricing for first campaign", notes: "Bay Area Tier 1 (Danville): $700–900 standard, $1,100–1,400 premium. Tier 2 (San Ramon): $550–750 standard, $850–1,100 premium. First campaign: consider $500–700 introductory rate." },
  { id: "p4", phase: "p", energy: "medium", text: "Customize pitch deck for first target community", notes: "Update slide 2 community stats, slide 4 pricing, all neighborhood references. Generate with: node generate_pitch_deck.js danville" },
  { id: "p5", phase: "p", energy: "medium", text: "Customize 3-email outreach sequence", notes: "Swap [COMMUNITY], [ZIP], [MEDIAN HHI], [CAMPAIGN HOUSEHOLDS] placeholders with actual values for first target community." },
  { id: "p6", phase: "p", energy: "low", text: "Generate prospect tracker spreadsheet", notes: "Run: python generate_prospect_tracker.py danville — creates Excel with category columns, outreach status, contact fields." },
  { id: "p7", phase: "p", energy: "medium", text: "Research competitor direct mail in target area", notes: "Check if ValPak, Money Mailer, or other shared mailers currently serve the target community. Know what you're competing against." },
  { id: "p8", phase: "p", energy: "low", text: "Prepare service agreement for first advertiser", notes: "Use the California service agreement template. Fill in community, zip, pricing, and timeline. Have ready before first pitch meeting." },

  // --- OUTREACH PHASE ---
  { id: "o1", phase: "o", energy: "high", text: "Send Email 1 (cold opener) to top 10 prospects", notes: "Personalize each email — reference Google rating, years in business, or something specific. Don't batch-send identical emails." },
  { id: "o2", phase: "o", energy: "high", text: "Send Email 2 (day-3 follow-up) to non-responders", notes: "Only send to those who didn't reply to Email 1. Include urgency — mention other businesses in the same category you're talking to." },
  { id: "o3", phase: "o", energy: "high", text: "Send Email 3 (day-7 value-add) — final touch", notes: "Last email. Respectful scarcity close. Mention you'll move on to their competitor if they're not interested." },
  { id: "o4", phase: "o", energy: "high", text: "Phone follow-up — call top 5 IDEAL-rated prospects", notes: "Use the category-specific pitch script. Have the pitch deck ready to screen-share or email immediately." },
  { id: "o5", phase: "o", energy: "high", text: "Schedule and conduct in-person meetings (high-value)", notes: "For premium placement prospects or businesses over $800/ad space. Bring printed pitch deck, sample postcard, and service agreement." },
  { id: "o6", phase: "o", energy: "high", text: "Close first 2–3 advertisers — collect deposits", notes: "Target: minimum 4 advertisers to run the campaign. Goal: 6–8. Get 50% deposit and signed agreement from each." },
  { id: "o7", phase: "o", energy: "high", text: "Close remaining advertiser spots (4–8 total)", notes: "Continue outreach until all spots are filled or you have minimum 5–6 advertisers. Use scarcity — 'only 2 spots left.'" },
  { id: "o8", phase: "o", energy: "medium", text: "Collect ad content from all signed advertisers", notes: "Need from each: logo (vector preferred), phone number, website, offer/promotion, tagline. Set 7-business-day deadline." },

  // --- DESIGN PHASE ---
  { id: "d1", phase: "d", energy: "medium", text: "Design postcard layout — front side", notes: "EDDM indicia upper-right. Return address upper-left. 3–4 ad spaces. Community headline. Use solid hex fills only." },
  { id: "d2", phase: "d", energy: "medium", text: "Design postcard layout — back side", notes: "3–4 ad spaces plus premium placement (largest). Bay Area Direct Mail footer. All text minimum 8pt body, 12pt headlines." },
  { id: "d3", phase: "d", energy: "low", text: "Send proofs to all advertisers for approval", notes: "PDF proof via email. Give 3 business days for approval. Up to 2 revision rounds included." },
  { id: "d4", phase: "d", energy: "medium", text: "Collect all proof approvals", notes: "Written approval (email reply) required from each advertiser. No response after 3 days = deemed approved per agreement." },
  { id: "d5", phase: "d", energy: "medium", text: "Collect final payments (50% balance) from all advertisers", notes: "Must receive before sending to printer. Follow up immediately on any late payments — 7-day grace per agreement." },
  { id: "d6", phase: "d", energy: "low", text: "Prepare print-ready files", notes: "Export to PDF with bleeds, crop marks. 300 DPI minimum. Verify CMYK color mode. Include 5% overage in print quantity." },
  { id: "d7", phase: "d", energy: "medium", text: "Send files to printer — confirm turnaround", notes: "Confirm: quantity, paper stock (14pt), finish (gloss/matte), turnaround time, delivery/pickup." },

  // --- DELIVERY PHASE ---
  { id: "v1", phase: "v", energy: "medium", text: "Receive printed postcards — quality check", notes: "Inspect a sample: colors accurate, text legible, cardstock weight correct, no printing defects. Compare to approved proof." },
  { id: "v2", phase: "v", energy: "low", text: "Bundle postcards by carrier route", notes: "EDDM requires bundling: face up, address side visible, bundled by carrier route. Use rubber bands or shrink wrap per USPS specs." },
  { id: "v3", phase: "v", energy: "medium", text: "Complete EDDM paperwork at eddm.usps.com", notes: "Create EDDM mailing. Select carrier routes. Generate PS Form 3587. Print facing slips for each bundle." },
  { id: "v4", phase: "v", energy: "medium", text: "Drop off bundled postcards at DDU", notes: "Bring: bundled postcards with facing slips, completed PS Form 3587, payment ($0.247/piece). Get receipt as delivery confirmation." },
  { id: "v5", phase: "v", energy: "low", text: "Send delivery confirmation to all advertisers", notes: "Email each advertiser: 'Your postcards were delivered to USPS on [DATE]. Expected in-home delivery: [DATE + 3–5 days].' Attach DDU receipt." },

  // --- FOLLOW-UP PHASE ---
  { id: "f1", phase: "f", energy: "medium", text: "2-week check-in with all advertisers", notes: "Call or email each advertiser ~2 weeks after delivery. Ask: 'Have you noticed any increase in calls? Any customers mentioning the postcard?'" },
  { id: "f2", phase: "f", energy: "medium", text: "Collect testimonials from satisfied advertisers", notes: "Ask for a quote you can use in future pitches. Even a simple 'We got 5 calls from the postcard' is valuable social proof." },
  { id: "f3", phase: "f", energy: "high", text: "Pitch renewal / next campaign to current advertisers", notes: "Offer 15–20% multi-campaign discount. Present results from this campaign. Lock in 2-campaign commitment." },
  { id: "f4", phase: "f", energy: "medium", text: "Build prospect list for next community", notes: "If first campaign was Danville, next target San Ramon or Pleasanton. Use the same research process." },
  { id: "f5", phase: "f", energy: "low", text: "Update campaign report with final metrics", notes: "Record: total revenue, total costs, net profit, number of advertiser inquiries, renewal rate. Use for future pitches." },
  { id: "f6", phase: "f", energy: "medium", text: "Generate campaign report for advertisers", notes: "Create a simple 1-page report: households reached, delivery confirmation, advertiser lineup, next campaign date." },
  { id: "f7", phase: "f", energy: "high", text: "Plan and launch Campaign #2", notes: "Apply lessons learned. Target the next community. Goal: faster fill rate with testimonials from Campaign #1." },
];

function loadState() {
  try {
    const saved = window.localStorage.getItem("eattheelephant_bayarea_state");
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return { completed: {}, streak: 0, lastCompletedDate: null };
}

function saveState(state) {
  try {
    window.localStorage.setItem("eattheelephant_bayarea_state", JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function App() {
  const [state, setState] = useState(loadState);
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterEnergy, setFilterEnergy] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => { saveState(state); }, [state]);

  const toggleTask = useCallback((taskId) => {
    setState(prev => {
      const completed = { ...prev.completed };
      const today = getToday();
      let streak = prev.streak;
      let lastCompletedDate = prev.lastCompletedDate;

      if (completed[taskId]) {
        delete completed[taskId];
      } else {
        completed[taskId] = today;
        if (lastCompletedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          streak = lastCompletedDate === yesterdayStr ? streak + 1 : 1;
          lastCompletedDate = today;
        }
      }
      return { completed, streak, lastCompletedDate };
    });
  }, []);

  const filteredTasks = TASKS.filter(t => {
    if (filterPhase !== "all" && t.phase !== filterPhase) return false;
    if (filterEnergy !== "all" && t.energy !== filterEnergy) return false;
    if (!showCompleted && state.completed[t.id]) return false;
    return true;
  });

  const totalTasks = TASKS.length;
  const completedCount = Object.keys(state.completed).length;
  const progressPct = Math.round((completedCount / totalTasks) * 100);

  const phaseProgress = {};
  Object.keys(PHASES).forEach(p => {
    const phaseTasks = TASKS.filter(t => t.phase === p);
    const phaseCompleted = phaseTasks.filter(t => state.completed[t.id]);
    phaseProgress[p] = { total: phaseTasks.length, completed: phaseCompleted.length };
  });

  return React.createElement("div", { style: styles.container },
    // Header
    React.createElement("div", { style: styles.header },
      React.createElement("h1", { style: styles.title }, "🐘 Eat The Elephant"),
      React.createElement("p", { style: styles.subtitle }, "SF Bay Area Direct Mail — Launch Tracker"),
      React.createElement("div", { style: styles.streakBadge },
        `🔥 ${state.streak} day streak`
      )
    ),

    // Overall Progress
    React.createElement("div", { style: styles.progressSection },
      React.createElement("div", { style: styles.progressBar },
        React.createElement("div", {
          style: { ...styles.progressFill, width: `${progressPct}%` }
        })
      ),
      React.createElement("div", { style: styles.progressText },
        `${completedCount} / ${totalTasks} tasks complete (${progressPct}%)`
      )
    ),

    // Phase Progress Cards
    React.createElement("div", { style: styles.phaseGrid },
      Object.entries(PHASES).map(([key, phase]) =>
        React.createElement("div", {
          key,
          style: {
            ...styles.phaseCard,
            borderLeft: `4px solid ${phase.color}`,
            cursor: "pointer",
            opacity: filterPhase === key ? 1 : filterPhase === "all" ? 1 : 0.5,
          },
          onClick: () => setFilterPhase(filterPhase === key ? "all" : key),
        },
          React.createElement("div", { style: styles.phaseCardTitle },
            `${phase.icon} ${phase.name}`
          ),
          React.createElement("div", { style: styles.phaseCardProgress },
            `${phaseProgress[key].completed}/${phaseProgress[key].total}`
          )
        )
      )
    ),

    // Filters
    React.createElement("div", { style: styles.filters },
      React.createElement("div", { style: styles.filterGroup },
        React.createElement("label", { style: styles.filterLabel }, "Energy Level:"),
        Object.entries(ENERGY_LEVELS).map(([key, level]) =>
          React.createElement("button", {
            key,
            style: {
              ...styles.filterBtn,
              backgroundColor: filterEnergy === key ? "#1B3A5C" : "#e0e0e0",
              color: filterEnergy === key ? "#fff" : "#333",
            },
            onClick: () => setFilterEnergy(filterEnergy === key ? "all" : key),
          }, `${level.emoji} ${level.label}`)
        )
      ),
      React.createElement("label", { style: styles.checkboxLabel },
        React.createElement("input", {
          type: "checkbox",
          checked: showCompleted,
          onChange: () => setShowCompleted(!showCompleted),
        }),
        " Show completed tasks"
      )
    ),

    // Task List
    React.createElement("div", { style: styles.taskList },
      filteredTasks.length === 0
        ? React.createElement("div", { style: styles.emptyState },
            showCompleted
              ? "No tasks match your filters."
              : "All matching tasks complete! 🎉 Adjust filters to see more."
          )
        : filteredTasks.map(task => {
            const isCompleted = !!state.completed[task.id];
            const isExpanded = expandedTask === task.id;
            const phase = PHASES[task.phase];

            return React.createElement("div", {
              key: task.id,
              style: {
                ...styles.taskItem,
                borderLeft: `4px solid ${phase.color}`,
                opacity: isCompleted ? 0.6 : 1,
              }
            },
              React.createElement("div", { style: styles.taskHeader },
                React.createElement("input", {
                  type: "checkbox",
                  checked: isCompleted,
                  onChange: () => toggleTask(task.id),
                  style: styles.checkbox,
                }),
                React.createElement("div", { style: styles.taskContent },
                  React.createElement("span", {
                    style: {
                      ...styles.taskText,
                      textDecoration: isCompleted ? "line-through" : "none",
                    }
                  }, task.text),
                  React.createElement("div", { style: styles.taskMeta },
                    React.createElement("span", {
                      style: { ...styles.badge, backgroundColor: phase.color }
                    }, phase.name),
                    React.createElement("span", { style: styles.energyBadge },
                      ENERGY_LEVELS[task.energy].emoji
                    ),
                    React.createElement("span", { style: styles.taskId }, task.id),
                  )
                ),
                React.createElement("button", {
                  style: styles.expandBtn,
                  onClick: () => setExpandedTask(isExpanded ? null : task.id),
                }, isExpanded ? "▲" : "▼")
              ),
              isExpanded && React.createElement("div", { style: styles.taskNotes },
                task.notes
              )
            );
          })
    ),

    // Footer
    React.createElement("div", { style: styles.footer },
      React.createElement("p", null, "Bay Area Direct Mail Co. — Launch Tracker"),
      React.createElement("p", { style: styles.footerSmall },
        "One bite at a time. 🐘"
      )
    )
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
    padding: "20px 0",
  },
  title: {
    fontSize: 32,
    color: "#1B3A5C",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    margin: 0,
  },
  streakBadge: {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 12px",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    fontSize: 13,
    color: "#E65100",
    fontWeight: 600,
  },
  progressSection: { marginBottom: 24 },
  progressBar: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1B3A5C",
    borderRadius: 6,
    transition: "width 0.3s ease",
  },
  progressText: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  phaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 8,
    marginBottom: 20,
  },
  phaseCard: {
    padding: "10px 12px",
    backgroundColor: "#fff",
    borderRadius: 6,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  phaseCardTitle: { fontSize: 12, fontWeight: 600, color: "#333" },
  phaseCardProgress: { fontSize: 18, fontWeight: 700, color: "#1B3A5C", marginTop: 4 },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  filterGroup: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  filterLabel: { fontSize: 13, fontWeight: 600, color: "#555" },
  filterBtn: {
    padding: "4px 10px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
  },
  checkboxLabel: { fontSize: 13, color: "#555", cursor: "pointer" },
  taskList: { marginBottom: 40 },
  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 6,
    padding: "10px 14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  },
  taskHeader: { display: "flex", alignItems: "flex-start", gap: 10 },
  checkbox: { marginTop: 3, cursor: "pointer", accentColor: "#1B3A5C" },
  taskContent: { flex: 1 },
  taskText: { fontSize: 14, color: "#333", lineHeight: 1.4 },
  taskMeta: { display: "flex", gap: 6, marginTop: 4, alignItems: "center" },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 3,
    fontSize: 10,
    color: "#fff",
    fontWeight: 600,
  },
  energyBadge: { fontSize: 14 },
  taskId: { fontSize: 10, color: "#aaa", fontFamily: "monospace" },
  expandBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    color: "#999",
    padding: "2px 6px",
  },
  taskNotes: {
    marginTop: 8,
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    fontSize: 12,
    color: "#555",
    lineHeight: 1.5,
    marginLeft: 28,
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#999",
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    padding: "20px 0",
    borderTop: "1px solid #e0e0e0",
    color: "#999",
    fontSize: 12,
  },
  footerSmall: { fontSize: 11, marginTop: 4 },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
