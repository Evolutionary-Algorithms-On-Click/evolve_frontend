export default function ChooseMatingFunction({
    title = "Step 6: Choose a mating function.",
    mateData,
    mateFunc,
    setMateFunc,
    currentStep,
    nextStep,
    setCurrentStep,
    terminalProb,
    setTerminalProb,
    setPrimitiveSet, // Only used for GP -> cxSemantic.
}) {
    return (
        <div className="mt-8">
            <h4 className="text-lg font-bold mb-4">{title}</h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 align-top">
                {mateData.map((mate, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMateFunc(mate.name);

                            if (
                                mate.name === "cxOnePointLeafBiased" &&
                                terminalProb < 0
                            ) {
                                return;
                            }

                            if (mate.name === "cxSemantic") {
                                setPrimitiveSet(["lf", "mul", "add", "sub"]);
                            }

                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-full sm:min-w-2/3 bg-opacity-30" +
                            (mateFunc && mateFunc === mate.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{mate.name}</h5>
                        <p>{mate.description}</p>
                    </button>
                ))}
            </div>

            {mateFunc === "cxOnePointLeafBiased" && (
                <div className="mt-8">
                    <h4 className="text-lg font-bold mb-4">
                        {`Step ${nextStep - 1}.1: Set the terminal probability for
                        cxOnePointLeafBiased.`}
                    </h4>
                    <input
                        type="number"
                        value={terminalProb}
                        onChange={(e) => {
                            e.preventDefault();
                            if (isNaN(e.target.value) || e.target.value < 0) {
                                e.target.value = 0.1;
                            }

                            setTerminalProb(e.target.value);
                        }}
                        className="border border-gray-300 p-2 rounded-lg max-w-xl text-left items-start min-w-full sm:min-w-2/3"
                    />
                </div>
            )}
        </div>
    );
}
