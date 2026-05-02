/**
 * EatTheElephant.jsx — Bay Area Edition
 *
 * Task tracker for the SF Bay Area shared postcard direct mail launch.
 * Adapted from the Austin TX version. All 50 launch tasks are encoded
 * across 5 phases, with per-task energy level, time estimate, and notes.
 *
 * Persistence model (carried over from the Austin build):
 *   Uses the host environment's `window.storage` API (NOT localStorage).
 *
 *   Expected interface:
 *     window.storage.get(key) -> Promise<string | null>
 *     window.storage.set(key, value) -> Promise<void>
 *
 *   When `window.storage` is missing (e.g. running in a vanilla browser
 *   for development), an in-memory fallback is used so the UI still works.
 *
 * Bay Area changes vs. Austin:
 *   - s3-s5 zip codes -> Bay Area zips (94526, 94582/94583, 94568)
 *   - p3 pricing       -> Bay Area Tier 1-2 pricing ($550-$900)
 *   - All other 47 tasks are market-neutral and unchanged.
 *
 * Usage in React 18+:
 *   import { EatTheElephant } from "./EatTheElephant.jsx";
 *   <EatTheElephant />
 */

import React, { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Persistence helpers — window.storage with in-memory fallback
// ---------------------------------------------------------------------------

const STORAGE_KEY = "ete:bay-area:state:v1";

function getStorage() {
  if (typeof window !== "undefined" && window.storage) {
    return window.storage;
  }
  const mem = new Map();
  return {
    get: async (key) => (mem.has(key) ? mem.get(key) : null),
    set: async (key, value) => {
      mem.set(key, value);
    },
  };
}

async function loadState() {
  try {
    const raw = await getStorage().get(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function saveState(state) {
  try {
    await getStorage().set(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Task model — 50 tasks across 5 phases
//
// Each task: { id, phase, title, notes, minutes, energy }
//   energy: "LOW" | "MED" | "HIGH"
// ---------------------------------------------------------------------------

const PHASES = [
  { id: "setup",    name: "Setup",            color: "#0B1F3A", emoji: "S" },
  { id: "prep",     name: "Prep & Pricing",   color: "#324466", emoji: "P" },
  { id: "outreach", name: "Outreach",         color: "#C9574A", emoji: "O" },
  { id: "campaign", name: "Campaign Build",   color: "#D4A84B", emoji: "C" },
  { id: "ship",     name: "Ship & Renew",     color: "#5C8A5A", emoji: "R" },
];

export const TASKS = [
  // ----- SETUP (10) -----
  { id: "s1",  phase: "setup", title: "File CA FBN with county recorder",
    notes: "File Fictitious Business Name with your county recorder (Alameda, Contra Costa, Santa Clara). Cost $26-$100.",
    minutes: 60, energy: "MED" },
  { id: "s2",  phase: "setup", title: "Publish FBN in adjudicated local paper for 4 weeks",
    notes: "Required within 30 days of filing. Budget $50-$150. Keep affidavit on file.",
    minutes: 30, energy: "LOW" },
  { id: "s3",  phase: "setup", title: "Pull EDDM routes for Danville (94526)",
    notes: "Visit eddm.usps.com. Filter HHI $100K+, HH size 2.5+. Screenshot 2-3 viable routes; record HH counts and route IDs.",
    minutes: 30, energy: "LOW" },
  { id: "s4",  phase: "setup", title: "Pull EDDM routes for San Ramon (94582 / 94583)",
    notes: "Same process — Dougherty Valley + Bishop Ranch corridor. Plan for ~6,000 HH per drop.",
    minutes: 30, energy: "LOW" },
  { id: "s5",  phase: "setup", title: "Pull EDDM routes for Dublin (94568)",
    notes: "Dublin Ranch + Tassajara Hills. Solid Tier 2 backup market.",
    minutes: 30, energy: "LOW" },
  { id: "s6",  phase: "setup", title: "Apply for EIN at irs.gov",
    notes: "Free, ~5 minutes online. Required for business banking.",
    minutes: 15, energy: "LOW" },
  { id: "s7",  phase: "setup", title: "Open dedicated business checking account",
    notes: "Bank of choice. Bring FBN + EIN. Avoid mixing personal funds.",
    minutes: 60, energy: "MED" },
  { id: "s8",  phase: "setup", title: "Set up Stripe (cards + ACH) for invoicing",
    notes: "Or chosen processor. Test a $1 charge to your own card.",
    minutes: 30, energy: "LOW" },
  { id: "s9",  phase: "setup", title: "Bind general liability insurance",
    notes: "Hiscox / Next / Thimble. $300-$600/yr.",
    minutes: 30, energy: "MED" },
  { id: "s10", phase: "setup", title: "Apply for city business license",
    notes: "City-by-city in CA. ~$50-$200/yr. Online application most cities.",
    minutes: 45, energy: "LOW" },

  // ----- PREP & PRICING (10) -----
  { id: "p1",  phase: "prep", title: "Choose first-campaign community",
    notes: "Default: Danville (94526). Backup: San Ramon (94582/94583).",
    minutes: 15, energy: "LOW" },
  { id: "p2",  phase: "prep", title: "Pick drop date 4-6 weeks out",
    notes: "Confirm DDU drop window with the destination post office.",
    minutes: 15, energy: "LOW" },
  { id: "p3",  phase: "prep", title: "Lock Bay Area Tier 1-2 pricing ($550-$900)",
    notes: "Reference sales/pricing_tiers.md. Standard $550-$900 / Premium $850-$1,400. Set floor.",
    minutes: 15, energy: "LOW" },
  { id: "p4",  phase: "prep", title: "Identify 8-10 non-competing categories for first campaign",
    notes: "HVAC, pest control, dentist, pediatric dentist, pool, landscape, plumbing, roofing, cleaning, med spa.",
    minutes: 20, energy: "MED" },
  { id: "p5",  phase: "prep", title: "Build prospect list — 30 businesses across 8 categories",
    notes: "Use prospects/prospect-tracker_<community>-<zip>.xlsx. Google Maps + corridor sweep.",
    minutes: 120, energy: "HIGH" },
  { id: "p6",  phase: "prep", title: "Score prospects (IDEAL / STRONG / GOOD / MAYBE / SKIP)",
    notes: "Score on local presence, owner reachability, category density, AOV.",
    minutes: 30, energy: "MED" },
  { id: "p7",  phase: "prep", title: "Customize Email #1 with community variables",
    notes: "Pull from emails/email_1_cold_opener.md. Verify hh_per_drop, anchor_neighborhood, schools_or_anchor_hook.",
    minutes: 20, energy: "MED" },
  { id: "p8",  phase: "prep", title: "Customize Emails #2 and #3",
    notes: "Reply-in-thread subject. Include cost-per-impression math + local demographics.",
    minutes: 20, energy: "MED" },
  { id: "p9",  phase: "prep", title: "Build pitch deck for the chosen community",
    notes: "Run `python deck/build_deck.py --community <key>` (or `node build-deck.js`). Inspect output.",
    minutes: 15, energy: "LOW" },
  { id: "p10", phase: "prep", title: "Print 10 hard copies of the pitch deck for in-person",
    notes: "Local printer. Use as leave-behinds at high-value prospects.",
    minutes: 30, energy: "LOW" },

  // ----- OUTREACH (10) -----
  { id: "o1",  phase: "outreach", title: "Send Email #1 to first 10 IDEAL/STRONG prospects",
    notes: "Tue-Thu, 7:30-9:00 AM. Personalize corridor + anchor.",
    minutes: 60, energy: "HIGH" },
  { id: "o2",  phase: "outreach", title: "Reply within 1 business day to all responses",
    notes: "Interest decays fast. Auto-block your morning for replies.",
    minutes: 30, energy: "MED" },
  { id: "o3",  phase: "outreach", title: "Send Email #2 (day-3) to all non-responders",
    notes: "Reply-in-thread. Include cost-per-impression math.",
    minutes: 30, energy: "MED" },
  { id: "o4",  phase: "outreach", title: "Schedule 5-8 phone calls with interested prospects",
    notes: "10-min slots. Use category-specific scripts in scripts/.",
    minutes: 60, energy: "HIGH" },
  { id: "o5",  phase: "outreach", title: "Send Email #3 (day-7) to remaining non-responders",
    notes: "Soft close + future-campaign hook. Gives standalone value.",
    minutes: 30, energy: "MED" },
  { id: "o6",  phase: "outreach", title: "Run first wave of phone calls",
    notes: "Confidence > polish. Reference objection_handler.md mid-call.",
    minutes: 90, energy: "HIGH" },
  { id: "o7",  phase: "outreach", title: "Schedule 2-3 in-person visits to high-value prospects",
    notes: "Bring leave-behind deck and a sample postcard mockup.",
    minutes: 30, energy: "MED" },
  { id: "o8",  phase: "outreach", title: "Send proposals to verbal-yes prospects",
    notes: "One-pager per advertiser. Slot price + what's included + deposit deadline.",
    minutes: 60, energy: "MED" },
  { id: "o9",  phase: "outreach", title: "Send service agreement + invoice to closed advertisers",
    notes: "templates/service_agreement_ca.docx + Stripe invoice for 50% deposit.",
    minutes: 60, energy: "MED" },
  { id: "o10", phase: "outreach", title: "Lock category exclusivity in the tracker",
    notes: "Set Category Locked? = YES on closed slots. Stop pursuing others in that category.",
    minutes: 15, energy: "LOW" },

  // ----- CAMPAIGN BUILD (10) -----
  { id: "c1",  phase: "campaign", title: "Send creative brief to each advertiser",
    notes: "templates/creative_brief.md. Collect logo, headline, offer, phone, URL, photo, disclaimers.",
    minutes: 30, energy: "MED" },
  { id: "c2",  phase: "campaign", title: "Collect creative inputs from all advertisers",
    notes: "Chase missing assets. Lock creative deadline 14 days before drop.",
    minutes: 60, energy: "MED" },
  { id: "c3",  phase: "campaign", title: "Design Postcard v1 (Figma or Canva Pro)",
    notes: "Front: hero advertiser + 2-3 secondary. Back: address area + 4-5 ad blocks.",
    minutes: 240, energy: "HIGH" },
  { id: "c4",  phase: "campaign", title: "EDDM compliance check (indicia, white address area, dimensions)",
    notes: "Use templates/creative_brief.md checklist.",
    minutes: 20, energy: "MED" },
  { id: "c5",  phase: "campaign", title: "Send proof v1 to every advertiser",
    notes: "PDF + JPEG inline. Each reviews only their ad block. 3 business day window.",
    minutes: 30, energy: "LOW" },
  { id: "c6",  phase: "campaign", title: "Collect revisions and produce proof v2",
    notes: "Two revision rounds included; bill extra rounds.",
    minutes: 90, energy: "MED" },
  { id: "c7",  phase: "campaign", title: "Get final proof sign-off from every advertiser in writing",
    notes: "Required before print release. Email confirmation is fine.",
    minutes: 30, energy: "MED" },
  { id: "c8",  phase: "campaign", title: "Collect 50% balance from every advertiser",
    notes: "Stripe invoice ~7-10 days before drop. Don't print until paid.",
    minutes: 30, energy: "MED" },
  { id: "c9",  phase: "campaign", title: "Submit print order with EDDM-aware printer",
    notes: "PrintingForLess / GotPrint / 48HourPrint / PrintRunner. 5-7 day turnaround.",
    minutes: 30, energy: "MED" },
  { id: "c10", phase: "campaign", title: "Prepare USPS Form 3587 + EDDM facing slips",
    notes: "Bundle in 50- or 100-piece bundles. One facing slip per bundle.",
    minutes: 60, energy: "MED" },

  // ----- SHIP & RENEW (10) -----
  { id: "r1",  phase: "ship", title: "Confirm DDU drop window for the target zip",
    notes: "Call the destination post office. Confirm drop time and parking.",
    minutes: 15, energy: "LOW" },
  { id: "r2",  phase: "ship", title: "Pay EDDM postage at DDU drop ($0.247/piece)",
    notes: "Bring printed Form 3587 + facing slips. Drop bundles, pay, get receipt.",
    minutes: 90, energy: "MED" },
  { id: "r3",  phase: "ship", title: "Confirm USPS delivery within 1-3 days of drop",
    notes: "Verify with carrier or by spot-checking a household on the route.",
    minutes: 15, energy: "LOW" },
  { id: "r4",  phase: "ship", title: "Send 'we dropped today' email to every advertiser",
    notes: "Keep them informed. Link tracking phone number setup if applicable.",
    minutes: 30, energy: "LOW" },
  { id: "r5",  phase: "ship", title: "2-week follow-up: ask each advertiser for response data",
    notes: "Number of calls / form fills / closed jobs. Capture in campaign report.",
    minutes: 60, energy: "MED" },
  { id: "r6",  phase: "ship", title: "Build campaign report (xlsx)",
    notes: "Per-advertiser response, total HHs reached, lessons learned, renewal recommendation.",
    minutes: 60, energy: "MED" },
  { id: "r7",  phase: "ship", title: "Pitch renewal at 15-20% multi-campaign discount",
    notes: "Strike when ROI conversation is fresh. 50%+ renewal rate is the target.",
    minutes: 60, energy: "HIGH" },
  { id: "r8",  phase: "ship", title: "Close out tracker — mark Booked / Lost / Maybe",
    notes: "Move MAYBEs into the next-campaign outreach wave.",
    minutes: 20, energy: "LOW" },
  { id: "r9",  phase: "ship", title: "Pick the next community + pull EDDM routes",
    notes: "Run the community research process for community #2.",
    minutes: 60, energy: "MED" },
  { id: "r10", phase: "ship", title: "Schedule a retro: what worked, what didn't, what to change",
    notes: "30 minutes of honest reflection beats hours of unfocused fixing.",
    minutes: 30, energy: "MED" },
];

// ---------------------------------------------------------------------------
// Streak tracking
// ---------------------------------------------------------------------------

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(aIso, bIso) {
  const a = new Date(aIso + "T00:00:00");
  const b = new Date(bIso + "T00:00:00");
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function updateStreak(prevStreak, prevLastActiveDay) {
  const today = todayKey();
  if (!prevLastActiveDay) {
    return { streak: 1, lastActiveDay: today };
  }
  if (prevLastActiveDay === today) {
    return { streak: prevStreak || 1, lastActiveDay: today };
  }
  const gap = daysBetween(prevLastActiveDay, today);
  if (gap === 1) {
    return { streak: (prevStreak || 0) + 1, lastActiveDay: today };
  }
  return { streak: 1, lastActiveDay: today };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EatTheElephant() {
  const [completed, setCompleted] = useState({}); // id -> ISO date string
  const [energyFilter, setEnergyFilter] = useState("ALL");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [streak, setStreak] = useState(0);
  const [lastActiveDay, setLastActiveDay] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved) {
        setCompleted(saved.completed || {});
        setStreak(saved.streak || 0);
        setLastActiveDay(saved.lastActiveDay || null);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ completed, streak, lastActiveDay });
  }, [completed, streak, lastActiveDay, hydrated]);

  const handleToggle = (id) => {
    setCompleted((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = todayKey();
        const updated = updateStreak(streak, lastActiveDay);
        setStreak(updated.streak);
        setLastActiveDay(updated.lastActiveDay);
      }
      return next;
    });
  };

  const phaseProgress = useMemo(() => {
    return PHASES.map((p) => {
      const tasks = TASKS.filter((t) => t.phase === p.id);
      const done = tasks.filter((t) => completed[t.id]).length;
      return {
        ...p,
        done,
        total: tasks.length,
        pct: Math.round((done / tasks.length) * 100),
      };
    });
  }, [completed]);

  const visibleTasks = useMemo(() => {
    return TASKS.filter((t) => {
      if (phaseFilter !== "ALL" && t.phase !== phaseFilter) return false;
      if (energyFilter !== "ALL" && t.energy !== energyFilter) return false;
      return true;
    });
  }, [phaseFilter, energyFilter]);

  const totalDone = Object.keys(completed).length;
  const totalPct = Math.round((totalDone / TASKS.length) * 100);

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Eat the Elephant — SF Bay Area Launch</h1>
          <p style={styles.subtitle}>
            50 tasks across 5 phases. One bite at a time.
          </p>
        </div>
        <div style={styles.streakBox}>
          <div style={styles.streakNum}>{streak}</div>
          <div style={styles.streakLabel}>day streak</div>
        </div>
      </header>

      <section style={styles.phaseRow}>
        {phaseProgress.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPhaseFilter(phaseFilter === p.id ? "ALL" : p.id)}
            style={{
              ...styles.phaseCard,
              borderColor: phaseFilter === p.id ? p.color : "#E0D8C8",
              boxShadow: phaseFilter === p.id ? `0 0 0 2px ${p.color}33` : "none",
            }}
          >
            <div style={{ ...styles.phaseEmoji, background: p.color }}>{p.emoji}</div>
            <div style={styles.phaseName}>{p.name}</div>
            <div style={styles.phaseProgressBar}>
              <div
                style={{
                  ...styles.phaseProgressFill,
                  width: `${p.pct}%`,
                  background: p.color,
                }}
              />
            </div>
            <div style={styles.phaseCount}>{p.done} / {p.total}</div>
          </button>
        ))}
      </section>

      <section style={styles.toolbar}>
        <div style={styles.totalBar}>
          <div
            style={{
              ...styles.totalBarFill,
              width: `${totalPct}%`,
            }}
          />
          <div style={styles.totalBarLabel}>{totalDone} / {TASKS.length} ({totalPct}%)</div>
        </div>
        <div style={styles.filters}>
          <span style={styles.filterLabel}>Energy:</span>
          {["ALL", "LOW", "MED", "HIGH"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEnergyFilter(e)}
              style={{
                ...styles.filterButton,
                background: energyFilter === e ? "#0B1F3A" : "transparent",
                color: energyFilter === e ? "#FFF" : "#324466",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      <section style={styles.taskList}>
        {visibleTasks.map((t) => {
          const phase = PHASES.find((p) => p.id === t.phase);
          const done = !!completed[t.id];
          return (
            <div
              key={t.id}
              style={{
                ...styles.taskCard,
                opacity: done ? 0.55 : 1,
                borderLeftColor: phase.color,
              }}
            >
              <button
                type="button"
                aria-pressed={done}
                onClick={() => handleToggle(t.id)}
                style={{
                  ...styles.checkbox,
                  background: done ? phase.color : "#FFF",
                  borderColor: phase.color,
                }}
              >
                {done ? "Done" : ""}
              </button>
              <div style={styles.taskBody}>
                <div style={styles.taskTitleRow}>
                  <span style={styles.taskId}>{t.id.toUpperCase()}</span>
                  <span style={{
                    ...styles.taskPhasePill,
                    background: phase.color,
                  }}>{phase.name}</span>
                  <span style={styles.taskEnergy(t.energy)}>{t.energy}</span>
                  <span style={styles.taskMinutes}>~{t.minutes}m</span>
                </div>
                <div style={{
                  ...styles.taskTitle,
                  textDecoration: done ? "line-through" : "none",
                }}>{t.title}</div>
                <div style={styles.taskNotes}>{t.notes}</div>
              </div>
            </div>
          );
        })}
        {visibleTasks.length === 0 && (
          <div style={styles.emptyState}>No tasks match this filter.</div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  root: {
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    color: "#324466",
    background: "#F4EFE6",
    minHeight: "100vh",
    padding: "32px 24px 64px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  h1: { color: "#0B1F3A", margin: 0, fontSize: 28 },
  subtitle: { margin: "6px 0 0", color: "#5A6B85" },
  streakBox: {
    background: "#0B1F3A",
    color: "#D4A84B",
    padding: "12px 18px",
    borderRadius: 12,
    textAlign: "center",
    minWidth: 96,
  },
  streakNum: { fontSize: 30, fontWeight: 800, lineHeight: 1, color: "#D4A84B" },
  streakLabel: { fontSize: 11, color: "#FFF", marginTop: 2, opacity: 0.85 },
  phaseRow: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
    marginBottom: 20,
  },
  phaseCard: {
    background: "#FFF",
    border: "1px solid #E0D8C8",
    borderRadius: 10,
    padding: "14px 12px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 120ms",
  },
  phaseEmoji: {
    width: 28, height: 28, borderRadius: 6,
    color: "#FFF", fontWeight: 800, fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  phaseName: { fontWeight: 700, color: "#0B1F3A", marginBottom: 8 },
  phaseProgressBar: {
    height: 6, background: "#ECE5D4", borderRadius: 999, overflow: "hidden",
  },
  phaseProgressFill: { height: "100%", borderRadius: 999, transition: "width 200ms" },
  phaseCount: { fontSize: 11, color: "#5A6B85", marginTop: 6 },

  toolbar: {
    display: "flex", gap: 16, alignItems: "center",
    flexWrap: "wrap", marginBottom: 20,
  },
  totalBar: {
    flex: 1, minWidth: 240, position: "relative",
    height: 28, background: "#FFF", borderRadius: 6, overflow: "hidden",
    border: "1px solid #E0D8C8",
  },
  totalBarFill: {
    position: "absolute", top: 0, left: 0, height: "100%",
    background: "linear-gradient(90deg, #0B1F3A, #324466)",
    transition: "width 250ms",
  },
  totalBarLabel: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#FFF", fontSize: 12, fontWeight: 700,
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  },
  filters: { display: "flex", gap: 6, alignItems: "center" },
  filterLabel: { fontSize: 12, color: "#5A6B85", marginRight: 4 },
  filterButton: {
    border: "1px solid #C9C0AB", borderRadius: 6,
    padding: "6px 10px", fontSize: 12, cursor: "pointer",
  },

  taskList: { display: "grid", gap: 10 },
  taskCard: {
    display: "flex", gap: 14, alignItems: "flex-start",
    background: "#FFF", border: "1px solid #E0D8C8",
    borderLeft: "4px solid",
    borderRadius: 8, padding: 14,
    transition: "opacity 120ms",
  },
  checkbox: {
    width: 56, height: 56, borderRadius: 6,
    border: "2px solid", color: "#FFF", fontWeight: 700,
    fontSize: 11, cursor: "pointer", flexShrink: 0,
  },
  taskBody: { flex: 1, minWidth: 0 },
  taskTitleRow: {
    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
    fontSize: 11, marginBottom: 4,
  },
  taskId: {
    fontWeight: 700, color: "#5A6B85", letterSpacing: 0.5,
  },
  taskPhasePill: {
    color: "#FFF", padding: "2px 8px", borderRadius: 999, fontWeight: 600,
  },
  taskEnergy: (level) => ({
    padding: "2px 8px", borderRadius: 999, fontWeight: 700,
    background: level === "HIGH" ? "#C9574A33" :
                level === "MED"  ? "#D4A84B33" :
                                   "#5C8A5A33",
    color:      level === "HIGH" ? "#C9574A" :
                level === "MED"  ? "#8B6F2A" :
                                   "#3F6240",
  }),
  taskMinutes: { color: "#5A6B85" },
  taskTitle: { fontWeight: 700, color: "#0B1F3A", fontSize: 16, marginBottom: 4 },
  taskNotes: { color: "#5A6B85", fontSize: 13, lineHeight: 1.4 },

  emptyState: {
    background: "#FFF", borderRadius: 8, padding: 32,
    textAlign: "center", color: "#5A6B85",
  },
};

export default EatTheElephant;
