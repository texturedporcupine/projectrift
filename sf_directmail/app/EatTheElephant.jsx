/**
 * EatTheElephant — Bay Area Direct Mail Launch Task Tracker
 *
 * Bay Area adaptation of the Austin TX launch tracker.
 * All 50 launch tasks encoded across 5 phases.
 * Updated: Bay Area zip codes (s3-s5), Bay Area pricing (p3).
 *
 * Features:
 *  - Persistent storage via window.storage API (not localStorage)
 *  - Energy-level filtering (🔋Low | ⚡Medium | 🚀High)
 *  - Streak tracking
 *  - Per-phase progress bars
 *
 * Usage: Drop this file into your project and render <EatTheElephant /> in your app root.
 * Requires React 18+ (uses hooks).
 */

import React, { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Task Definitions — 50 launch tasks across 5 phases
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: "setup",
    label: "Phase 1 — Legal & Setup",
    color: "#1B2A4A",
    tasks: [
      {
        id: "s1",
        energy: "high",
        text: "Decide on business structure",
        notes:
          "Sole prop is simplest to start. LLC adds liability protection but costs $800/yr in CA franchise tax (waived first year if formed Q4). Sole prop can always convert later.",
      },
      {
        id: "s2",
        energy: "high",
        text: "File FBN (Fictitious Business Name) with county recorder",
        notes:
          "File with your county recorder — NOT the county clerk. Cost: $26-$100. Required before operating under a business name. Bring valid ID.",
      },
      {
        id: "s3",
        energy: "medium",
        text: "Publish FBN in local newspaper for 4 consecutive weeks",
        notes:
          "Required within 30 days of filing. Use an adjudicated paper — Danville (94526): Danville Weekly or Pleasanton Weekly. San Ramon (94582/83): San Ramon Express. Dublin (94568): East Bay Times. Los Gatos (95030/32): Los Gatos Weekly-Times. Budget $50-150.",
      },
      {
        id: "s4",
        energy: "medium",
        text: "Apply for city/county business license",
        notes:
          "CA has no statewide license. Check requirements for your city — most charge $50-200/year. Danville: Town of Danville. San Ramon: City of San Ramon. Pleasanton: City of Pleasanton. Dublin: City of Dublin. Los Gatos: Town of Los Gatos.",
      },
      {
        id: "s5",
        energy: "low",
        text: "Open dedicated business checking account",
        notes:
          "Keep business revenue separate from personal. Bring FBN filing, EIN (or SSN for sole prop), and business address. Chase, Bank of America, or local credit union all work.",
      },
      {
        id: "s6",
        energy: "low",
        text: "Get EIN from IRS (free at irs.gov)",
        notes:
          "Optional for sole prop using SSN, but recommended for banking and tax purposes. Takes 5 minutes online at irs.gov/EIN.",
      },
      {
        id: "s7",
        energy: "medium",
        text: "Review CDTFA sales tax rules for printing/advertising",
        notes:
          "Advertising services generally not taxable in CA. Printed materials may be taxable. Visit cdtfa.ca.gov or call 1-800-400-7115 for your specific situation.",
      },
      {
        id: "s8",
        energy: "high",
        text: "Create service agreement using CA template",
        notes:
          "Use legal/service_agreement_ca.md as the base. Fill in your FBN name, county, and contact info. Have a CA attorney review before first use if budget allows.",
      },
      {
        id: "s9",
        energy: "low",
        text: "Set up simple bookkeeping system",
        notes:
          "Wave (free), QuickBooks Self-Employed ($15/mo), or a simple spreadsheet. Track: deposits received, final payments, print costs, EDDM postage, misc expenses.",
      },
      {
        id: "s10",
        energy: "low",
        text: "Get professional email and phone number",
        notes:
          "Use a custom domain email (Google Workspace $6/mo or similar). Get a dedicated business number — Google Voice (free) or a local number via OpenPhone/Grasshopper.",
      },
    ],
  },
  {
    id: "community",
    label: "Phase 2 — Community & EDDM Research",
    color: "#2E6DA4",
    tasks: [
      {
        id: "c1",
        energy: "high",
        text: "Select first target community",
        notes:
          "Recommended: Danville (94526) — strong HOA culture, mail-reading community, good commercial corridor. Alternatives: San Ramon (94582/83) or Pleasanton (94566).",
      },
      {
        id: "c2",
        energy: "high",
        text: "Go to eddm.usps.com and map carrier routes for first community",
        notes:
          "Enter zip code → My Mailing List → Every Door Direct Mail. Filter: Household income $100K+, household size 2.5+. Screenshot 2-3 viable routes. Note: household counts, route IDs.",
      },
      {
        id: "c3",
        energy: "medium",
        text: "Lock in 2-3 EDDM carrier routes (target 5,000-7,000 households)",
        notes:
          "More than 10,000 households = too much postage cost for first campaign. Less than 4,000 = hard to fill 6-8 ad slots profitably. Sweet spot: 5,000-7,000.",
      },
      {
        id: "c4",
        energy: "medium",
        text: "Confirm active HOA exists in target community",
        notes:
          "Search '[community] HOA'. Active HOA = residents read community mail. Look for: community newsletter, active HOA website, Nextdoor group. Danville/Blackhawk, Gale Ranch (San Ramon), and Ruby Hill (Pleasanton) all have active HOAs.",
      },
      {
        id: "c5",
        energy: "low",
        text: "Map commercial corridors serving the community on Google Maps",
        notes:
          "These are where your advertisers are. Danville: Hartz Ave, Camino Tassajara, Sycamore Valley Rd. San Ramon: Bollinger Canyon Rd, Crow Canyon Rd, Bishop Ranch. Pleasanton: Hopyard Rd, Main St, Stoneridge Dr.",
      },
      {
        id: "c6",
        energy: "medium",
        text: "Research top 8-10 business categories for this community",
        notes:
          "See communities guide for category recommendations by neighborhood. Prioritize: HVAC, landscaping, pest control, dentistry, pool service for most communities.",
      },
      {
        id: "c7",
        energy: "high",
        text: "Build 30-40 business prospect list for first community",
        notes:
          "Use Google Maps, Yelp, and community Facebook groups. Find 3-4 businesses per category — you'll pitch IDEAL first, then STRONG/GOOD if they pass. Enter into prospect tracker.",
      },
      {
        id: "c8",
        energy: "medium",
        text: "Rate each prospect: IDEAL / STRONG / GOOD",
        notes:
          "IDEAL: locally known, Yelp 4.5+, obviously serves your target community. STRONG: good fit, some online presence, worth pursuing. GOOD: acceptable backup if IDEAL/STRONG pass.",
      },
      {
        id: "c9",
        energy: "low",
        text: "Identify adjudicated newspaper for FBN publication",
        notes:
          "Danville/San Ramon: Danville Weekly or Pleasanton Weekly. Pleasanton: Pleasanton Weekly. Dublin: East Bay Times. Los Gatos: Los Gatos Weekly-Times. Verify 'adjudicated' status before publishing.",
      },
      {
        id: "c10",
        energy: "low",
        text: "Calculate full campaign economics for first community",
        notes:
          "Gross (6-8 advertisers × ad price) − print cost (~$350) − EDDM postage ($0.247 × HH count) − misc ($100) = net. Confirm target net > $1,000 before pitching.",
      },
    ],
  },
  {
    id: "sales",
    label: "Phase 3 — Sales & Outreach",
    color: "#C9A84C",
    tasks: [
      {
        id: "a1",
        energy: "high",
        text: "Send Email 1 to top 3 IDEAL prospects per category",
        notes:
          "Use category-specific email templates in outreach/email_sequence_templates.md. Customize with business name, community, and local hook. Send from your professional email.",
      },
      {
        id: "a2",
        energy: "medium",
        text: "Follow up Email 2 (day 3) to all Email 1 recipients",
        notes:
          "Include ROI math specific to their category. Reference community demographics. Keep it brief — the goal is a reply or a call.",
      },
      {
        id: "a3",
        energy: "medium",
        text: "Send Email 3 (day 7) with local hook",
        notes:
          "Include one concrete local detail — HOA name, community statistic, or comparable campaign result. End with a clear call to action and deadline.",
      },
      {
        id: "a4",
        energy: "high",
        text: "Make phone calls to all non-responders after Email 3",
        notes:
          "Use pitch scripts in pitch_scripts/pitch_scripts_bay_area.md. Call during business hours (9am-5pm). Leave a voicemail referencing your email if no answer.",
      },
      {
        id: "a5",
        energy: "high",
        text: "Visit in person for top 3 IDEAL-rated prospects",
        notes:
          "Best time: Tuesday-Thursday, 10am-2pm. Bring printed pitch deck (2-3 copies). Bring a physical postcard sample if available. Ask for the decision maker — don't pitch the receptionist.",
      },
      {
        id: "a6",
        energy: "medium",
        text: "Send pitch deck to all interested prospects",
        notes:
          "Generate with: node pitch_deck/generate_pitch_deck.js [community]. Send as PDF attachment with a personal note. Reference your prior conversation.",
      },
      {
        id: "a7",
        energy: "high",
        text: "Close first advertiser (collect signed agreement + deposit)",
        notes:
          "Once they say yes: send digital service agreement, collect 50% deposit, mark category as LOCKED in tracker. Update Dashboard 'Slots Filled' count.",
      },
      {
        id: "a8",
        energy: "high",
        text: "Close 4 more advertisers (reach minimum 5 for campaign viability)",
        notes:
          "With 5 advertisers at average $600 = $3,000 gross. Costs ~$1,800. Net ~$1,200. Campaign is viable at 5. Shoot for 6-8.",
      },
      {
        id: "a9",
        energy: "medium",
        text: "Collect all signed service agreements",
        notes:
          "File naming: agreement_[business-name]_[community].md/.pdf. Keep originals in legal/ folder. Send each advertiser a copy for their records.",
      },
      {
        id: "a10",
        energy: "medium",
        text: "Send campaign confirmation to all signed advertisers",
        notes:
          "Confirm: their category, ad size, estimated mail date, artwork deadline, and final payment due date. Keep everyone aligned before design starts.",
      },
    ],
  },
  {
    id: "production",
    label: "Phase 4 — Design, Print & EDDM",
    color: "#2D7D46",
    tasks: [
      {
        id: "p1",
        energy: "high",
        text: "Collect artwork or briefs from all advertisers",
        notes:
          "Request: logo (vector preferred), business name, phone, website, key message, any offers/calls to action. Set a firm deadline — 10 business days from signing.",
      },
      {
        id: "p2",
        energy: "high",
        text: "Design postcard (or brief a designer)",
        notes:
          "Size: 8.5\"×11\" or 6.5\"×9\". 14pt cardstock minimum. EDDM indicia in upper-right corner of address side. Leave bottom 3.5\" of address side clear for addresses/indicia. Bleed: 0.125\".",
      },
      {
        id: "p3",
        energy: "medium",
        text: "Send proof to each advertiser for approval",
        notes:
          "Send digital PDF proof. Require written approval (email OK) within 3 business days. Reminder: deemed approved after 3 days per service agreement. Max 2 revision rounds included.",
      },
      {
        id: "p4",
        energy: "high",
        text: "Collect final payments from all advertisers before placing print order",
        notes:
          "Do not place the print order until all final payments are received. This is non-negotiable — it protects you from being stuck with a print bill if someone pulls out.",
      },
      {
        id: "p5",
        energy: "high",
        text: "Place print order with approved printer",
        notes:
          "Recommended printers: Got Print, PrintingForLess, or local Bay Area commercial printer. Specify: EDDM-ready, 14pt cardstock, full bleed, quantity = USPS route count + 50 samples. Turnaround: 5-7 business days.",
      },
      {
        id: "p6",
        energy: "medium",
        text: "Complete EDDM paperwork at eddm.usps.com",
        notes:
          "Create USPS.com account if needed. Select your carrier routes. Note: EDDM Retail (drop at your local post office) vs EDDM BMEU (drop at Business Mail Entry Unit — better for large quantities). Print facing slips for each route.",
      },
      {
        id: "p7",
        energy: "high",
        text: "Bundle postcards by carrier route with USPS facing slips",
        notes:
          "EDDM Retail: bundles of 50-200 pieces with a facing slip on top of each bundle. Rubber band bundles. USPS will inspect at the DDU. Bring the completed PS Form 3587 (EDDM manifest).",
      },
      {
        id: "p8",
        energy: "high",
        text: "Drop bundled postcards at DDU and pay postage ($0.247/piece)",
        notes:
          "Call ahead to schedule a DDU drop-off appointment — not all DDUs accept walk-ins. Bring: bundled postcards, facing slips, PS Form 3587, payment (check or money order preferred). Get a receipt.",
      },
      {
        id: "p9",
        energy: "low",
        text: "Send delivery confirmation to all advertisers",
        notes:
          "Email each advertiser: 'Your ad is in the mail!' Include USPS receipt, estimated delivery window (EDDM typically delivers within 2-5 business days of DDU drop), and reminder that you'll follow up in 2 weeks.",
      },
      {
        id: "p10",
        energy: "low",
        text: "Keep 10-20 sample postcards for your portfolio",
        notes:
          "Use these for: future advertiser pitches, showing next-community prospects what the product looks like, Instagram/social proof (tag advertisers with permission).",
      },
    ],
  },
  {
    id: "followup",
    label: "Phase 5 — Follow-Up & Renewal",
    color: "#6B4C9A",
    tasks: [
      {
        id: "f1",
        energy: "medium",
        text: "Follow up with every advertiser 2 weeks after delivery",
        notes:
          "Call each advertiser. Ask: 'Have you gotten any calls yet?' Listen carefully. Even 1-2 calls is enough to validate the channel. Silence is normal — ask them to track for 4 weeks total.",
      },
      {
        id: "f2",
        energy: "medium",
        text: "Collect testimonials from satisfied advertisers",
        notes:
          "Ask specifically: 'Can I quote you saying [PARAPHRASE WHAT THEY SAID] in my pitch materials?' Get written permission. A sentence or two is enough. Use in future pitch decks and emails.",
      },
      {
        id: "f3",
        energy: "low",
        text: "Build campaign report for first community",
        notes:
          "File: campaign-report_[community]_[date].xlsx. Include: advertisers, categories, gross revenue, costs, net profit, EDDM receipt, delivery confirmation. This is your proof-of-concept document.",
      },
      {
        id: "f4",
        energy: "high",
        text: "Pitch renewal to all advertisers at 15-20% multi-campaign discount",
        notes:
          "Best time to ask: during the 2-week follow-up call while excitement is fresh. Frame it as: 'Most advertisers who get results double down in the next campaign — want to lock your category for Round 2 right now?'",
      },
      {
        id: "f5",
        energy: "high",
        text: "Select second community and begin prospect research",
        notes:
          "While follow-ups are happening in Community 1, start building the prospect list for Community 2. Recommended sequence: Danville → San Ramon → Pleasanton.",
      },
      {
        id: "f6",
        energy: "medium",
        text: "Contact non-purchasers with updated offer for next campaign",
        notes:
          "Some businesses said no in Round 1. A follow-up email 4 weeks later — 'Here's how the [COMMUNITY] campaign performed for our advertisers' — reopens conversations. Social proof is your best tool.",
      },
      {
        id: "f7",
        energy: "low",
        text: "Update prospect tracker with response data",
        notes:
          "Mark: who responded, who renewed, who passed permanently. This data shapes your pitch for future campaigns — knowing which categories convert fastest saves time.",
      },
      {
        id: "f8",
        energy: "medium",
        text: "Post campaign results to any business social media",
        notes:
          "Optional but powerful: 'Our first [COMMUNITY] campaign reached 5,500 households with 6 local businesses. Now booking [NEXT COMMUNITY].' Builds credibility for future prospecting.",
      },
      {
        id: "f9",
        energy: "high",
        text: "Begin active sales for second community campaign",
        notes:
          "You now have: a completed postcard sample, a campaign report, and at least 1 testimonial. Your pitch is dramatically stronger. Start with IDEAL-rated prospects in the new community.",
      },
      {
        id: "f10",
        energy: "low",
        text: "Review financials and adjust pricing for next campaign if needed",
        notes:
          "Did you hit your target net? If margins were tight, consider: adding 1 more advertiser, raising rates 10-15% for renewal, or targeting a higher-tier community next (move from Tier 3 to Tier 2).",
      },
    ],
  },
];

