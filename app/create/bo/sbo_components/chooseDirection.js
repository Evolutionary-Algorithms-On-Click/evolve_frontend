"use client";

import { useEffect } from "react";

export default function ChooseDirection({
  direction,
  setDirection,
  objective,
  nextStep,
  prevStep,
}) {
  // Check if direction should be locked (benchmark selected)
  const isLocked = objective !== "custom";

  // Auto-set direction to minimize for benchmark functions
  useEffect(() => {
    if (isLocked && !direction) {
      setDirection("minimize");
    }
  }, [isLocked, direction, setDirection]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Optimization Direction
      </h2>
      <p className="text-gray-600 mb-6">
        Choose whether the algorithm should minimize or maximize your objective
        function.
      </p>

      {isLocked && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            ℹ️ <strong>Benchmark functions must be minimized.</strong> Select
            "Custom Function" to enable maximization.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setDirection("minimize")}
          className={`p-4 rounded-xl border transition-all text-left ${
            direction === "minimize"
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 bg-gray-50 hover:shadow"
          }`}
        >
          <div className="font-semibold text-lg">Minimize</div>
          <div className="text-sm opacity-80 mt-1">
            Find the lowest possible value
          </div>
        </button>

        <button
          onClick={() => !isLocked && setDirection("maximize")}
          disabled={isLocked}
          className={`p-4 rounded-xl border transition-all text-left ${
            direction === "maximize"
              ? "border-gray-900 bg-gray-900 text-white"
              : isLocked
              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-gray-50 hover:shadow"
          }`}
        >
          <div className="font-semibold text-lg">Maximize</div>
          <div className="text-sm opacity-80 mt-1">
            {isLocked
              ? "Not available for benchmarks"
              : "Find the highest possible value"}
          </div>
        </button>
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
          disabled={!direction}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}