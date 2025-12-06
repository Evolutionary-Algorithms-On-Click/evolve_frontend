"use client";

export default function ChooseAcquisition({
    acquisition,
    setAcquisition,
    nextStep,
    prevStep,
}) {
    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Acquisition Function
            </h2>

            <p className="text-gray-600 mb-6">
                The acquisition function decides where the optimizer samples next.
                It balances exploration and exploitation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Expected Improvement */}
                <button
                    onClick={() => setAcquisition("ei")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        acquisition === "ei"
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg text-gray-900">EI — Expected Improvement</div>
                    <div className="text-sm text-gray-700 mt-1">
                        Best all-round choice. Balances exploration & exploitation.
                    </div>
                </button>

                {/* Lower Confidence Bound */}
                <button
                    onClick={() => setAcquisition("lcb")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        acquisition === "lcb"
                            ? "border-yellow-600 bg-yellow-50"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg text-gray-900">LCB — Lower Confidence Bound</div>
                    <div className="text-sm text-gray-700 mt-1">
                        Favors uncertain regions. Great for thorough exploration.
                    </div>
                </button>

                {/* Probability of Improvement */}
                <button
                    onClick={() => setAcquisition("pi")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        acquisition === "pi"
                            ? "border-red-600 bg-red-50"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg text-gray-900">PI — Probability of Improvement</div>
                    <div className="text-sm text-gray-700 mt-1">
                        Fast and greedy. May miss global optimum.
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
                    disabled={!acquisition}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}