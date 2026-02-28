"use client";

export default function ConfigureMOInitialDesign({
  design = { strategy: "", scramble: true, optimization: null },
  setDesign = () => {},
  nextStep = () => {},
  prevStep = () => {},
}) {
  const handleStrategy = (strategy) => {
    // Set strategy and initialize parameters based on type
    setDesign({
      strategy,
      scramble: strategy !== "random",
      optimization: null,
      power2: strategy === "sobol" ? true : undefined,
      strength: strategy === "lhs" ? 1 : undefined,
    });
  };

  const updateParam = (param, value) => {
    setDesign((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const isSobol = design.strategy === "sobol";
  const isLHS = design.strategy === "lhs";
  const isHalton = design.strategy === "halton";
  const isRandom = design.strategy === "random";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Initial Sampling Strategy
      </h2>

      <p className="text-gray-600 mb-6">
        Choose how the initial points should be distributed before MOBO begins.
        QMC methods provide better space-filling properties than random sampling.
      </p>

      {/* Strategy selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sobol */}
        <button
          onClick={() => handleStrategy("sobol")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "sobol"
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">Sobol Sequence</div>
          <div className="text-sm text-gray-600 mt-1">
            Low-discrepancy QMC. Best default choice.
          </div>
        </button>

        {/* LHS */}
        <button
          onClick={() => handleStrategy("lhs")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "lhs"
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">
            Latin Hypercube Sampling (LHS)
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Better uniformity across dimensions
          </div>
        </button>

        {/* Halton */}
        <button
          onClick={() => handleStrategy("halton")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "halton"
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">Halton Sequence</div>
          <div className="text-sm text-gray-600 mt-1">
            Good coverage in low dimensions
          </div>
        </button>

        {/* Random */}
        <button
          onClick={() => handleStrategy("random")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "random"
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">Random Sampling</div>
          <div className="text-sm text-gray-600 mt-1">
            Uniform random points (not recommended)
          </div>
        </button>
      </div>

      {/* SOBOL OPTIONS */}
      {isSobol && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">
            Sobol Options
          </h3>

          {/* Scramble */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={design.scramble ?? true}
                onChange={(e) => updateParam("scramble", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-purple-600"
              />
              <span className="text-gray-700 font-medium">Scramble</span>
            </label>
            <p className="text-xs text-gray-600 mt-1 ml-6">
              Randomize the sequence (recommended for better properties)
            </p>
          </div>

          {/* Optimization */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Optimization Criterion
            </label>
            <select
              value={design.optimization ?? ""}
              onChange={(e) =>
                updateParam("optimization", e.target.value || null)
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">None</option>
              <option value="random-cd">Random CD</option>
              <option value="lloyd">Lloyd</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Optional: Improve space-filling quality (slower)
            </p>
          </div>

          {/* Power of 2 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={design.power2 ?? true}
                onChange={(e) => updateParam("power2", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-purple-600"
              />
              <span className="text-gray-700 font-medium">
                Use Power-of-2 Points
              </span>
            </label>
            <p className="text-xs text-gray-600 mt-1 ml-6">
              Generate 2^k points (e.g., 8, 16, 32, 64). Better Sobol properties.
            </p>
          </div>
        </div>
      )}

      {/* LHS OPTIONS */}
      {isLHS && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">
            LHS Options
          </h3>

          {/* Scramble */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={design.scramble ?? true}
                onChange={(e) => updateParam("scramble", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-gray-700 font-medium">Scramble</span>
            </label>
            <p className="text-xs text-gray-600 mt-1 ml-6">
              Randomize within Latin hypercube cells
            </p>
          </div>

          {/* Strength */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              LHS Strength
            </label>
            <select
              value={design.strength ?? 1}
              onChange={(e) => updateParam("strength", Number(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value={1}>1 (Standard)</option>
              <option value={2}>2 (Orthogonal)</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Strength=2 requires n=p² where p is prime (e.g., 4, 9, 25, 49)
            </p>
          </div>

          {/* Optimization */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Optimization Criterion
            </label>
            <select
              value={design.optimization ?? ""}
              onChange={(e) =>
                updateParam("optimization", e.target.value || null)
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">None</option>
              <option value="random_cd">Random CD</option>
              <option value="lloyd">Lloyd</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Optional: Improve space-filling quality (slower)
            </p>
          </div>
        </div>
      )}

      {/* HALTON OPTIONS */}
      {isHalton && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">
            Halton Options
          </h3>

          {/* Scramble */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={design.scramble ?? true}
                onChange={(e) => updateParam("scramble", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-green-600"
              />
              <span className="text-gray-700 font-medium">Scramble</span>
            </label>
            <p className="text-xs text-gray-600 mt-1 ml-6">
              Randomize the Halton sequence
            </p>
          </div>

          {/* Optimization */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Optimization Criterion
            </label>
            <select
              value={design.optimization ?? ""}
              onChange={(e) =>
                updateParam("optimization", e.target.value || null)
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">None</option>
              <option value="random_cd">Random CD</option>
              <option value="lloyd">Lloyd</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Optional: Improve space-filling quality (slower)
            </p>
          </div>
        </div>
      )}

      {/* RANDOM - No options */}
      {isRandom && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700">
            ⚠️ Random sampling has no configurable parameters and generally provides
            worse coverage than QMC methods. Consider Sobol or LHS for better results.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          disabled={!design.strategy}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}