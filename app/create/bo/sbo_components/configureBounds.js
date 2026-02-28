"use client";

import { useState, useEffect } from "react";

export default function ConfigureBounds({
    dimensions,
    setDimensions,
    bounds,
    setBounds,
    nextStep,
    prevStep,
}) {
    // =========================================================
    // NEW: Read selected benchmark metadata from localStorage
    // =========================================================
    const [metaLoaded, setMetaLoaded] = useState(false);

    useEffect(() => {
        const dims = localStorage.getItem("bo_selected_dims");
        const boundsJSON = localStorage.getItem("bo_bounds_json");
        const customDim = localStorage.getItem("bo_custom_func_dim");

        // 🔹 Custom Function Case
        if (customDim) {
            const d = Number(customDim);

            setDimensions(d);

            // Set default bounds for custom function (user will adjust if needed)
            const defaultBounds = Array.from({ length: d }, () => ({
                min: -5,
                max: 5,
            }));

            setBounds(defaultBounds);
            setMetaLoaded(true);
            return;
        }

        // 🔹 Built-in Benchmarks (same as before)
        if (!dims || !boundsJSON) {
            setMetaLoaded(true);
            return;
        }

        const parsedBounds = JSON.parse(boundsJSON);

        if (dims === "2D") {
            setDimensions(2);
            setBounds([
                { min: parsedBounds.x[0], max: parsedBounds.x[1] },
                { min: parsedBounds.y[0], max: parsedBounds.y[1] },
            ]);
            setMetaLoaded(true);
            return;
        }

        if (dims === "ND") {
            const d = dimensions || 1;
            const [lo, hi] = parsedBounds.all;
            const autoBounds = Array.from({ length: d }, () => ({
                min: lo,
                max: hi,
            }));

            setBounds(autoBounds);
            setMetaLoaded(true);
            return;
        }

        setMetaLoaded(true);
    }, []);


    // =========================================================
    // Existing logic: expand/shrink bounds when dims change
    // =========================================================
    useEffect(() => {
        if (!metaLoaded) return; // prevent override of auto-filled bounds

        if (dimensions > bounds.length) {
            const newBounds = [...bounds];
            for (let i = bounds.length; i < dimensions; i++) {
                newBounds.push({ min: -5, max: 5 });
            }
            setBounds(newBounds);

        } else if (dimensions < bounds.length) {
            setBounds(bounds.slice(0, dimensions));
        }
    }, [dimensions, metaLoaded]);


    // ✅ FIXED: Handle bound changes properly to allow negative numbers
    const handleBoundChange = (index, field, value) => {
        // Handle raw input value to allow typing negative numbers
        const inputValue = value;
        
        // Allow empty string (user clearing input)
        if (inputValue === '') {
            const updated = [...bounds];
            updated[index][field] = '';
            setBounds(updated);
            return;
        }
        
        // Convert to number
        const numValue = Number(inputValue);
        
        // Only update if it's a valid number
        if (!isNaN(numValue)) {
            const updated = [...bounds];
            updated[index][field] = numValue;
            setBounds(updated);
        }
        // If NaN (like typing letters), simply don't update - input won't change
    };



    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Search Space Bounds
            </h2>

            <p className="text-gray-600 mb-6">
                Define the number of input dimensions and specify the valid range for each.
            </p>

            {/* Recommended Bounds Hint */}
            {localStorage.getItem("bo_selected_bounds_hint") && (
                <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-700 mb-1">
                        Recommended Bounds
                    </div>
                    <div className="text-sm text-blue-600">
                        {localStorage.getItem("bo_selected_bounds_hint")}
                    </div>
                </div>
            )}


            {/* Number of dimensions */}
            <div className="mb-6">

                <label className="block font-medium text-gray-700 mb-2">
                    Number of Dimensions
                </label>

                <input
                    type="number"
                    min="1"
                    max="20"
                    value={dimensions}
                    onChange={(e) => setDimensions(Number(e.target.value))}
                    disabled={localStorage.getItem("bo_selected_dims") === "2D" || localStorage.getItem("bo_custom_func_dim") !== null}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-gray-900
                               disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* Benchmark Lock Message */}
                {localStorage.getItem("bo_selected_dims") === "2D" &&
                !localStorage.getItem("bo_custom_func_dim") && (
                <p className="text-xs text-red-500 mt-2">
                    This benchmark is 2-dimensional. Dimensions are locked.
                </p>
                )}

                {/* Custom Function Lock Message */}
                {localStorage.getItem("bo_custom_func_dim") && (
                <p className="text-xs text-blue-600 mt-2">
                    Auto-detected from your custom function (locked)
                </p>
                )}

            </div>

            {/* Bounds list */}
            <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: dimensions }).map((_, idx) => {
                    const currentMin = bounds[idx]?.min;
                    const currentMax = bounds[idx]?.max;
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Min Value
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={currentMin ?? ""}
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
                                        value={currentMax ?? ""}
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
            {(dimensions < 1 || 
              bounds.length !== dimensions ||
              bounds.some(b => 
                  b.min === '' ||
                  b.max === '' ||
                  isNaN(b.min) || 
                  isNaN(b.max) || 
                  b.min >= b.max
              )) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        ⚠️ Please ensure all dimensions have valid bounds where min &lt; max
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
                    disabled={
                        dimensions < 1 || 
                        bounds.length !== dimensions ||
                        bounds.some(b => 
                            b.min === '' ||
                            b.max === '' ||
                            isNaN(b.min) || 
                            isNaN(b.max) || 
                            b.min >= b.max
                        )
                    }
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 
                               disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}