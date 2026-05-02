/**
 * EatTheElephant — Bay Area edition.
 *
 * React (JSX) task tracker for launching the SF Bay Area shared-postcard
 * direct mail business. Encodes the 50 launch tasks across five phases
 * (Setup, Prep, Sell, Produce, Deliver/Renew). Persists state via the
 * `window.storage` API (NOT localStorage) so it can run inside Claude
 * Cowork or any sandboxed Coworker shell.
 *
 * Adapted from the Austin EatTheElephant.jsx — only the data has been
 * updated for the Bay Area (zip codes in setup tasks s3–s5, pricing in
 * prep task p3). The UI, energy filtering, streak tracking, and
 * per-phase progress logic are unchanged.
 */
import React, { useEffect, useMemo, useState } from "react";

// ----- Tiny window.storage shim ----------------------------------------------
// Cowork environments expose `window.storage` (sync get/set). When running
// outside Cowork (e.g. local browser preview), fall back to localStorage so
// the app still works for development without changing call sites.
const storage = (() => {
  if (typeof window !== "undefined" && window.storage) {
    return {
      get: (k) => {
        try {
          const v = window.storage.get(k);
          return v ? JSON.parse(v) : null;
        } catch {
          return null;
        }
      },
      set: (k, v) => {
        try {
          window.storage.set(k, JSON.stringify(v));
        } catch {
          /* swallow */
        }
      },
    };
  }
  return {
    get: (k) => {
      try {
        const v = window?.localStorage?.getItem(k);
        return v ? JSON.parse(v) : null;
      } catch {
        return null;
      }
    },
    set: (k, v) => {
      try {
        window?.localStorage?.setItem(k, JSON.stringify(v));
      } catch {
        /* swallow */
      }
    },
  };
})();

const STORAGE_KEY = "ete.bay-area.v1";

