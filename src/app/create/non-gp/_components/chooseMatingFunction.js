import { mateData } from "@/app/_data/mate";

export default function ChooseMatingFunction({
    mateFunc,
    setMateFunc,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 6: Choose a mating function.
            </h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-2 gap-4 align-top">
                {mateData.map((mate, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMateFunc(mate.name);
                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" +
                            (mateFunc && mateFunc === mate.name
                                ? " bg-foreground text-background"
                                : "")
                        }
                    >
                        <h5 className="text-lg font-bold">{mate.name}</h5>
                        <p>{mate.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
