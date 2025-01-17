import { mutationData } from "@/app/_data/mutation";

export default function ChooseMutationFunction({
    mutateFunc,
    setMutateFunc,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 7: Choose a mutation function.
            </h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-2 gap-4 align-top">
                {mutationData.map((mut, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMutateFunc(mut.name);
                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" +
                            (mutateFunc && mutateFunc === mut.name
                                ? " bg-foreground text-background"
                                : "")
                        }
                    >
                        <h5 className="text-lg font-bold">{mut.name}</h5>
                        <p>{mut.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