// ----- Task data -------------------------------------------------------------
// Energy levels: low / medium / high
// Phase ids: setup, prep, sell, produce, deliver
const TASKS = [
  // ---------------- Setup -----------------
  { id: "s1", phase: "setup", title: "Pick a business name and check CA Secretary of State availability.", energy: "low" },
  { id: "s2", phase: "setup", title: "File California FBN with your county recorder (NOT clerk).", notes: "Bring valid ID, $26–$100 filing fee.", energy: "medium" },
  { id: "s3", phase: "setup", title: "Pick first community (recommended: Danville 94526).", notes: "Confirm 2–3 EDDM routes total 5,000–7,000 households at eddm.usps.com.", energy: "low" },
  { id: "s4", phase: "setup", title: "Pull EDDM route data for second community (San Ramon 94582 / 94583).", energy: "low" },
  { id: "s5", phase: "setup", title: "Add Pleasanton 94566 / 94588 as backup community in tracker.", energy: "low" },
  { id: "s6", phase: "setup", title: "Schedule 4-week newspaper publication for FBN (within 30 days of filing).", energy: "low" },
  { id: "s7", phase: "setup", title: "Open a business checking account (Bluevine, Mercury, or local credit union).", energy: "medium" },
  { id: "s8", phase: "setup", title: "Apply for city business license at home address (~$50–$200/year).", energy: "low" },
  { id: "s9", phase: "setup", title: "Set up a Google Workspace account on your domain.", energy: "medium" },
  { id: "s10", phase: "setup", title: "Buy a general liability insurance policy ($300–$600/year).", energy: "medium" },

  // ---------------- Prep -----------------
  { id: "p1", phase: "prep", title: "Build prospect tracker for first community (use Danville xlsx template).", energy: "medium" },
  { id: "p2", phase: "prep", title: "Build 30-business prospect list across 8–10 categories.", notes: "IDEAL / STRONG / GOOD ratings. No competing categories.", energy: "high" },
  { id: "p3", phase: "prep", title: "Confirm Bay Area pricing tiers in deck (Tier 1: $700–$900 / Tier 2: $550–$750 / Tier 3: $400–$600).", energy: "low" },
  { id: "p4", phase: "prep", title: "Customize 3-email outreach sequence for first community.", energy: "medium" },
  { id: "p5", phase: "prep", title: "Customize 10 category pitch scripts with first community references.", energy: "medium" },
  { id: "p6", phase: "prep", title: "Set up unique tracking phone numbers (CallRail or similar) for first 6 advertisers.", energy: "medium" },
  { id: "p7", phase: "prep", title: "Buy Canva Pro or hire a freelance designer for postcard layout.", energy: "low" },
  { id: "p8", phase: "prep", title: "Get 3 print quotes (MGX Copy, PsPrint, GotPrint).", energy: "medium" },
  { id: "p9", phase: "prep", title: "Pre-fill CA service agreement template with your business info.", energy: "low" },
  { id: "p10", phase: "prep", title: "Test the EDDM tool walkthrough end-to-end so you know the workflow.", energy: "medium" },

  // ---------------- Sell -----------------
  { id: "se1", phase: "sell", title: "Send Email 1 to first 10 prospects in tracker.", energy: "medium" },
  { id: "se2", phase: "sell", title: "Send Email 2 to all prospects 3 business days after Email 1.", energy: "low" },
  { id: "se3", phase: "sell", title: "Send Email 3 (with route map freebie) 7 business days after Email 1.", energy: "low" },
  { id: "se4", phase: "sell", title: "Make 5 cold-call follow-ups per day for 2 weeks.", energy: "high" },
  { id: "se5", phase: "sell", title: "Walk into 5 storefronts in your community per week.", energy: "high" },
  { id: "se6", phase: "sell", title: "Hold first creative call. Lock first category. Collect 50% deposit.", energy: "high" },
  { id: "se7", phase: "sell", title: "Hold creative calls 2–3. Lock 2 more categories.", energy: "high" },
  { id: "se8", phase: "sell", title: "Hold creative calls 4–6. Lock remaining categories (target 6 total).", energy: "high" },
  { id: "se9", phase: "sell", title: "Send signed CA service agreements to all advertisers.", energy: "low" },
  { id: "se10", phase: "sell", title: "Confirm tracking phone numbers and QR landing pages with each advertiser.", energy: "medium" },

  // ---------------- Produce -----------------
  { id: "pr1", phase: "produce", title: "Collect creative briefs from all 6 advertisers.", energy: "medium" },
  { id: "pr2", phase: "produce", title: "Collect logo files (vector preferred) and brand colors.", energy: "low" },
  { id: "pr3", phase: "produce", title: "Build first postcard layout (8.5\" x 11\" or 6.5\" x 9\", EDDM indicia top-right).", energy: "high" },
  { id: "pr4", phase: "produce", title: "Send digital proofs to all 6 advertisers. Set 3-business-day approval window.", energy: "medium" },
  { id: "pr5", phase: "produce", title: "Iterate on revisions (target 1 revision round, max 2).", energy: "medium" },
  { id: "pr6", phase: "produce", title: "Get final written proof approval from every advertiser.", energy: "low" },
  { id: "pr7", phase: "produce", title: "Send final 50% invoice to all advertisers.", energy: "low" },
  { id: "pr8", phase: "produce", title: "Confirm full payment from every advertiser before sending to print.", energy: "medium" },
  { id: "pr9", phase: "produce", title: "Submit print order. Confirm 14pt cardstock minimum.", energy: "low" },
  { id: "pr10", phase: "produce", title: "Pick up printed postcards. Verify quantity and quality.", energy: "medium" },

  // ---------------- Deliver / Renew -----------------
  { id: "d1", phase: "deliver", title: "Bundle postcards (100/bundle). Print facing slips. Fill USPS Form 3587.", energy: "medium" },
  { id: "d2", phase: "deliver", title: "Drop bundles at the DDU serving your target zip(s). Pay $0.247/piece.", energy: "high" },
  { id: "d3", phase: "deliver", title: "Confirm in-home delivery date with USPS (5–10 business days post-drop).", energy: "low" },
  { id: "d4", phase: "deliver", title: "Notify advertisers postcards have dropped. Share expected in-home dates.", energy: "low" },
  { id: "d5", phase: "deliver", title: "Pull tracking phone reports daily for 2 weeks post-drop.", energy: "low" },
  { id: "d6", phase: "deliver", title: "Send 2-week post-drop check-in to each advertiser. Capture call counts + bookings.", energy: "medium" },
  { id: "d7", phase: "deliver", title: "Collect testimonials from 2–3 happiest advertisers.", energy: "medium" },
  { id: "d8", phase: "deliver", title: "Pitch renewal at 15–20% multi-campaign discount.", energy: "medium" },
  { id: "d9", phase: "deliver", title: "Pick second community and clone tracker.", energy: "low" },
  { id: "d10", phase: "deliver", title: "Send post-campaign report (drop date, household count, route IDs) to every advertiser.", energy: "medium" },
];

