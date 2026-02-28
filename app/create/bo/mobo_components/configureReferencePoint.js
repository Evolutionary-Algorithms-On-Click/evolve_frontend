"use client";

import { useEffect, useState } from "react";

export default function ConfigureReferencePoint({
  refPoint = { useHeuristic: true, values: null },
  setRefPoint = () => {},
  numObjectives = 2,
  nextStep = () => {},
  prevStep = () => {},
}) {
  const [localValues, setLocalValues] = useState(
    Array(numObjectives).fill(0.0)
  );

  // Initialize local values when switching to manual mode
  useEffect(() => {
    // If heuristic mode, keep values null
    if (refPoint.useHeuristic) {
      setLocalValues(Array(numObjectives).fill(0.0));
      return;
    }

    // Manual mode
    const prev = refPoint.values || [];
    const resized = [...prev];

    // Extend or trim size
    if (prev.length !== numObjectives) {
      if (prev.length < numObjectives) {
        resized.push(...Array(numObjectives - prev.length).fill(0.0));
      } else {
        resized.length = numObjectives;
      }
    }

    setLocalValues(resized);
    setRefPoint({ useHeuristic: false, values: resized });
  }, [numObjectives, refPoint.useHeuristic]);


  const handleModeChange = (useHeuristic) => {
    if (useHeuristic) {
      setRefPoint({ useHeuristic: true, values: null });
    } else {
      setRefPoint({ useHeuristic: false, values: localValues });
    }
  };

  const handleValueChange = (index, value) => {
    const updated = [...localValues];
    updated[index] = value;
    setLocalValues(updated);
    setRefPoint({ useHeuristic: false, values: updated });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Reference Point
      </h2>

      <p className="text-gray-600 mb-6">
        The reference point defines the region of objective space for hypervolume calculation.
        It should be worse than or equal to the worst acceptable values for all objectives.
      </p>

      {/* Mode Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Reference Point Mode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Heuristic */}
          <button
            onClick={() => handleModeChange(true)}
            className={`p-4 rounded-xl border transition-all text-left ${
              refPoint.useHeuristic
                ? "border-green-600 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:shadow"
            }`}
          >
            <div className="font-semibold text-lg text-gray-900">✨ Automatic Heuristic</div>
            <div className="text-sm text-gray-700 mt-1">
              Automatically computed from initial data. Safe default choice.
            </div>
          </button>

          {/* Manual */}
          <button
            onClick={() => handleModeChange(false)}
            className={`p-4 rounded-xl border transition-all text-left ${
              !refPoint.useHeuristic
                ? "border-purple-600 bg-purple-50"
                : "border-gray-300 bg-gray-50 hover:shadow"
            }`}
          >
            <div className="font-semibold text-lg text-gray-900">⚙️ Manual Entry</div>
            <div className="text-sm text-gray-700 mt-1">
              Specify exact values per objective. For expert users.
            </div>
          </button>
        </div>
      </div>

      {/* Heuristic Explanation */}
      {refPoint.useHeuristic && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            🤖 Automatic Heuristic Mode
          </h3>
          <p className="text-sm text-green-700">
            The reference point will be automatically set to slightly worse than the worst
            observed values across all objectives from the initial design. This is computed as:
          </p>
          <p className="text-sm text-green-700 mt-2 font-mono bg-green-100 p-2 rounded">
            ref[i] = min(Y[:, i]) - 0.1 * (max(Y[:, i]) - min(Y[:, i]) + ε)
          </p>
          <p className="text-sm text-green-700 mt-2">
            This ensures the reference point is dominated by all initial points and provides
            a reasonable baseline for hypervolume computation.
          </p>
        </div>
      )}

      {/* Manual Entry Fields */}
      {!refPoint.useHeuristic && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            Set Reference Point Values
          </h3>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <p className="text-sm text-yellow-700">
              ⚠️ <strong>Important:</strong> Reference point values should be worse than your
              worst acceptable performance. For maximization objectives, use values lower than
              acceptable. For minimization objectives, use values higher than acceptable.
            </p>
          </div>

          {Array.from({ length: numObjectives }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-300 bg-gray-50"
            >
              <label className="block font-semibold text-gray-800 mb-2">
                Objective {idx + 1} Reference Value
              </label>
              <input
                type="number"
                step="0.1"
                value={localValues[idx]?? ""}
                onChange={(e) => handleValueChange(idx, Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-600 mt-1">
                Set to a value worse than your minimum acceptable performance for this objective
              </p>
            </div>
          ))}

          {/* Summary */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Reference Point Summary:
            </div>
            <div className="text-sm text-gray-600">
              <code className="bg-gray-200 px-2 py-1 rounded">
                [{localValues.join(", ")}]
              </code>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}