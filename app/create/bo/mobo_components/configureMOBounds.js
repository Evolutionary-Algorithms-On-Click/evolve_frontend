"use client";

import { useState, useEffect } from "react";

export default function ConfigureMOBounds({
  dimensions = 2,
  setDimensions = () => {},
  bounds = [],
  setBounds = () => {},
  problem = null,
  problemConfig = null,
  setProblemConfig = () => {},
  customFunctionDim = null,
  customFunctionObjectives = null,
  nextStep = () => {},
  prevStep = () => {},
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ensure bounds is always an array
  const safeBounds = Array.isArray(bounds) ? bounds : [];

  const isCustom = problem === "custom";
  const isDTLZ = problem?.startsWith("dtlz");
  const isZDT = problem?.startsWith("zdt");

  // Dimensions: configurable only if benchmark says so (never for custom)
  const canConfigureDimensions = problemConfig?.dim === "configurable";

  // Objectives: configurable only when BOTH D and M are configurable → DTLZ family
  // (ZDT has fixed M=2, fixed problems have fixed M, custom is auto-detected)
  const canConfigureObjectives = isDTLZ;

  // Determine if dimensions are locked
  // Custom: locked if dimension detected from function
  // Benchmarks: locked if dim is NOT "configurable"
  const isDimensionLocked = problem === "custom" 
    ? Boolean(customFunctionDim) 
    : !canConfigureDimensions;

  // Objectives are locked whenever they are not configurable (ZDT, fixed, custom)
  const isObjectivesLocked = isCustom || isZDT || !canConfigureObjectives;

  // Current objectives value
  const currentObjectives =
    typeof problemConfig?.objectives === "number"
      ? problemConfig.objectives
      : (isCustom ? customFunctionObjectives : (canConfigureObjectives ? 2 : undefined));


  // Initialize dimensions and bounds when problem changes
  useEffect(() => {
    if (!problemConfig && problem !== "custom") return;

    let targetDim;

    if (problem === "custom") {
      // Custom function
      targetDim = customFunctionDim || 2;
    } else if (canConfigureDimensions) {
      targetDim = dimensions || 1;
    } else if (typeof problemConfig?.dim === 'number') {
      // FIXED: Use the dimension from config
      targetDim = problemConfig.dim;
    } else {
      // Fallback
      targetDim = 2;
    }

    // Update dimensions state if changed
    setDimensions(targetDim);

    if (safeBounds.length !== targetDim) {
      const updatedBounds = [...safeBounds];
      for (let i = safeBounds.length; i < targetDim; i++) {
        updatedBounds.push({ min: 0, max: 1 });
      }
      setBounds(updatedBounds.slice(0, targetDim));
    }


    // Initialize objectives if configurable and not yet a number (DTLZ only)
    if (canConfigureObjectives && typeof currentObjectives !== 'number') {
      setProblemConfig(prev => ({
        ...prev,
        objectives: 2
      }));
    }setIsInitialized(true);
  }, [problem, problemConfig?.dim, customFunctionDim, currentObjectives]);

  // Update bounds when dimensions change (only for unlocked dimensions)
  useEffect(() => {
    if (!isInitialized || isDimensionLocked) return;

    const currentDim = dimensions;
    if (safeBounds.length === currentDim) return;

    if (currentDim > safeBounds.length) {
      // Add new bounds
      const newBounds = [...safeBounds];
      for (let i = safeBounds.length; i < currentDim; i++) {
        newBounds.push({ min: 0, max: 1 });
      }
      setBounds(newBounds);
    } else if (currentDim < safeBounds.length) {
      // Remove excess bounds
      setBounds(safeBounds.slice(0, currentDim));
    }
  }, [dimensions, isDimensionLocked, isInitialized]);

  const handleBoundChange = (index, field, value) => {
    const inputValue = value;
    
    if (inputValue === '') {
      const updated = [...safeBounds];
      updated[index] = { ...updated[index], [field]: '' };
      setBounds(updated);
      return;
    }
    
    const numValue = Number(inputValue);
    
    if (!isNaN(numValue)) {
      const updated = [...safeBounds];
      updated[index] = { ...updated[index], [field]: numValue };
      setBounds(updated);
    }
  };

  const handleDimensionChange = (value) => {
    const newDim = Number(value);
    if (newDim < 1 || newDim > 50 || isNaN(newDim)) return;
    
    setDimensions(newDim);
    // DO NOT update problemConfig.dim - it should stay "configurable"
  };

  const handleObjectivesChange = (value) => {
    const newObj = Number(value);
    if (newObj < 2 || newObj > 10 || isNaN(newObj)) return;
    
    setProblemConfig(prev => ({
      ...prev,
      objectives: newObj
    }));
  };

  // Validation
  const hasValidationErrors = 
    dimensions < 1 || 
    safeBounds.length !== dimensions ||
    safeBounds.some(b => 
      b.min === '' ||
      b.max === '' ||
      isNaN(b.min) || 
      isNaN(b.max) || 
      b.min >= b.max
    ) ||
    (canConfigureObjectives && (currentObjectives < 2 || currentObjectives > 10));

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Search Space Configuration
      </h2>

      <p className="text-gray-600 mb-6">
        Define the problem dimensions and valid range for each input dimension.
      </p>

      {/* Problem Info */}
      {problem && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="text-sm font-semibold text-blue-700 mb-1">
            Selected Problem: {problem.toUpperCase()}
          </div>
          <div className="text-sm text-blue-600">
            {problem === "custom" ? (
              <>🔒 Dimensions {customFunctionDim ? `auto-detected (${customFunctionDim}D)` : 'will be detected'} from your function</>
            ) : isDimensionLocked ? (
              <>Dimensions are locked at <strong>{typeof problemConfig?.dim === 'number' ? problemConfig.dim : dimensions}D</strong> for this benchmark.</>
            ) : (
              <>
                This benchmark supports configurable dimensions
                {canConfigureObjectives && <> and objectives</>}.
              </>
            )}
          </div>
        </div>
      )}

      {/* Number of Objectives - always visible, sometimes locked */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Number of Objectives (M)
        </label>
        <input
          type="number"
          min="2"
          max="10"
          value={currentObjectives ?? ""}
          onChange={(e) => handleObjectivesChange(e.target.value)}
          disabled={isObjectivesLocked}
          className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-gray-900
                     ${isObjectivesLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Number of dimensions */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Number of Input Dimensions (D)
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={dimensions?? ""}
          onChange={(e) => handleDimensionChange(e.target.value)}
          disabled={isDimensionLocked}
          className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-gray-900
                     ${isDimensionLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {isDimensionLocked && problem === "custom" && (
          <p className="text-xs text-blue-600 mt-2">
            🔒 Auto-detected from your custom function (locked)
          </p>
        )}

        {isDimensionLocked && problem !== "custom" && (
          <p className="text-xs text-gray-500 mt-2">
            🔒 Dimensions are fixed for this benchmark
          </p>
        )}

        
      </div>


      {/* Recommended Bounds Info */}
      <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
        <div className="text-sm font-semibold text-yellow-700 mb-1">
          💡 Recommended Bounds
        </div>
        <div className="text-sm text-yellow-600">
          Most multi-objective benchmarks use <strong>[0, 1]</strong> bounds for all dimensions.
          Adjust based on your problem's natural scale.
        </div>
      </div>

      {/* Bounds list */}
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: dimensions }).map((_, idx) => {
          const currentMin = safeBounds[idx]?.min;
          const currentMax = safeBounds[idx]?.max;
          const hasError = typeof currentMin === 'number' && 
                         typeof currentMax === 'number' && 
                         currentMin >= currentMax;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border shadow-sm ${
                hasError 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-800 mb-3">
                Dimension {idx + 1}
                {hasError && (
                  <span className="ml-2 text-xs text-red-600 font-normal">
                    ⚠️ Min must be less than Max
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Min Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentMin ?? 0}
                    onChange={(e) =>
                      handleBoundChange(idx, "min", e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white
                               focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentMax ?? 1}
                    onChange={(e) =>
                      handleBoundChange(idx, "max", e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white
                               focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Message */}
      {hasValidationErrors && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Please ensure:
            {canConfigureObjectives && (currentObjectives < 2 || currentObjectives > 10) && (
              <span className="block">• Objectives (M) is between 2 and 10</span>
            )}
            <span className="block">• All dimensions have valid bounds where min &lt; max</span>
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          disabled={hasValidationErrors}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
