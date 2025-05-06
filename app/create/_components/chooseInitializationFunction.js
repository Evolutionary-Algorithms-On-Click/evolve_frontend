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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {populationFunctionData.map((pop, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            setPopFunc(pop.name);
                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep
                            );
                        }}
                        className={`border p-4 rounded-lg text-left transition duration-200 ease-in-out
                            ${
                                popFunc === pop.name
                                    ? "border-blue-500 bg-blue-100 text-blue-900"
                                    : "border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        <h5 className="text-lg font-semibold mb-1">{pop.name}</h5>
                        <p className="text-sm text-gray-700">{pop.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
