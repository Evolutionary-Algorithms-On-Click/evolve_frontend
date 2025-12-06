"use client";

export default function ChooseObjective({
  objective,
  setObjective,
  setDirection,
  nextStep,
  prevStep,
}) {
  const benchmarkMeta = {
    sphere: {
      dims: "ND",
      bounds: { all: [-5.12, 5.12] },
      hint: "Sphere: recommended range [-5.12, 5.12] for each dimension.",
    },
    rosenbrock: {
      dims: "ND",
      bounds: { all: [-5, 10] },
      hint: "Rosenbrock: recommended range [-5, 10] for each dimension.",
    },
    ackley: {
      dims: "ND",
      bounds: { all: [-32, 32] },
      hint: "Ackley: recommended range [-32, 32] for each dimension.",
    },
    rastrigin: {
      dims: "ND",
      bounds: { all: [-5.12, 5.12] },
      hint: "Rastrigin: recommended range [-5.12, 5.12] for each dimension.",
    },
    schwefel: {
      dims: "ND",
      bounds: { all: [-500, 500] },
      hint: "Schwefel: recommended range [-500, 500] for each dimension.",
    },
    griewank: {
      dims: "ND",
      bounds: { all: [-600, 600] },
      hint: "Griewank: recommended range [-600, 600] for each dimension.",
    },
    levy: {
      dims: "ND",
      bounds: { all: [-10, 10] },
      hint: "Levy: recommended range [-10, 10] for each dimension.",
    },
    michalewicz: {
      dims: "ND",
      bounds: { all: [0, Math.PI] },
      hint: "Michalewicz: recommended range [0, π] for each dimension.",
    },

    // 2D functions
    beale: {
      dims: "2D",
      bounds: { x: [-4.5, 4.5], y: [-4.5, 4.5] },
      hint: "Beale: recommended bounds x,y ∈ [-4.5, 4.5].",
    },
    booth: {
      dims: "2D",
      bounds: { x: [-10, 10], y: [-10, 10] },
      hint: "Booth: recommended bounds x,y ∈ [-10, 10].",
    },
    matyas: {
      dims: "2D",
      bounds: { x: [-10, 10], y: [-10, 10] },
      hint: "Matyas: recommended bounds x,y ∈ [-10, 10].",
    },
    branin: {
      dims: "2D",
      bounds: { x: [-5, 10], y: [0, 15] },
      hint: "Branin: x ∈ [-5,10], y ∈ [0,15].",
    },
    six_hump_camel: {
      dims: "2D",
      bounds: { x: [-3, 3], y: [-2, 2] },
      hint: "Six-Hump Camel: x ∈ [-3,3], y ∈ [-2,2].",
    },
    himmelblau: {
      dims: "2D",
      bounds: { x: [-5, 5], y: [-5, 5] },
      hint: "Himmelblau: x,y ∈ [-5,5].",
    },
    goldstein_price: {
      dims: "2D",
      bounds: { x: [-2, 2], y: [-2, 2] },
      hint: "Goldstein-Price: x,y ∈ [-2,2].",
    },
    easom: {
      dims: "2D",
      bounds: { x: [-100, 100], y: [-100, 100] },
      hint: "Easom: x,y ∈ [-100,100].",
    },
  };

  const objectives = [
    // Unimodal
    {
      key: "sphere",
      name: "Sphere",
      emoji: "⚪",
      color: "blue",
      desc: "Simple convex bowl. Easy baseline.",
      category: "Unimodal",
    },
    {
      key: "rosenbrock",
      name: "Rosenbrock",
      emoji: "🌹",
      color: "yellow",
      desc: "Curved narrow valley. Tests precision.",
      category: "Unimodal",
    },
    {
      key: "beale",
      name: "Beale",
      emoji: "🔶",
      color: "orange",
      desc: "Flat regions with sharp valley. 2D only.",
      category: "Unimodal",
    },
    {
      key: "booth",
      name: "Booth",
      emoji: "🟫",
      color: "amber",
      desc: "Simple plate-shaped. Easy. 2D only.",
      category: "Unimodal",
    },
    {
      key: "matyas",
      name: "Matyas",
      emoji: "🥏",
      color: "slate",
      desc: "Plate-shaped, nearly flat. 2D only.",
      category: "Unimodal",
    },

    // Multimodal
    {
      key: "ackley",
      name: "Ackley",
      emoji: "🌋",
      color: "purple",
      desc: "Many local minima. Tests global search.",
      category: "Multimodal",
    },
    {
      key: "rastrigin",
      name: "Rastrigin",
      emoji: "🌊",
      color: "cyan",
      desc: "Highly multimodal. Regular local minima.",
      category: "Multimodal",
    },
    {
      key: "schwefel",
      name: "Schwefel",
      emoji: "🏔️",
      color: "emerald",
      desc: "Deceptive. Global min far from local.",
      category: "Multimodal",
    },
    {
      key: "griewank",
      name: "Griewank",
      emoji: "📉",
      color: "teal",
      desc: "Many widespread local minima.",
      category: "Multimodal",
    },
    {
      key: "levy",
      name: "Levy",
      emoji: "〰️",
      color: "violet",
      desc: "Multimodal with flat regions.",
      category: "Multimodal",
    },
    {
      key: "michalewicz",
      name: "Michalewicz",
      emoji: "📐",
      color: "fuchsia",
      desc: "Steep ridges and valleys.",
      category: "Multimodal",
    },
    {
      key: "branin",
      name: "Branin",
      emoji: "🔵",
      color: "red",
      desc: "Three global minima. 2D only.",
      category: "Multimodal",
    },
    {
      key: "six_hump_camel",
      name: "Six-Hump Camel",
      emoji: "🐫",
      color: "lime",
      desc: "Six local minima, two global. 2D only.",
      category: "Multimodal",
    },
    {
      key: "himmelblau",
      name: "Himmelblau",
      emoji: "🔷",
      color: "sky",
      desc: "Four identical local minima. 2D only.",
      category: "Multimodal",
    },
    {
      key: "goldstein_price",
      name: "Goldstein-Price",
      emoji: "🏆",
      color: "yellow",
      desc: "Sharp peaks and valleys. 2D only.",
      category: "Multimodal",
    },
    {
      key: "easom",
      name: "Easom",
      emoji: "🎯",
      color: "rose",
      desc: "Nearly flat with one narrow global min. 2D only.",
      category: "Multimodal",
    },

    // Custom
    {
      key: "custom",
      name: "Upload Custom Function",
      emoji: "🧩",
      color: "black",
      desc: "Upload your own objective (Python).",
      category: "Custom",
    },
  ];

 const colorMap = {
    blue: {
      active: "border-blue-600 bg-blue-50",
      base: "border-gray-300 bg-gray-50",
    },
    yellow: {
      active: "border-yellow-600 bg-yellow-50",
      base: "border-gray-300 bg-gray-50",
    },
    orange: {
      active: "border-orange-600 bg-orange-50",
      base: "border-gray-300 bg-gray-50",
    },
    amber: {
      active: "border-amber-600 bg-amber-50",
      base: "border-gray-300 bg-gray-50",
    },
    slate: {
      active: "border-slate-600 bg-slate-50",
      base: "border-gray-300 bg-gray-50",
    },
    purple: {
      active: "border-purple-600 bg-purple-50",
      base: "border-gray-300 bg-gray-50",
    },
    cyan: {
      active: "border-cyan-600 bg-cyan-50",
      base: "border-gray-300 bg-gray-50",
    },
    emerald: {
      active: "border-emerald-600 bg-emerald-50",
      base: "border-gray-300 bg-gray-50",
    },
    teal: {
      active: "border-teal-600 bg-teal-50",
      base: "border-gray-300 bg-gray-50",
    },
    violet: {
      active: "border-violet-600 bg-violet-50",
      base: "border-gray-300 bg-gray-50",
    },
    fuchsia: {
      active: "border-fuchsia-600 bg-fuchsia-50",
      base: "border-gray-300 bg-gray-50",
    },
    red: {
      active: "border-red-600 bg-red-50",
      base: "border-gray-300 bg-gray-50",
    },
    lime: {
      active: "border-lime-600 bg-lime-50",
      base: "border-gray-300 bg-gray-50",
    },
    sky: {
      active: "border-sky-600 bg-sky-50",
      base: "border-gray-300 bg-gray-50",
    },
    rose: {
      active: "border-rose-600 bg-rose-50",
      base: "border-gray-300 bg-gray-50",
    },
    black: {
      active: "border-gray-700 bg-gray-50",
      base: "border-gray-300 bg-gray-50",
    },
  };

  const unimodal = objectives.filter((o) => o.category === "Unimodal");
  const multimodal = objectives.filter((o) => o.category === "Multimodal");
  const custom = objectives.filter((o) => o.category === "Custom");

  const handleSelect = (objKey) => {
    setObjective(objKey);

    // AUTO-SET DIRECTION TO MINIMIZE FOR BENCHMARKS
    if (objKey !== "custom") {
      setDirection("minimize");
      localStorage.removeItem("bo_custom_func_dim");
    } else {
      // Clear direction for custom function
      localStorage.setItem("bo_custom_func_dim", "true");
      setDirection("");
    }

    const info = benchmarkMeta[objKey];
    if (info) {
      localStorage.setItem("bo_selected_dims", info.dims);
      localStorage.setItem("bo_bounds_json", JSON.stringify(info.bounds));
      localStorage.setItem("bo_selected_bounds_hint", info.hint ?? "");
    } else {
      // Clear for custom function
      localStorage.removeItem("bo_selected_dims");
      localStorage.removeItem("bo_bounds_json");
      localStorage.removeItem("bo_selected_bounds_hint");
    }
  };

  const renderButton = (obj) => {
    const isActive = objective === obj.key;
    const colors = colorMap[obj.color] || colorMap.blue;

    return (
      <button
        key={obj.key}
        onClick={() => handleSelect(obj.key)}
        className={`p-4 rounded-xl border transition-all text-left ${
          isActive ? `${colors.active}` : `${colors.base} hover:shadow`
        }`}
      >
        <div className="text-3xl mb-2">{obj.emoji}</div>
        <div className="font-semibold text-lg">{obj.name}</div>
        <div className="text-sm opacity-80 mt-1">{obj.desc}</div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Objective Function
      </h2>

      <p className="text-gray-600 mb-6">
        Select a benchmark test function to optimize (Functions are grouped by
        difficulty) or upload your own custom function.
      </p>

      {/* Custom Function Option */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          📤 Custom Function
        </h3>
        <button
          onClick={() => handleSelect("custom")}
          className={`w-full p-5 rounded-xl border transition-all text-left ${
            objective === "custom"
              ? "border-gray-700 bg-gray-700 text-white"
              : "border-gray-300 bg-gray-50 hover:shadow"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚙️</div>
            <div>
              <div className="font-semibold text-lg">Upload Custom Function</div>
              <div className="text-sm opacity-80 mt-1">
                Define your own optimization problem (Python code)
              </div>
            </div>
          </div>
        </button>
      </div>

       {/* Unimodal */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🟢 Unimodal (Easier)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unimodal.map(renderButton)}
        </div>
      </div>

      {/* Multimodal */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          🔴 Multimodal (Harder)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {multimodal.map(renderButton)}
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
          disabled={!objective}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}