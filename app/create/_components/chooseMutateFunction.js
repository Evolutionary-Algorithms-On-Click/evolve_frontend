import TheoryTooltip from "@/app/_components/TheoryTooltip";

export default function ChooseMutationFunction({
    title = "Step 7: Choose a mutation function.",
    mutationData,
    mutateFunc,
    setMutateFunc,
    currentStep,
    nextStep,
    setCurrentStep,
    mode,
    setMode,
}) {
    return (
        <div className="mt-16">
            <h4 className="flex items-center text-lg font-bold mb-4">
                {title}
                <TheoryTooltip id="mutationFunction" />
            </h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
                {mutationData.map((mut, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMutateFunc(mut.name);

                            if (
                                mut.name === "mutEphemeral" &&
                                ["one", "all"].includes(mode)
                            ) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                                return;
                            }

                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30 " +
                            (mutateFunc && mutateFunc === mut.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold break-words">{mut.name}</h5>
                        <p className="text-sm mt-2">{mut.description}</p>
                    </button>
                ))}
            </div>

            {mutateFunc === "mutEphemeral" && (
                <div className="mt-8">
                    <h5 className="text-lg font-bold">
                        {`Step ${nextStep - 1}.1: Choose the number of individual ephemeral constants to mutate.`}
                    </h5>
                    <div className="mt-4 grid grid-cols-2 gap-2 align-top">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setMode("one");
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }}
                            className={
                                "border border-gray-300 p-4 rounded-lg text-center" +
                                (mode === "one"
                                    ? " bg-gray-900 text-white"
                                    : " bg-white text-gray-900")
                            }
                        >
                            <h5 className="text-lg font-bold">One</h5>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setMode("all");
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }}
                            className={
                                "border border-gray-300 p-4 rounded-lg text-center" +
                                (mode === "all"
                                    ? " bg-gray-900 text-white"
                                    : " bg-white text-gray-900")
                            }
                        >
                            <h5 className="text-lg font-bold">All</h5>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
