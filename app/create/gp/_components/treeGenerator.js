import { treeGeneratorData } from "@/app/_data/treeGenExpression";

export default function ChooseTreeGeneratorExpression({
    title = "Step 4: Choose an initial Individual Generator Function",
    currentStep,
    setCurrentStep,
    nextStep,
    treeGenExpression,
    setTreeGenExpression,
    minHeight,
    setMinHeight,
    maxHeight,
    setMaxHeight,
}) {
    return (
        <div className="my-4 mt-16">
            <h4 className="text-lg font-bold mb-4">{title}</h4>
            <div className="grid grid-cols-2 gap-4 align-top">
                {treeGeneratorData.map((algorithm, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setTreeGenExpression(algorithm.name);

                            if (
                                minHeight &&
                                maxHeight &&
                                !isNaN(minHeight) &&
                                !isNaN(maxHeight) &&
                                minHeight <= maxHeight
                            ) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30" +
                            (treeGenExpression &&
                            treeGenExpression === algorithm.name
                            ? " border-blue-500 bg-blue-100 text-blue-900"
                            : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{algorithm.name}</h5>
                        <p>{algorithm.description}</p>
                    </button>
                ))}
            </div>

            {treeGenExpression && (
                <div className="mt-8">
                    <h5 className="text-lg font-bold">
                        {`${nextStep - 1}.1: Configure height constraints for tree
                        generation.`}
                    </h5>
                    {!(
                        minHeight &&
                        maxHeight &&
                        !isNaN(minHeight) &&
                        !isNaN(maxHeight) &&
                        minHeight <= maxHeight
                    ) && (
                        <p className="text-red-500">
                            Min. Height should be less than or equal to Max.
                            Height.
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h6 className="text-lg font-bold mb-4">
                                Min. Height
                            </h6>
                            <input
                                type="number"
                                value={minHeight.toString()}
                                className="border border-gray-300 p-2 rounded-lg"
                                placeholder="Enter a number"
                                onChange={(e) => {
                                    const _minHeight = parseInt(e.target.value);
                                    setMinHeight(_minHeight);

                                    if (
                                        maxHeight &&
                                        _minHeight &&
                                        !isNaN(_minHeight) &&
                                        !isNaN(maxHeight) &&
                                        _minHeight <= maxHeight
                                    ) {
                                        setCurrentStep(
                                            currentStep < nextStep
                                                ? nextStep
                                                : currentStep,
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h6 className="text-lg font-bold mb-4">
                                Max. Height
                            </h6>
                            <input
                                type="number"
                                value={maxHeight.toString()}
                                className="border border-gray-300 p-2 rounded-lg"
                                placeholder="Enter a number"
                                onChange={(e) => {
                                    const _maxHeight = parseInt(e.target.value);
                                    setMaxHeight(_maxHeight);

                                    if (
                                        minHeight &&
                                        _maxHeight &&
                                        !isNaN(minHeight) &&
                                        !isNaN(_maxHeight) &&
                                        minHeight <= _maxHeight
                                    ) {
                                        setCurrentStep(
                                            currentStep < nextStep
                                                ? nextStep
                                                : currentStep,
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
