import TheoryTooltip from "@/app/_components/TheoryTooltip";

export function ConfigureParticle({
    minPos,
    maxPos,
    setMinPos,
    setMaxPos,
    minSpeed,
    maxSpeed,
    setMinSpeed,
    setMaxSpeed,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="flex items-center text-lg font-bold mb-4">
                Step 4: Configure particle parameters.
                <TheoryTooltip id="minMaxBoundaries" />
            </h4>

            {/* Min Position Input */}
            <div className="mb-4">
                <label
                    htmlFor="minPos"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Minimum Position:
                </label>
                <input
                    type="number"
                    step="any"
                    id="minPos"
                    value={minPos}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter minimum position"
                    onChange={(e) => setMinPos(parseFloat(e.target.value))}
                />
            </div>

            {/* Max Position Input */}
            <div className="mb-4">
                <label
                    htmlFor="maxPos"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Maximum Position:
                </label>
                <input
                    type="number"
                    step="any"
                    id="maxPos"
                    value={maxPos}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter maximum position"
                    onChange={(e) => setMaxPos(parseFloat(e.target.value))}
                />
            </div>

            {/* Min Speed Input */}
            <div className="mb-4">
                <label
                    htmlFor="minSpeed"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Minimum Speed:
                </label>
                <input
                    type="number"
                    step="any"
                    id="minSpeed"
                    value={minSpeed}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter minimum speed"
                    onChange={(e) => setMinSpeed(parseFloat(e.target.value))}
                />
            </div>

            {/* Max Speed Input */}
            <div className="mb-4">
                <label
                    htmlFor="maxSpeed"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Maximum Speed:
                </label>
                <input
                    type="number"
                    step="any"
                    id="maxSpeed"
                    value={maxSpeed}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter maximum speed"
                    onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
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