const PHASES = [
  { id: "setup", label: "Setup" },
  { id: "prep", label: "Prep" },
  { id: "sell", label: "Sell" },
  { id: "produce", label: "Produce" },
  { id: "deliver", label: "Deliver / Renew" },
];

const ENERGIES = ["low", "medium", "high"];

// ----- Helpers ---------------------------------------------------------------
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  const stored = storage.get(STORAGE_KEY);
  if (stored) return stored;
  return {
    completed: {}, // { taskId: ISO date completed }
    streak: { current: 0, lastDay: null, longest: 0 },
    energyFilter: "all",
    phaseFilter: "all",
  };
}

function saveState(state) {
  storage.set(STORAGE_KEY, state);
}

function recomputeStreak(streak) {
  const today = todayISO();
  const last = streak.lastDay;
  if (!last) return { current: 1, lastDay: today, longest: Math.max(1, streak.longest) };
  if (last === today) return streak;

  const diffDays = Math.round(
    (new Date(today).getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 1) {
    const next = streak.current + 1;
    return { current: next, lastDay: today, longest: Math.max(next, streak.longest) };
  }
  return { current: 1, lastDay: today, longest: Math.max(1, streak.longest) };
}

// ----- App -------------------------------------------------------------------
export default function EatTheElephant() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completedCount = Object.keys(state.completed).length;
  const totalCount = TASKS.length;
  const overallPct = Math.round((completedCount / totalCount) * 100);

  const phaseProgress = useMemo(() => {
    return PHASES.map((p) => {
      const tasks = TASKS.filter((t) => t.phase === p.id);
      const done = tasks.filter((t) => state.completed[t.id]).length;
      return { ...p, done, total: tasks.length };
    });
  }, [state.completed]);

  function toggle(taskId) {
    setState((prev) => {
      const next = { ...prev, completed: { ...prev.completed } };
      if (next.completed[taskId]) {
        delete next.completed[taskId];
      } else {
        next.completed[taskId] = todayISO();
        next.streak = recomputeStreak(prev.streak);
      }
      return next;
    });
  }

  function setEnergyFilter(value) {
    setState((prev) => ({ ...prev, energyFilter: value }));
  }
  function setPhaseFilter(value) {
    setState((prev) => ({ ...prev, phaseFilter: value }));
  }

  const visibleTasks = TASKS.filter((t) => {
    if (state.phaseFilter !== "all" && t.phase !== state.phaseFilter) return false;
    if (state.energyFilter !== "all" && t.energy !== state.energyFilter) return false;
    return true;
  });

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Eat The Elephant — Bay Area edition</h1>
        <p style={styles.subtitle}>
          50 launch tasks across 5 phases. One bite at a time.
        </p>
      </header>

      <section style={styles.statsRow}>
        <Stat label="Overall" value={`${overallPct}%`} sub={`${completedCount} / ${totalCount}`} />
        <Stat label="Current streak" value={`${state.streak.current}d`} />
        <Stat label="Longest streak" value={`${state.streak.longest}d`} />
      </section>

      <section style={styles.phaseGrid}>
        {phaseProgress.map((p) => {
          const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
          return (
            <div key={p.id} style={styles.phaseCard}>
              <div style={styles.phaseLabel}>{p.label}</div>
              <div style={styles.phaseCount}>
                {p.done} / {p.total}
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      <section style={styles.filters}>
        <FilterGroup
          label="Phase"
          value={state.phaseFilter}
          options={[{ id: "all", label: "All" }, ...PHASES]}
          onChange={setPhaseFilter}
        />
        <FilterGroup
          label="Energy"
          value={state.energyFilter}
          options={[
            { id: "all", label: "All" },
            ...ENERGIES.map((e) => ({ id: e, label: e[0].toUpperCase() + e.slice(1) })),
          ]}
          onChange={setEnergyFilter}
        />
      </section>

      <ul style={styles.taskList}>
        {visibleTasks.map((t) => {
          const completedOn = state.completed[t.id];
          return (
            <li key={t.id} style={styles.taskItem}>
              <label style={styles.taskRow}>
                <input
                  type="checkbox"
                  checked={!!completedOn}
                  onChange={() => toggle(t.id)}
                  style={styles.checkbox}
                />
                <div style={styles.taskBody}>
                  <div style={completedOn ? styles.taskTitleDone : styles.taskTitle}>
                    {t.title}
                  </div>
                  {t.notes ? <div style={styles.taskNotes}>{t.notes}</div> : null}
                  <div style={styles.taskMeta}>
                    <span style={styles.tag}>{phaseLabel(t.phase)}</span>
                    <span style={{ ...styles.tag, ...energyTagStyle(t.energy) }}>
                      {t.energy} energy
                    </span>
                    {completedOn ? (
                      <span style={styles.taskDate}>Done {completedOn}</span>
                    ) : null}
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function phaseLabel(id) {
  const p = PHASES.find((x) => x.id === id);
  return p ? p.label : id;
}

function energyTagStyle(level) {
  if (level === "low") return { background: "#E8F4EE", color: "#1E6E3E" };
  if (level === "medium") return { background: "#FFF4DA", color: "#9A6A00" };
  return { background: "#FFE5E5", color: "#9A1F1F" };
}

function Stat({ label, value, sub }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      {sub ? <div style={styles.statSub}>{sub}</div> : null}
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div style={styles.filterGroup}>
      <span style={styles.filterLabel}>{label}</span>
      <div style={styles.filterButtons}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            style={{
              ...styles.filterBtn,
              ...(value === opt.id ? styles.filterBtnActive : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ----- Inline styles ---------------------------------------------------------
const styles = {
  app: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    color: "#1A1F2C",
    maxWidth: 880,
    margin: "0 auto",
    padding: 24,
  },
  header: { marginBottom: 16 },
  h1: { margin: 0, fontSize: 28, color: "#0E1F3A" },
  subtitle: { margin: "4px 0 0", color: "#6A7080" },
  statsRow: { display: "flex", gap: 12, margin: "16px 0" },
  stat: {
    flex: 1,
    background: "#F4F1EA",
    borderRadius: 8,
    padding: 12,
  },
  statLabel: { fontSize: 12, textTransform: "uppercase", color: "#6A7080" },
  statValue: { fontSize: 24, fontWeight: 700, color: "#0E1F3A" },
  statSub: { fontSize: 12, color: "#6A7080" },
  phaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
    margin: "16px 0",
  },
  phaseCard: {
    background: "#FFFFFF",
    border: "1px solid #E0E2E8",
    borderRadius: 8,
    padding: 12,
  },
  phaseLabel: { fontSize: 12, color: "#6A7080", textTransform: "uppercase" },
  phaseCount: { fontSize: 18, fontWeight: 700, color: "#0E1F3A", margin: "4px 0 8px" },
  progressTrack: { background: "#EAECF1", borderRadius: 999, height: 6, overflow: "hidden" },
  progressFill: { background: "#D4A03A", height: "100%" },
  filters: { display: "flex", gap: 16, margin: "16px 0" },
  filterGroup: { display: "flex", flexDirection: "column", gap: 4 },
  filterLabel: { fontSize: 11, textTransform: "uppercase", color: "#6A7080" },
  filterButtons: { display: "flex", gap: 6 },
  filterBtn: {
    padding: "6px 10px",
    border: "1px solid #D8DCE3",
    background: "#FFFFFF",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    color: "#1A1F2C",
  },
  filterBtnActive: { background: "#0E1F3A", color: "#FFFFFF", borderColor: "#0E1F3A" },
  taskList: { listStyle: "none", padding: 0, margin: 0 },
  taskItem: {
    background: "#FFFFFF",
    border: "1px solid #EEF0F4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  taskRow: { display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" },
  checkbox: { marginTop: 4, width: 18, height: 18 },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: 500, color: "#1A1F2C" },
  taskTitleDone: {
    fontSize: 15,
    color: "#9098A6",
    textDecoration: "line-through",
  },
  taskNotes: { fontSize: 13, color: "#6A7080", marginTop: 4 },
  taskMeta: { display: "flex", gap: 6, marginTop: 8, alignItems: "center", flexWrap: "wrap" },
  tag: {
    fontSize: 11,
    background: "#F4F1EA",
    color: "#6A4F00",
    padding: "2px 8px",
    borderRadius: 4,
    textTransform: "uppercase",
  },
  taskDate: { fontSize: 11, color: "#6A7080" },
};
