export function GetDimensions({
    dimensions,
    setDimensions,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 3: Enter the number of dimensions of the particle.
            </h4>
            <input
                type="number"
                value={dimensions}
                className="border border-gray-300 p-2 rounded-lg w-full"
                placeholder="Enter a number"
                onChange={(e) => {
                    if (isNaN(e.target.value)) {
                        e.target.value = 0;
                    }
                    if (e.target.value < 0) {
                        e.target.value = 0;
                    }
                    setDimensions(e.target.value);
                    if (e.target.value > 0) {
                        setCurrentStep(
                            currentStep < nextStep ? nextStep : currentStep,
                        );
                    }
                }}
            />

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
