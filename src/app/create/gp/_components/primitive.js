import { primitiveSetElements } from "@/app/_data/primitive";

export default function ChoosePrimitiveSet({
    currentStep,
    setCurrentStep,
    nextStep,
    primitiveSet,
    setPrimitiveSet,
}) {
    return (
        <div className="my-4">
            <h4 className="text-lg font-bold mb-8">Step 2: Choose Primitive Set Elements.</h4>
            <div className="grid grid-cols-2 gap-4 align-top">
                {primitiveSetElements.map((element, index) => (
                    <button onClick={(e) => {
                        e.preventDefault();

                        let _set = new Set(primitiveSet);
                        _set.has(element.name) ? _set.delete(element.name) : _set.add(element.name);
                        setPrimitiveSet(Array.from(_set));

                        setCurrentStep(currentStep < nextStep ? nextStep : currentStep);
                    }} key={index} className={"border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" + (primitiveSet && (primitiveSet.includes(element.name)) ? " bg-foreground text-background" : "")}>
                        <h5 className="text-lg font-bold">{element.name}</h5>
                        <p className="text-sm text-gray-400">Arity: {element.arity}</p>
                        <p>{element.description}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}