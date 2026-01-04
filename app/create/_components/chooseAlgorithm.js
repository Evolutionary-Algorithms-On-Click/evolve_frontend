import TheoryTooltip from "../../_components/TheoryTooltip";
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
    theoryId = "algorithmStrategy",
}) => {
    return (
        <div className="my-4">
            <h4 className="flex items-center text-lg font-bold mb-4">
                {title}
                <TheoryTooltip id={theoryId} />
            </h4>
            <div className="grid grid-cols-2 gap-4 align-top">
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
                            "border p-4 rounded-2xl max-w-xl text-left items-start min-w-2/3  bg-opacity-30" +
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

            {/* Extra input args for certain algorithms. */}
            {(chosenAlgo === "eaMuPlusLambda" ||
                chosenAlgo === "eaMuCommaLambda") && (
                <div className="mt-4">
                    <h5 className="text-lg font-bold">
                        Step 1.1: Configure Mu and Lambda
                    </h5>
                    <p className="text-sm">
                        Mu - (Number of individuals to select for the next
                        generation. Positive Integer)
                    </p>
                    <p className="text-sm">
                        Lambda - (The number of children to produce at each
                        generation. Positive Integer)
                    </p>
                    {chosenAlgo === "eaMuCommaLambda" && !(mu < lambda) && (
                        <p className="text-blue-500">
                            Mu should be less than Lambda for eaMuCommaLambda.
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h6 className="flex items-center text-lg font-bold mb-4">
                                Mu
                                <TheoryTooltip id="mu" />
                            </h6>
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
                            <h6 className="flex items-center text-lg font-bold mb-4">
                                Lambda
                                <TheoryTooltip id="lambda" />
                            </h6>
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