const ALL_TASKS = PHASES.flatMap((p) =>
  p.tasks.map((t) => ({ ...t, phase: p.id }))
);

const ENERGY_LABELS = {
  low: { label: "🔋 Low Energy", color: "#888" },
  medium: { label: "⚡ Medium Energy", color: "#C9A84C" },
  high: { label: "🚀 High Energy", color: "#2D7D46" },
};

const STORAGE_KEY = "eatTheElephant_bayArea_v2";

// ─────────────────────────────────────────────────────────────────────────────
// Storage helpers (window.storage API, not localStorage)
// ─────────────────────────────────────────────────────────────────────────────

function readStorage() {
  try {
    if (window.storage) {
      const raw = window.storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    }
  } catch (_) {}
  return {};
}

function writeStorage(data) {
  try {
    if (window.storage) {
      window.storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (_) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function EatTheElephant() {
  const [completed, setCompleted] = useState({});
  const [energyFilter, setEnergyFilter] = useState("all");
  const [expandedPhase, setExpandedPhase] = useState("setup");
  const [expandedTask, setExpandedTask] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  // Load from storage on mount
  useEffect(() => {
    const saved = readStorage();
    setCompleted(saved.completed || {});
    setStreak(saved.streak || 0);
    setLastCompletedDate(saved.lastCompletedDate || null);
  }, []);

  // Persist to storage on change
  useEffect(() => {
    writeStorage({ completed, streak, lastCompletedDate });
  }, [completed, streak, lastCompletedDate]);

  const toggleTask = useCallback(
    (taskId) => {
      const today = new Date().toDateString();
      setCompleted((prev) => {
        const next = { ...prev };
        if (next[taskId]) {
          delete next[taskId];
        } else {
          next[taskId] = true;
          // Streak logic
          if (lastCompletedDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastCompletedDate === yesterday.toDateString()) {
              setStreak((s) => s + 1);
            } else {
              setStreak(1);
            }
            setLastCompletedDate(today);
          }
        }
        return next;
      });
    },
    [lastCompletedDate]
  );

  const totalCompleted = Object.keys(completed).length;
  const totalTasks = ALL_TASKS.length;
  const overallPct = Math.round((totalCompleted / totalTasks) * 100);

  const filteredTasks = (tasks) =>
    energyFilter === "all" ? tasks : tasks.filter((t) => t.energy === energyFilter);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>🐘 Eat The Elephant</div>
        <div style={styles.headerSub}>SF Bay Area Direct Mail Launch Tracker</div>
        <div style={styles.streakBadge}>
          🔥 {streak}-day streak
        </div>
      </div>

      {/* Overall progress */}
      <div style={styles.progressBox}>
        <div style={styles.progressLabel}>
          Overall Progress: {totalCompleted} / {totalTasks} tasks ({overallPct}%)
        </div>
        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${overallPct}%`,
              backgroundColor: overallPct === 100 ? "#2D7D46" : "#C9A84C",
            }}
          />
        </div>
      </div>

      {/* Energy filter */}
      <div style={styles.filterRow}>
        <span style={styles.filterLabel}>Filter by energy:</span>
        {["all", "low", "medium", "high"].map((e) => (
          <button
            key={e}
            style={{
              ...styles.filterBtn,
              backgroundColor: energyFilter === e ? "#1B2A4A" : "#F5F6F8",
              color: energyFilter === e ? "#fff" : "#333",
              fontWeight: energyFilter === e ? "bold" : "normal",
            }}
            onClick={() => setEnergyFilter(e)}
          >
            {e === "all" ? "All" : ENERGY_LABELS[e].label}
          </button>
        ))}
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const phaseTasks = filteredTasks(phase.tasks);
        const phaseCompleted = phase.tasks.filter((t) => completed[t.id]).length;
        const phasePct = Math.round((phaseCompleted / phase.tasks.length) * 100);
        const isExpanded = expandedPhase === phase.id;

        return (
          <div key={phase.id} style={styles.phaseCard}>
            {/* Phase header */}
            <div
              style={{ ...styles.phaseHeader, backgroundColor: phase.color }}
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
            >
              <div style={styles.phaseTitle}>{phase.label}</div>
              <div style={styles.phaseMeta}>
                {phaseCompleted}/{phase.tasks.length} done • {phasePct}%{" "}
                {isExpanded ? "▲" : "▼"}
              </div>
            </div>

            {/* Phase progress bar */}
            <div style={styles.phaseProgressBg}>
              <div
                style={{
                  ...styles.phaseProgressFill,
                  width: `${phasePct}%`,
                  backgroundColor: phase.color,
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Tasks */}
            {isExpanded && (
              <div style={styles.taskList}>
                {phaseTasks.length === 0 && (
                  <div style={styles.noTasks}>No tasks match the current energy filter.</div>
                )}
                {phaseTasks.map((task) => {
                  const done = !!completed[task.id];
                  const isExpTask = expandedTask === task.id;

                  return (
                    <div key={task.id} style={{ ...styles.taskRow, opacity: done ? 0.6 : 1 }}>
                      <div style={styles.taskMain}>
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleTask(task.id)}
                          style={styles.checkbox}
                        />
                        <div style={styles.taskContent}>
                          <div
                            style={{
                              ...styles.taskText,
                              textDecoration: done ? "line-through" : "none",
                              color: done ? "#888" : "#1B2A4A",
                            }}
                            onClick={() => setExpandedTask(isExpTask ? null : task.id)}
                          >
                            {task.text}
                          </div>
                          <div style={styles.energyTag}>
                            <span
                              style={{
                                ...styles.energyDot,
                                backgroundColor: ENERGY_LABELS[task.energy].color,
                              }}
                            />
                            <span style={styles.energyText}>
                              {ENERGY_LABELS[task.energy].label}
                            </span>
                          </div>
                        </div>
                        <button
                          style={styles.expandBtn}
                          onClick={() => setExpandedTask(isExpTask ? null : task.id)}
                          title="Show notes"
                        >
                          {isExpTask ? "▲" : "▼"}
                        </button>
                      </div>
                      {isExpTask && task.notes && (
                        <div style={styles.taskNotes}>{task.notes}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div style={styles.footer}>
        <div>Bay Area communities: Danville (94526) • San Ramon (94582/83) • Pleasanton (94566/88) • Dublin (94568) • Los Gatos (95030/32)</div>
        <div style={{ marginTop: 4 }}>Standard pricing: Tier 1 $700-900 • Tier 2 $550-750 • Tier 3 $400-600</div>
        <button
          style={styles.resetBtn}
          onClick={() => {
            if (window.confirm("Reset all progress? This cannot be undone.")) {
              setCompleted({});
              setStreak(0);
              setLastCompletedDate(null);
            }
          }}
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    maxWidth: 780,
    margin: "0 auto",
    padding: "16px 12px 40px",
    backgroundColor: "#F5F6F8",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#1B2A4A",
    color: "#fff",
    borderRadius: 10,
    padding: "20px 24px 16px",
    marginBottom: 16,
    position: "relative",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#C9A84C",
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 14,
    color: "#A0B0C8",
  },
  streakBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#C9A84C",
    color: "#1B2A4A",
    borderRadius: 20,
    padding: "4px 12px",
    fontWeight: "bold",
    fontSize: 13,
  },
  progressBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  progressLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
    fontWeight: "bold",
  },
  progressBarBg: {
    backgroundColor: "#E0E4EA",
    borderRadius: 4,
    height: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.4s ease",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  filterLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  filterBtn: {
    border: "none",
    borderRadius: 16,
    padding: "5px 14px",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  phaseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  phaseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    cursor: "pointer",
    userSelect: "none",
  },
  phaseTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  phaseMeta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  phaseProgressBg: {
    height: 4,
    backgroundColor: "#E0E4EA",
  },
  phaseProgressFill: {
    height: "100%",
    transition: "width 0.4s ease",
  },
  taskList: {
    padding: "4px 0",
  },
  noTasks: {
    padding: "16px 20px",
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
  },
  taskRow: {
    borderBottom: "1px solid #F0F2F5",
    transition: "opacity 0.2s",
  },
  taskMain: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px 14px",
    gap: 10,
  },
  checkbox: {
    marginTop: 3,
    accentColor: "#1B2A4A",
    width: 16,
    height: 16,
    cursor: "pointer",
    flexShrink: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 3,
    cursor: "pointer",
    lineHeight: 1.35,
  },
  energyTag: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  energyDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  energyText: {
    fontSize: 11,
    color: "#888",
  },
  expandBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    color: "#AAB",
    padding: "2px 6px",
    flexShrink: 0,
    alignSelf: "center",
  },
  taskNotes: {
    backgroundColor: "#F8F9FC",
    borderLeft: "3px solid #C9A84C",
    padding: "10px 14px 10px 18px",
    fontSize: 12.5,
    color: "#444",
    lineHeight: 1.55,
    margin: "0 14px 10px",
    borderRadius: "0 4px 4px 0",
  },
  footer: {
    marginTop: 24,
    padding: "12px 0",
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    lineHeight: 1.6,
  },
  resetBtn: {
    marginTop: 12,
    background: "none",
    border: "1px solid #DDD",
    borderRadius: 6,
    padding: "6px 16px",
    fontSize: 12,
    color: "#888",
    cursor: "pointer",
  },
};
