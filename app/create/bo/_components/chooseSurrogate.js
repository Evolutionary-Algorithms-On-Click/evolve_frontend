"use client";

export default function ChooseSurrogate({
    surrogate,
    setSurrogate,
    nextStep,
    prevStep,
}) {
    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Surrogate Model
            </h2>

            <p className="text-gray-600 mb-6">
                The surrogate model approximates your objective function and guides the search.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Gaussian Process */}
                <button
                    onClick={() => setSurrogate("gp")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        surrogate === "gp"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Gaussian Process (GP)</div>
                    <div className="text-sm opacity-80 mt-1">
                        Best for smooth functions. Provides uncertainty estimates.
                    </div>
                </button>

                {/* Random Forest */}
                <button
                    onClick={() => setSurrogate("rf")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        surrogate === "rf"
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Random Forest (RF)</div>
                    <div className="text-sm opacity-80 mt-1">
                        More robust to noise. Works well on complex landscapes.
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
                    disabled={!surrogate}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}
