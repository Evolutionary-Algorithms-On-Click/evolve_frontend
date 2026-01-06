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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
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
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-[66%] bg-opacity-30 " +
                            (chosenAlgo && chosenAlgo === algorithm.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold break-words">{algorithm.name}</h5>
                        <p className="mt-3 text-sm">{algorithm.description}</p>
                    </button>
                ))}
            </div>

            {/* Extra input args for certain algorithms. */}
            {(chosenAlgo === "eaMuPlusLambda" ||
                chosenAlgo === "eaMuCommaLambda") && (
                <div className="mt-8">
                    <h5 className="text-lg font-bold">
                        Step 1.1: Configure Mu and Lambda
                    </h5>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Mu - (Number of individuals to select for the next generation. Positive Integer)</p>
                        <p>Lambda - (The number of children to produce at each generation. Positive Integer)</p>
                    </div>
                    {chosenAlgo === "eaMuCommaLambda" && !(mu < lambda) && (
                        <p className="text-red-500 font-bold mt-2">
                            Mu should be less than Lambda for eaMuCommaLambda.
                        </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex flex-col">
                            <h6 className="flex items-center text-lg font-bold mb-2">
                                Mu
                                <TheoryTooltip id="mu" />
                            </h6>
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
                                                : currentStep,
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h6 className="flex items-center text-lg font-bold mb-2">
                                Lambda
                                <TheoryTooltip id="lambda" />
                            </h6>
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
