"use client";

export default function ConfigureKernel({
    kernel,
    setKernel,
    nextStep,
    prevStep,
    surrogate,
}) {
    if (surrogate !== "gp") {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Kernel Selection
                </h2>

                <p className="text-gray-600">
                    Kernel configuration is only required when using a Gaussian Process (GP).
                </p>

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

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Kernel (GP Only)
            </h2>

            <p className="text-gray-600 mb-6">
                The kernel defines how similarity between points is measured in the
                Gaussian Process model.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* RBF Kernel */}
                <button
                    onClick={() => setKernel("rbf")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "rbf"
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">RBF</div>
                    <div className="text-sm opacity-80 mt-1">
                        Smooth functions. Best default choice.
                    </div>
                </button>

                {/* Matérn 2.5 Kernel */}
                <button
                    onClick={() => setKernel("matern_2.5")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "matern_2.5"
                            ? "border-pink-600 bg-pink-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Matérn (ν=2.5)</div>
                    <div className="text-sm opacity-80 mt-1">
                        Twice differentiable. Flexible, realistic.
                    </div>
                </button>

                {/* Matérn 1.5 Kernel */}
                <button
                    onClick={() => setKernel("matern_1.5")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "matern_1.5"
                            ? "border-purple-600 bg-purple-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Matérn (ν=1.5)</div>
                    <div className="text-sm opacity-80 mt-1">
                        Once differentiable. For rougher functions.
                    </div>
                </button>

                {/* Rational Quadratic Kernel */}
                <button
                    onClick={() => setKernel("rational_quadratic")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "rational_quadratic"
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Rational Quadratic</div>
                    <div className="text-sm opacity-80 mt-1">
                        Mix of length scales. Varying smoothness.
                    </div>
                </button>

                {/* Exp-Sine-Squared Kernel */}
                <button
                    onClick={() => setKernel("exp_sine_squared")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "exp_sine_squared"
                            ? "border-orange-600 bg-orange-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Exp-Sine-Squared</div>
                    <div className="text-sm opacity-80 mt-1">
                        Periodic kernel. For seasonal patterns.
                    </div>
                </button>

                {/* Dot Product Kernel */}
                <button
                    onClick={() => setKernel("dot_product")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "dot_product"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Dot Product</div>
                    <div className="text-sm opacity-80 mt-1">
                        Linear kernel. For linear relationships.
                    </div>
                </button>

                {/* White Kernel */}
                <button
                    onClick={() => setKernel("white")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "white"
                            ? "border-gray-600 bg-gray-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">White</div>
                    <div className="text-sm opacity-80 mt-1">
                        Noise kernel. Models observation noise.
                    </div>
                </button>

                {/* Constant Kernel */}
                <button
                    onClick={() => setKernel("constant")}
                    className={`p-4 rounded-xl border transition-all text-left ${
                        kernel === "constant"
                            ? "border-yellow-600 bg-yellow-600 text-white"
                            : "border-gray-300 bg-gray-50 hover:shadow"
                    }`}
                >
                    <div className="font-semibold text-lg">Constant</div>
                    <div className="text-sm opacity-80 mt-1">
                        Constant value. Usually combined with others.
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
                    disabled={!kernel}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}