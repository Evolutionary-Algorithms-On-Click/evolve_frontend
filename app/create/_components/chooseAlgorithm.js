import { algorithmData } from "@/app/_data/algorithms";

export const ChooseAlgo = ({
    title = `Step 1: Choose Algorithm Strategy`,
    algoData = algorithmData,
    chosenAlgo,
    setChosenAlgo,
    nextStep,
    currentStep,
    setCurrentStep,
    mu,
    setMu,
    lambda,
    setLambda,
}) => {
    return (
        <div className="my-4 px-4">
            <h4 className="text-lg font-bold mb-4">{title}</h4>

            {/* Responsive grid for algorithm buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algoData.map((algorithm, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setChosenAlgo(algorithm.name);

                            if (
                                algorithm.name !== "eaMuPlusLambda" &&
                                algorithm.name !== "eaMuCommaLambda"
                            ) {
                                setCurrentStep(
                                    currentStep < nextStep ? nextStep : currentStep
                                );
                            }

                            if (
                                algorithm.name === "eaMuPlusLambda" ||
                                algorithm.name === "eaMuCommaLambda"
                            ) {
                                setCurrentStep(nextStep - 1);
                            }
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-2xl w-full text-left bg-opacity-30 transition-all duration-200" +
                            (chosenAlgo && chosenAlgo === algorithm.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{algorithm.name}</h5>
                        <p className="mt-3 text-sm">{algorithm.description}</p>
                    </button>
                ))}
            </div>

            {/* Mu & Lambda section */}
            {(chosenAlgo === "eaMuPlusLambda" ||
                chosenAlgo === "eaMuCommaLambda") && (
                <div className="mt-6">
                    <h5 className="text-lg font-bold mb-2">
                        Step 1.1: Configure Mu and Lambda
                    </h5>
                    <p className="text-sm">
                        Mu - (Number of individuals to select for the next generation. Positive Integer)
                    </p>
                    <p className="text-sm">
                        Lambda - (Number of children to produce at each generation. Positive Integer)
                    </p>

                    {chosenAlgo === "eaMuCommaLambda" && !(mu < lambda) && (
                        <p className="text-blue-500 mt-2">
                            Mu should be less than Lambda for eaMuCommaLambda.
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <h6 className="text-lg font-bold mb-2">Mu</h6>
                            <input
                                type="number"
                                value={mu.toString()}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                placeholder="Enter a number"
                                onChange={(e) => {
                                    const _mu = parseInt(e.target.value);
                                    setMu(_mu);
                                    if (
                                        chosenAlgo === "eaMuCommaLambda" &&
                                        lambda &&
                                        !(_mu < lambda)
                                    ) {
                                        return;
                                    }

                                    if (lambda && _mu) {
                                        setCurrentStep(
                                            currentStep < nextStep
                                                ? nextStep
                                                : currentStep
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h6 className="text-lg font-bold mb-2">Lambda</h6>
                            <input
                                type="number"
                                value={lambda.toString()}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                placeholder="Enter a number"
                                onChange={(e) => {
                                    const _lambda = parseInt(e.target.value);
                                    setLambda(_lambda);
                                    if (
                                        chosenAlgo === "eaMuCommaLambda" &&
                                        mu &&
                                        !(mu < _lambda)
                                    ) {
                                        return;
                                    }

                                    if (mu && _lambda) {
                                        setCurrentStep(
                                            currentStep < nextStep
                                                ? nextStep
                                                : currentStep
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
};
