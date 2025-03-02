export function ConfigureCognitiveAndSocialCoeff({
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
                Step 4: Configure particle parameters.
            </h4>

            {/* phi1 Input */}
            <div className="mb-4">
                <label
                    htmlFor="phi1"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Cognitive Coefficient (phi1):
                </label>
                <input
                    type="number"
                    step="any"
                    id="phi1"
                    value={phi1}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter phi1"
                    onChange={(e) => setPhi1(parseFloat(e.target.value))}
                />
            </div>

            {/* phi2 Input */}
            <div className="mb-4">
                <label
                    htmlFor="phi2"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Social Coefficient (phi2):
                </label>
                <input
                    type="number"
                    step="any"
                    id="phi2"
                    value={phi2}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter phi2"
                    onChange={(e) => setPhi2(parseFloat(e.target.value))}
                />
            </div>

            {currentStep < nextStep && (
                <button
                    className="mt-4 border border-blue-500 bg-blue-100 text-blue-900 p-2 rounded-lg w-full hover:bg-blue-200 active:opacity-50"
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentStep(
                            currentStep < nextStep ? nextStep : currentStep,
                        );
                    }}
                >
                    {"Next ->"}
                </button>
            )}
        </div>
    );
}
