"use client";

export default function ConfigureMCSampler({
  mcSampler = { type: "sobol_qmc", samples: 128 },
  setMcSampler = () => {},
  nextStep = () => {},
  prevStep = () => {},
}) {
  const updateSamplerType = (type) => {
    setMcSampler((prev) => ({
      ...prev,
      type,
    }));
  };

  const updateSamples = (samples) => {
    setMcSampler((prev) => ({
      ...prev,
      samples,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Monte Carlo Sampler
      </h2>

      <p className="text-gray-600 mb-6">
        Configure the Monte Carlo sampler used for evaluating acquisition functions.
        This affects how the surrogate model posterior is sampled during optimization.
      </p>

      {/* Sampler Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Sampler Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sobol QMC */}
          <button
            onClick={() => updateSamplerType("sobol_qmc")}
            className={`p-4 rounded-xl border transition-all text-left ${
              mcSampler.type === "sobol_qmc"
                ? "border-purple-600 bg-purple-50"
                : "border-gray-300 bg-gray-50 hover:shadow"
            }`}
          >
            <div className="font-semibold text-lg text-gray-900">Sobol QMC</div>
            <div className="text-sm text-gray-700 mt-1">
              Quasi-Monte Carlo using Sobol sequences. Better coverage, more accurate.
            </div>
          </button>

          {/* IID */}
          <button
            onClick={() => updateSamplerType("iid")}
            className={`p-4 rounded-xl border transition-all text-left ${
              mcSampler.type === "iid"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:shadow"
            }`}
          >
            <div className="font-semibold text-lg text-gray-900">IID Normal</div>
            <div className="text-sm text-gray-700 mt-1">
              Independent and identically distributed samples. Faster but less accurate.
            </div>
          </button>
        </div>
      </div>

      {/* Number of MC Samples */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Number of MC Samples
        </label>
        <input
          type="number"
          min="32"
          max="2048"
          step="32"
          value={mcSampler.samples}
          onChange={(e) => updateSamples(Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <p className="text-sm text-gray-600 mt-2">
          Higher values = more accurate acquisition function estimates but slower.
          Typical range: 64-512. Default: 128.
        </p>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Recommendations:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Sobol QMC</strong>: Best for most cases. More accurate with fewer samples.</li>
          <li>• <strong>IID</strong>: Use if you need faster acquisition optimization.</li>
          <li>• <strong>128 samples</strong>: Good default balance between speed and accuracy.</li>
          <li>• <strong>256-512 samples</strong>: Use for high-stakes optimization or noisy objectives.</li>
        </ul>
      </div>

      {/* Current Config Summary */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Current Configuration:
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">Sampler:</span>{" "}
            {mcSampler.type === "sobol_qmc" ? "Sobol QMC (Recommended)" : "IID Normal"}
          </div>
          <div>
            <span className="font-medium">Samples:</span> {mcSampler.samples}
          </div>
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
          disabled={!mcSampler.type || mcSampler.samples < 32}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}