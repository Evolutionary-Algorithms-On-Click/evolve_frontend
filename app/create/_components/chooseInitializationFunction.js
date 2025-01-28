import { populationFunctionData } from "@/app/_data/populationFunction";

export default function ChooseInitializationFunction({
    title = "Step 5: Choose a population function.",
    popFunc,
    setPopFunc,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">{title}</h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-2 gap-4 align-top">
                {populationFunctionData.map((pop, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setPopFunc(pop.name);
                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30" +
                            (popFunc && popFunc === pop.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                            : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{pop.name}</h5>
                        <p>{pop.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
