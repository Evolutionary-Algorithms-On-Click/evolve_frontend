"use client";

export default function ConfigureInitialDesign({
  design,
  setDesign,
  nextStep,
  prevStep,
}) {
  const handleStrategy = (strategy) => {
  setDesign({
    strategy,
    lhs_type: strategy === "lhs" ? "centered" : null,
    criterion: null,
  });
};


  const isLHS = design.strategy === "lhs";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Step 7 — Initial Sampling Strategy
      </h2>

      <p className="text-gray-600 mb-6">
        Choose how the initial points should be distributed before BO begins.
      </p>

      {/* Strategy selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Random Sampling */}
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
            Uniform random points across the space
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
            Quasi-random low-discrepancy sequence
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

        {/* Hammersley */}
        <button
          onClick={() => handleStrategy("hammersley")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "hammersley"
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">Hammersley</div>
          <div className="text-sm text-gray-600 mt-1">
            Similar to Halton, good uniformity
          </div>
        </button>

        {/* Grid Sampling */}
        <button
          onClick={() => handleStrategy("grid")}
          className={`p-4 rounded-xl border transition-all text-center ${
            design.strategy === "grid"
              ? "border-yellow-400 bg-yellow-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-800">Grid Sampling</div>
          <div className="text-sm text-gray-600 mt-1">
            Even grid across each dimension
          </div>
        </button>
      </div>

      {/* LHS EXTRA OPTIONS */}
      {isLHS && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-2">
            LHS Options
          </h3>

          {/* LHS TYPE */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              LHS Variant
            </label>

            <select
              value={design.lhs_type ?? ""}
              onChange={(e) =>
                setDesign((d) => ({
                  ...d,
                  lhs_type: e.target.value || "centered", // fallback safe default
                }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select type…</option>
              <option value="classic">Classic</option>
              <option value="centered">Centered</option>
            </select>
          </div>

          {/* CRITERION */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Optimization Criterion
            </label>

            <select
              value={design.criterion ?? ""}
              onChange={(e) =>
                setDesign((d) => ({
                  ...d,
                  criterion: e.target.value || null,
                }))
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">None</option>
              <option value="maximin">Maximin</option>
              <option value="correlation">Correlation</option>
              <option value="ratio">Ratio</option>
            </select>
          </div>
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
