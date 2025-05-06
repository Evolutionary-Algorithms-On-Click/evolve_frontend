export function GetIndividualSize({
    indSize,
    setIndSize,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 4: Number of dimensions for the problem? (Individual Size)
            </h4>
            <input
                type="number"
                min={0}
                value={indSize}
                className="border border-gray-300 p-3 rounded-lg w-full max-w-md"
                placeholder="Enter a number"
                onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setIndSize(value);
                    if (value > 0) {
                        setCurrentStep(
                            currentStep < nextStep ? nextStep : currentStep,
                        );
                    }
                }}
            />
        </div>
    );
}
