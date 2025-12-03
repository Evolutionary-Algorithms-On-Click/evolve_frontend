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

        if (!dims || !boundsJSON) {
            setMetaLoaded(true);
            return;
        }

        const parsedBounds = JSON.parse(boundsJSON);

        // ---- Handle 2D benchmarks (x, y bounds) ----
        if (dims === "2D") {
            setDimensions(2);

            setBounds([
                { min: parsedBounds.x[0], max: parsedBounds.x[1] },  // x dimension
                { min: parsedBounds.y[0], max: parsedBounds.y[1] },  // y dimension
            ]);

            setMetaLoaded(true);
            return;
        }

        // ---- Handle ND benchmarks (same bound for all dims) ----
        if (dims === "ND") {
            // Preserve user-chosen dimension value, but apply same bounds
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


    // update min/max values
    const handleBoundChange = (index, field, value) => {
        const updated = [...bounds];
        updated[index][field] = value;
        setBounds(updated);
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
                    disabled={localStorage.getItem("bo_selected_dims") === "2D"}          // 🔒 Auto-lock for 2D functions
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-gray-900
                               disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {localStorage.getItem("bo_selected_dims") === "2D" && (
                    <p className="text-xs text-red-500 mt-2">
                        This benchmark is 2-dimensional. Dimensions are locked.
                    </p>
                )}
            </div>

            {/* Bounds list */}
            <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: dimensions }).map((_, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-300 bg-gray-50 shadow-sm"
                    >
                        <div className="font-semibold text-gray-800 mb-3">
                            Dimension {idx + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Min Value
                                </label>
                                <input
                                    type="number"
                                    value={bounds[idx]?.min ?? ""}
                                    onChange={(e) =>
                                        handleBoundChange(idx, "min", Number(e.target.value))
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
                                    value={bounds[idx]?.max ?? ""}
                                    onChange={(e) =>
                                        handleBoundChange(idx, "max", Number(e.target.value))
                                    }
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white
                                               focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                    disabled={dimensions < 1 || bounds.some(b => b.min >= b.max)}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}
