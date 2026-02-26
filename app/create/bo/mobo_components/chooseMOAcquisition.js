"use client";

export default function ChooseMOAcquisition({
  acquisition,
  setAcquisition,
  nextStep,
  prevStep,
}) {
  const acquisitions = {
    // Hypervolume-based
    qnehvi: {
      name: "qNEHVI",
      fullName: "Noisy Expected Hypervolume Improvement",
      desc: "Best for noisy evaluations. Robust default choice.",
      category: "Hypervolume",
      color: "purple",
    },
    qehvi: {
      name: "qEHVI",
      fullName: "Expected Hypervolume Improvement",
      desc: "For noiseless evaluations. Fast and effective.",
      category: "Hypervolume",
      color: "indigo",
    },
    qlog_nehvi: {
      name: "qLogNEHVI",
      fullName: "Log-scaled NEHVI",
      desc: "Log-space variant. Better numerical stability.",
      category: "Hypervolume",
      color: "violet",
    },
    qlog_ehvi: {
      name: "qLogEHVI",
      fullName: "Log-scaled EHVI",
      desc: "Log-space EHVI. Numerically stable.",
      category: "Hypervolume",
      color: "fuchsia",
    },

    // ParEGO variants
    qlog_nparego: {
      name: "qLogNParEGO",
      fullName: "Built-in Log N-ParEGO",
      desc: "Scalarization + qNEI. Good for many objectives.",
      category: "ParEGO",
      color: "blue",
    },
    qnparego: {
      name: "qNParEGO",
      fullName: "Manual N-ParEGO (Chebyshev)",
      desc: "Random Chebyshev scalarization + qNEI.",
      category: "ParEGO",
      color: "cyan",
    },

    // Scalarized
    scalarized_qei: {
      name: "Scalarized qEI",
      fullName: "Scalarized Expected Improvement",
      desc: "Random weights → single objective qEI.",
      category: "Scalarized",
      color: "green",
    },
    scalarized_qnei: {
      name: "Scalarized qNEI",
      fullName: "Scalarized Noisy Expected Improvement",
      desc: "Random weights → single objective qNEI.",
      category: "Scalarized",
      color: "emerald",
    },
    scalarized_qucb: {
      name: "Scalarized qUCB",
      fullName: "Scalarized Upper Confidence Bound",
      desc: "Random weights → single objective qUCB.",
      category: "Scalarized",
      color: "teal",
    },
    scalarized_qpi: {
      name: "Scalarized qPI",
      fullName: "Scalarized Probability of Improvement",
      desc: "Random weights → single objective qPI.",
      category: "Scalarized",
      color: "lime",
    },
    scalarized_qsr: {
      name: "Scalarized qSR",
      fullName: "Scalarized Simple Regret",
      desc: "Random weights → single objective qSR.",
      category: "Scalarized",
      color: "yellow",
    },

    // Weighted-sum
    weighted_sum_qei: {
      name: "Weighted-Sum qEI",
      fullName: "Equal Weights + qEI",
      desc: "Equal weights across objectives + qEI.",
      category: "Weighted",
      color: "orange",
    },
  };

  const colorMap = {
    purple: { active: "border-purple-600 bg-purple-50", base: "border-gray-300 bg-gray-50" },
    indigo: { active: "border-indigo-600 bg-indigo-50", base: "border-gray-300 bg-gray-50" },
    violet: { active: "border-violet-600 bg-violet-50", base: "border-gray-300 bg-gray-50" },
    fuchsia: { active: "border-fuchsia-600 bg-fuchsia-50", base: "border-gray-300 bg-gray-50" },
    blue: { active: "border-blue-600 bg-blue-50", base: "border-gray-300 bg-gray-50" },
    cyan: { active: "border-cyan-600 bg-cyan-50", base: "border-gray-300 bg-gray-50" },
    green: { active: "border-green-600 bg-green-50", base: "border-gray-300 bg-gray-50" },
    emerald: { active: "border-emerald-600 bg-emerald-50", base: "border-gray-300 bg-gray-50" },
    teal: { active: "border-teal-600 bg-teal-50", base: "border-gray-300 bg-gray-50" },
    lime: { active: "border-lime-600 bg-lime-50", base: "border-gray-300 bg-gray-50" },
    yellow: { active: "border-yellow-600 bg-yellow-50", base: "border-gray-300 bg-gray-50" },
    orange: { active: "border-orange-600 bg-orange-50", base: "border-gray-300 bg-gray-50" },
  };

  const renderButton = (key, info) => {
    const isActive = acquisition === key;
    const colors = colorMap[info.color] || colorMap.purple;

    return (
      <button
        key={key}
        onClick={() => setAcquisition(key)}
        className={`p-4 rounded-xl border transition-all text-left ${
          isActive ? colors.active : `${colors.base} hover:shadow`
        }`}
      >
        <div className="font-semibold text-lg text-gray-900">{info.name}</div>
        <div className="text-xs text-gray-600 mt-1">{info.fullName}</div>
        <div className="text-sm text-gray-700 mt-2">{info.desc}</div>
      </button>
    );
  };

  const hypervolume = Object.entries(acquisitions).filter(([_, v]) => v.category === "Hypervolume");
  const parego = Object.entries(acquisitions).filter(([_, v]) => v.category === "ParEGO");
  const scalarized = Object.entries(acquisitions).filter(([_, v]) => v.category === "Scalarized");
  const weighted = Object.entries(acquisitions).filter(([_, v]) => v.category === "Weighted");

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Multi-Objective Acquisition Function
      </h2>

      <p className="text-gray-600 mb-6">
        Choose how the optimizer decides where to sample next in multi-objective space.
        Different strategies balance exploration vs. exploitation differently.
      </p>

      {/* Hypervolume-based */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟣 Hypervolume-Based (Recommended)
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Native multi-objective methods that maximize hypervolume contribution.
          Best for discovering the full Pareto front.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hypervolume.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* ParEGO variants */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🔵 ParEGO Variants
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Scalarization-based methods. Good for high-dimensional objective spaces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parego.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* Scalarized */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟢 Scalarized Single-Objective
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Convert to single-objective using random weights. Fast but may miss Pareto regions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scalarized.map(([key, info]) => renderButton(key, info))}
        </div>
      </div>

      {/* Weighted-sum */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟠 Weighted-Sum
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Equal weights across all objectives. Simple but limited for non-convex fronts.
        </p>
        <div className="grid grid-cols-1 gap-4">
          {weighted.map(([key, info]) => renderButton(key, info))}
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
          disabled={!acquisition}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}