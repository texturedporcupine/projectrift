import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sf-bay-direct-mail-tasks";

const INITIAL_TASKS = [
  {
    id: "s1",
    phase: "Setup",
    energy: "low",
    title: "Confirm California FBN filing process for your county recorder",
    notes: "Budget $26-$100 for filing and $50-$150 for publication.",
  },
  {
    id: "s2",
    phase: "Setup",
    energy: "low",
    title: "Check city business license requirements",
    notes: "California does not have one statewide license; most cities require a local license or tax certificate.",
  },
  {
    id: "s3",
    phase: "Setup",
    energy: "medium",
    title: "Validate Danville 94526 EDDM routes",
    notes: "Pick 2-3 routes totaling 5,000-7,000 households.",
  },
  {
    id: "s4",
    phase: "Setup",
    energy: "medium",
    title: "Validate San Ramon 94582/94583 EDDM routes",
    notes: "Focus on Bishop Ranch, Dougherty Valley, and nearby homeowner clusters.",
  },
  {
    id: "s5",
    phase: "Setup",
    energy: "medium",
    title: "Validate Pleasanton 94566/94588 EDDM routes",
    notes: "Use as a second-wave campaign after proving Danville or San Ramon.",
  },
  {
    id: "p1",
    phase: "Prep",
    energy: "high",
    title: "Build 30-40 prospects across 8-10 categories",
    notes: "Do not contact two competitors in the same category at the same time.",
  },
  {
    id: "p2",
    phase: "Prep",
    energy: "medium",
    title: "Create route-specific pitch deck",
    notes: "Use household count, income tier, category exclusivity, and simple break-even math.",
  },
  {
    id: "p3",
    phase: "Prep",
    energy: "medium",
    title: "Set Bay Area pricing for the campaign",
    notes: "Tier 1 standard $700-$900, premium $1,100-$1,400. Tier 2 standard $550-$750, premium $850-$1,100.",
  },
  {
    id: "o1",
    phase: "Outreach",
    energy: "high",
    title: "Send email 1 to first-choice category prospects",
    notes: "Lead with category exclusivity and local homeowner reach.",
  },
  {
    id: "o2",
    phase: "Outreach",
    energy: "medium",
    title: "Call prospects 24-48 hours after email 1",
    notes: "Ask whether they want to review the route count and sample layout.",
  },
  {
    id: "c1",
    phase: "Close",
    energy: "high",
    title: "Collect 50% deposit and lock category",
    notes: "Category is not reserved until deposit clears.",
  },
  {
    id: "c2",
    phase: "Close",
    energy: "medium",
    title: "Collect creative assets and route proof approval",
    notes: "Final payment is due before print release.",
  },
  {
    id: "m1",
    phase: "Mail",
    energy: "high",
    title: "Complete EDDM paperwork and DDU drop-off",
    notes: "Use $0.247 per piece for postage planning; verify current USPS rate before mailing.",
  },
  {
    id: "r1",
    phase: "Renew",
    energy: "medium",
    title: "Follow up 2 weeks after delivery",
    notes: "Collect results, testimonial, and pitch renewal with a 15-20% multi-campaign discount.",
  },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function loadStoredState() {
  if (!window.storage?.get) {
    return null;
  }

  const result = await window.storage.get(STORAGE_KEY);
  if (!result) {
    return null;
  }

  const raw = typeof result === "string" ? result : result.value;
  return raw ? JSON.parse(raw) : null;
}

async function saveStoredState(state) {
  if (!window.storage?.set) {
    return;
  }

  await window.storage.set(STORAGE_KEY, JSON.stringify(state));
}

export default function EatTheElephant() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [energy, setEnergy] = useState("all");
  const [streak, setStreak] = useState({ count: 0, lastCompletedDate: null });

  useEffect(() => {
    loadStoredState().then((state) => {
      if (state?.tasks) {
        setTasks(state.tasks);
      }
      if (state?.streak) {
        setStreak(state.streak);
      }
    });
  }, []);

  useEffect(() => {
    saveStoredState({ tasks, streak });
  }, [tasks, streak]);

  const filteredTasks = useMemo(() => {
    return energy === "all" ? tasks : tasks.filter((task) => task.energy === energy);
  }, [energy, tasks]);

  const completedCount = tasks.filter((task) => task.done).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );

    const today = todayKey();
    setStreak((current) => {
      if (current.lastCompletedDate === today) {
        return current;
      }
      return { count: current.count + 1, lastCompletedDate: today };
    });
  }

  const phases = [...new Set(filteredTasks.map((task) => task.phase))];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <section className="mx-auto max-w-5xl rounded-2xl bg-slate-900 p-6 shadow-xl">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-wide text-emerald-300">
            SF Bay Area Direct Mail
          </p>
          <h1 className="text-3xl font-bold">Eat the Elephant</h1>
          <p className="mt-2 text-slate-300">
            Break the launch into small tasks, filtered by available energy.
          </p>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Progress</p>
            <p className="text-2xl font-semibold">{progress}%</p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="text-2xl font-semibold">
              {completedCount}/{tasks.length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Streak</p>
            <p className="text-2xl font-semibold">{streak.count} days</p>
          </div>
        </div>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Energy level
          </span>
          <select
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            value={energy}
            onChange={(event) => setEnergy(event.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {phases.map((phase) => (
          <section className="mb-6" key={phase}>
            <h2 className="mb-3 text-xl font-semibold">{phase}</h2>
            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.phase === phase)
                .map((task) => (
                  <label
                    className="flex gap-3 rounded-xl bg-slate-800 p-4"
                    key={task.id}
                  >
                    <input
                      checked={Boolean(task.done)}
                      className="mt-1 h-5 w-5"
                      onChange={() => toggleTask(task.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block font-medium">{task.title}</span>
                      <span className="block text-sm text-slate-400">
                        {task.notes}
                      </span>
                    </span>
                  </label>
                ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
