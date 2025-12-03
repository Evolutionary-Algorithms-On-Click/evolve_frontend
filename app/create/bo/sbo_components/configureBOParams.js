"use client";

export default function ConfigureBOParams({
  params,
  setParams,
  acquisition,
  prevStep,
  submit,
}) {
  const update = (field, value) => {
    setParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
  if (params.iterations <= params.initialPoints) {
    alert("Total evaluations must be greater than initial random points!");
    return;
  }
  submit();
};

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Bayesian Optimization Hyperparameters
      </h2>

      <p className="text-gray-600 mb-6">
        Configure the number of initial samples, BO iterations, and exploration
        parameters based on the selected acquisition function.
      </p>

      {/* Initial Points */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Initial Random Points
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={params.initialPoints}
          onChange={(e) => update("initialPoints", Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Iterations */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Number of Optimization Iterations
        </label>
        <input
          type="number"
          min="5"
          max="300"
          value={params.iterations}
          onChange={(e) => update("iterations", Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* ξ for EI & PI */}
      {["ei", "pi"].includes(acquisition) && (
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Exploration Parameter (ξ)
          </label>
          <input
            type="number"
            step="0.001"
            min="0.0"
            value={params.xi ?? 0.01}
            onChange={(e) => update("xi", Number(e.target.value))}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="text-sm text-gray-500 mt-1">
            Controls exploration for EI and PI. Higher = more exploration.
            Default = 0.01
          </p>
        </div>
      )}

      {/* κ for UCB */}
      {acquisition === "lcb" && (
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Exploration Parameter (κ)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={params.kappa ?? 2.576}
            onChange={(e) => update("kappa", Number(e.target.value))}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="text-sm text-gray-500 mt-1">
            Controls exploration for LCB. Higher = more exploration. Default =
            2.576
          </p>
        </div>
      )}

      {/* Random Seed */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Random Seed
        </label>
        <input
          type="number"
          placeholder="42"
          value={params.randomSeed}
          onChange={(e) => update("randomSeed", Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <p className="text-sm text-gray-500 mt-1">
          Ensures reproducible LHS sampling, surrogate randomness, and BO
          trajectory.
        </p>
      </div>

      {/* Verbose */}
      <div className="mt-4 mb-8">
        <label className="block font-medium text-gray-700 mb-2">
          Verbose Output
        </label>
        <button
          onClick={() => update("verbose", !params.verbose)}
          className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
            params.verbose
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-gray-50 border-gray-300 text-gray-700 hover:shadow"
          }`}
        >
          {params.verbose ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z" />
            </svg>
            Execute Algorithm
          </div>
        </button>
      </div>
    </div>
  );
}
