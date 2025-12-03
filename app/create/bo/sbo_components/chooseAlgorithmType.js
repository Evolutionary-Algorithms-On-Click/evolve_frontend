"use client";

export default function ChooseAlgorithmType({ algorithmType, setAlgorithmType, nextStep }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Algorithm Type
      </h2>

      <p className="text-gray-600 mb-6">
        Choose the Bayesian Optimization mode you want to run.
      </p>

      {/* Standard BO */}
      <button
        onClick={() => {
          setAlgorithmType("standard_bo");
          nextStep();
        }}
        className={`w-full p-5 rounded-xl border text-left transition-all ${
          algorithmType === "standard_bo"
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
      >
        <h3 className="font-bold text-lg">Standard BO</h3>
        <p className="text-sm mt-1 text-gray-200">
          Single-objective, unconstrained, sequential optimization.
          Best for optimizing one function with simple bound constraints.
        </p>
      </button>
    </div>
  );
}
