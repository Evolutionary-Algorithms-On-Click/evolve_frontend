export function ConfigureDEParams({
    phi1,
    phi2,
    setPhi1,
    setPhi2,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-16">
            <h4 className="text-lg sm:text-xl font-bold mb-4">
                Step 1.1: Configure DE Parameters
            </h4>

            {/* Crossover Rate */}
            <div className="mb-4">
                <label
                    htmlFor="phi1"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Crossover Rate (CR)
                </label>
                <input
                    type="number"
                    step="any"
                    id="phi1"
                    value={phi1}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter CR"
                    onChange={(e) => setPhi1(parseFloat(e.target.value))}
                />
            </div>

            {/* Scaling Factor */}
            <div className="mb-4">
                <label
                    htmlFor="phi2"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Scaling Factor (F)
                </label>
                <input
                    type="number"
                    step="any"
                    id="phi2"
                    value={phi2}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter F"
                    onChange={(e) => setPhi2(parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
}
