import { primitiveSetElements } from "@/app/_data/primitive";

export default function ChoosePrimitiveSet({
    currentStep,
    setCurrentStep,
    nextStep,
    primitiveSet,
    setPrimitiveSet,
}) {
    return (
        <div className="my-4 mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 3: Choose Primitive Set Elements.
            </h4>
            <div className="grid grid-cols-2 gap-4 align-top">
                {primitiveSetElements.map((element, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();

                            let _set = new Set(primitiveSet);
                            _set.has(element.name)
                                ? _set.delete(element.name)
                                : _set.add(element.name);
                            setPrimitiveSet(Array.from(_set));

                            setCurrentStep(
                                currentStep < nextStep ? nextStep : currentStep,
                            );
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30" +
                            (primitiveSet && primitiveSet.includes(element.name)
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{element.name}</h5>
                        <p className="text-sm text-gray-400">
                            Arity: {element.arity}
                        </p>
                        <p>{element.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
