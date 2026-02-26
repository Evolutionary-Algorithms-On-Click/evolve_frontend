"use client";

export default function ChooseMOProblem({
  problem,
  setProblem,
  setProblemConfig,
  nextStep,
  prevStep,
}) {
  const benchmarks = {
    // Simple 2-objective problems
    branin_currin: {
      name: "BraninCurrin",
      dim: 2,
      objectives: 2,
      desc: "2D, 2 objectives. Simple bi-objective test.",
      category: "Simple",
      emoji: "🎯",
      color: "blue",
    },
    
    // DTLZ family
    dtlz1: {
      name: "DTLZ1",
      dim: "configurable",
      objectives: "configurable",
      desc: "Linear Pareto front. Configurable D and M.",
      category: "DTLZ",
      emoji: "📐",
      color: "purple",
    },
    dtlz2: {
      name: "DTLZ2",
      dim: "configurable",
      objectives: "configurable",
      desc: "Concave Pareto front. Configurable D and M.",
      category: "DTLZ",
      emoji: "🌙",
      color: "indigo",
    },
    dtlz3: {
      name: "DTLZ3",
      dim: "configurable",
      objectives: "configurable",
      desc: "Many local Pareto fronts. Configurable D and M.",
      category: "DTLZ",
      emoji: "🗻",
      color: "violet",
    },
    dtlz4: {
      name: "DTLZ4",
      dim: "configurable",
      objectives: "configurable",
      desc: "Biased density. Configurable D and M.",
      category: "DTLZ",
      emoji: "⚖️",
      color: "fuchsia",
    },
    dtlz5: {
      name: "DTLZ5",
      dim: "configurable",
      objectives: "configurable",
      desc: "Degenerate Pareto front. Configurable D and M.",
      category: "DTLZ",
      emoji: "🔀",
      color: "pink",
    },
    dtlz7: {
      name: "DTLZ7",
      dim: "configurable",
      objectives: "configurable",
      desc: "Disconnected Pareto front. Configurable D and M.",
      category: "DTLZ",
      emoji: "🧩",
      color: "rose",
    },
    
    // ZDT family
    zdt1: {
      name: "ZDT1",
      dim: "configurable",
      objectives: 2,
      desc: "Convex Pareto front. 2 objectives, configurable D.",
      category: "ZDT",
      emoji: "📈",
      color: "green",
    },
    zdt2: {
      name: "ZDT2",
      dim: "configurable",
      objectives: 2,
      desc: "Concave Pareto front. 2 objectives, configurable D.",
      category: "ZDT",
      emoji: "📉",
      color: "emerald",
    },
    zdt3: {
      name: "ZDT3",
      dim: "configurable",
      objectives: 2,
      desc: "Discontinuous Pareto front. 2 objectives, configurable D.",
      category: "ZDT",
      emoji: "⚡",
      color: "teal",
    },
    
    // Engineering problems
    vehicle_safety: {
      name: "Vehicle Safety",
      dim: 5,
      objectives: 3,
      desc: "5D, 3 objectives. Vehicle crashworthiness.",
      category: "Engineering",
      emoji: "🚗",
      color: "orange",
    },
    car_side_impact: {
      name: "Car Side Impact",
      dim: 7,
      objectives: 4,
      desc: "7D, 4 objectives. Side impact optimization.",
      category: "Engineering",
      emoji: "🚙",
      color: "amber",
    },
  };

const colorMap = {
    blue: { active: "border-blue-600 bg-blue-50", base: "border-gray-300 bg-gray-50" },
    purple: { active: "border-purple-600 bg-purple-50", base: "border-gray-300 bg-gray-50" },
    indigo: { active: "border-indigo-600 bg-indigo-50", base: "border-gray-300 bg-gray-50" },
    violet: { active: "border-violet-600 bg-violet-50", base: "border-gray-300 bg-gray-50" },
    fuchsia: { active: "border-fuchsia-600 bg-fuchsia-50", base: "border-gray-300 bg-gray-50" },
    pink: { active: "border-pink-600 bg-pink-50", base: "border-gray-300 bg-gray-50" },
    rose: { active: "border-rose-600 bg-rose-50", base: "border-gray-300 bg-gray-50" },
    green: { active: "border-green-600 bg-green-50", base: "border-gray-300 bg-gray-50" },
    emerald: { active: "border-emerald-600 bg-emerald-50", base: "border-gray-300 bg-gray-50" },
    teal: { active: "border-teal-600 bg-teal-50", base: "border-gray-300 bg-gray-50" },
    orange: { active: "border-orange-600 bg-orange-50", base: "border-gray-300 bg-gray-50" },
    amber: { active: "border-amber-600 bg-amber-50", base: "border-gray-300 bg-gray-50" },
    black: { active: "border-gray-700 bg-gray-50", base: "border-gray-300 bg-gray-50" },
  };

  const handleSelect = (key) => {
    setProblem(key);
    
    if (key !== "custom") {
      const info = benchmarks[key];
      setProblemConfig({
        dim: info.dim,
        objectives: info.objectives,
      });
    } else {
      setProblemConfig(null);
    }
  };

  const renderButton = (key, info) => {
    const isActive = problem === key;
    const colors = colorMap[info.color] || colorMap.blue;

    return (
      <button
        key={key}
        onClick={() => handleSelect(key)}
        className={`p-4 rounded-xl border transition-all text-left ${
          isActive ? `${colors.active} ` : `${colors.base} hover:shadow`
        }`}
      >
        <div className="text-3xl mb-2">{info.emoji}</div>
        <div className="font-semibold text-lg">{info.name}</div>
        <div className="text-xs opacity-70 mt-1">
          {info.dim === "configurable" ? "D: configurable" : `D: ${info.dim}`}
          {" | "}
          {info.objectives === "configurable" ? "M: configurable" : `M: ${info.objectives}`}
        </div>
        <div className="text-sm opacity-80 mt-2">{info.desc}</div>
      </button>
    );
  };

  const simple = Object.entries(benchmarks).filter(([_, v]) => v.category === "Simple");
  const dtlz = Object.entries(benchmarks).filter(([_, v]) => v.category === "DTLZ");
  const zdt = Object.entries(benchmarks).filter(([_, v]) => v.category === "ZDT");
  const engineering = Object.entries(benchmarks).filter(([_, v]) => v.category === "Engineering");

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Multi-Objective Problem
      </h2>

      <p className="text-gray-600 mb-6">
        Select a multi-objective benchmark or define your own custom problem.
      </p>

      {/* Custom Function Option */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          📤 Custom Function
        </h3>
        <button
          onClick={() => handleSelect("custom")}
          className={`w-full p-5 rounded-xl border transition-all text-left ${
            problem === "custom"
              ? "border-gray-700 bg-gray-700 text-white"
              : "border-gray-300 bg-gray-50 hover:shadow"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚙️</div>
            <div>
              <div className="font-semibold text-lg">Upload Custom Multi-Objective Function</div>
              <div className="text-sm opacity-80 mt-1">
                Define your own multi-objective optimization problem (Python code)
              </div>
            </div>
          </div>
        </button>
      </div>

     {/* Simple Problems */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟢 Simple (Fixed Dimensions)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simple.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* DTLZ Family */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟣 DTLZ Family (Scalable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dtlz.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* ZDT Family */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟢 ZDT Family (2 Objectives)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zdt.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* Engineering */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟠 Engineering Problems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {engineering.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          disabled={!problem}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}