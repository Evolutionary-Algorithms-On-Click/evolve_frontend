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
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 1.1: Configure DE parameters.
            </h4>

            {/* phi1 Input */}
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

            {/* phi2 Input */}
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
