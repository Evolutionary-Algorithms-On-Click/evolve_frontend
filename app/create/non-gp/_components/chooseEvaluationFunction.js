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
            <div className="grid grid-cols-2 gap-4 align-top">
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
                            "border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" +
                            (evalFunc && evalFunc === evalF.name
                                ? " bg-foreground text-background"
                                : "")
                        }
                    >
                        <h5 className="text-lg font-bold">{evalF.name}</h5>
                        <p>{evalF.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
