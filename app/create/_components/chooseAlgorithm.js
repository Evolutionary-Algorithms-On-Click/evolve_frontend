import { algorithmData } from "@/app/_data/algorithms";

export const ChooseAlgo = ({
    title=`Step 1: Choose Algorithm`,
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
        <div className="my-4">
            <h4 className="text-lg font-bold mb-4">{title}</h4>
            <div className="grid grid-cols-2 gap-4 align-top">
                {algorithmData.map((algorithm, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setChosenAlgo(algorithm.name);

                            if (
                                algorithm.name !== "eaMuPlusLambda" &&
                                algorithm.name !== "eaMuCommaLambda"
                            ) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
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
                            "border border-gray-300 p-4 rounded-lg max-w-xl text-left items-start min-w-2/3" +
                            (chosenAlgo && chosenAlgo === algorithm.name
                                ? " bg-foreground text-background"
                                : "")
                        }
                    >
                        <h5 className="text-lg font-bold">{algorithm.name}</h5>
                        <p>{algorithm.description}</p>
                    </button>
                ))}
            </div>

            {/* Extra input args for certain algorithms. */}
            {(chosenAlgo === "eaMuPlusLambda" ||
                chosenAlgo === "eaMuCommaLambda") && (
                <div className="mt-4">
                    <h5 className="text-lg font-bold">
                        Step 1.1: Configure Mu and Lambda
                    </h5>
                    {chosenAlgo === "eaMuCommaLambda" && !(mu < lambda) && (
                        <p className="text-blue-500">
                            Mu should be less than Lambda for eaMuCommaLambda.
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h6 className="text-lg font-bold mb-4">Mu</h6>
                            <input
                                type="number"
                                value={mu.toString()}
                                className="border border-gray-300 p-2 rounded-lg"
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
                                        // If next steps are already set and user goes
                                        // back to change mu or lambda, we don't want
                                        // to reset the steps.
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
                            <h6 className="text-lg font-bold mb-4">Lambda</h6>
                            <input
                                type="number"
                                value={lambda.toString()}
                                className="border border-gray-300 p-2 rounded-lg"
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
                                        // If next steps are already set and user goes
                                        // back to change mu or lambda, we don't want
                                        // to reset the steps.
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
};
