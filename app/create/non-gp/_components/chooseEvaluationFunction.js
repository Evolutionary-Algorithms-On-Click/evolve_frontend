import { evalFuncData } from "@/app/_data/evaluation";

export default function ChooseEvalFunction({
    evalFunc,
    setEvalFunc,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 9: Choose an evaluation function
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
                {evalFuncData.map((evalF, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setEvalFunc(evalF.name);
                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30 " +
                            (evalFunc && evalFunc === evalF.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold break-words">{evalF.name}</h5>
                        <p className="text-sm mt-2">{evalF.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
