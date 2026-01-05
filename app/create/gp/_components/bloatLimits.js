import TheoryTooltip from "@/app/_components/TheoryTooltip";

export default function ConfigureBloatLimits({
    mateHeight,
    setMateHeight,
    mutHeight,
    setMutHeight,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="flex items-center text-lg font-bold mb-4">
                {`Step ${nextStep - 1}: Configure Bloat Limits`}
                <TheoryTooltip id="bloatLimits" />
            </h4>

            <div className="grid grid-cols-2 gap-4 align-top">
                <div>
                    <label className="block mb-2 font-medium">
                        Min Height after mutating.
                    </label>
                    <input
                        type="number"
                        value={mateHeight}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                e.target.value = 0;
                            }
                            if (e.target.value < 0) {
                                e.target.value = 0;
                            }
                            setMateHeight(e.target.value);
                            if (e.target.value >= 0 && mutHeight >= 0) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Max Height after mutating.
                    </label>
                    <input
                        type="number"
                        value={mutHeight}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                e.target.value = 0;
                            }
                            if (e.target.value < 0) {
                                e.target.value = 0;
                            }
                            setMutHeight(e.target.value);
                            if (e.target.value >= 0 && mateHeight >= 0) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
