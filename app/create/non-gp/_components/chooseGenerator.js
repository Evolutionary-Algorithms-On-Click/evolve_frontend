import { individualData } from "@/app/_data/individual";

export default function ChooseGenerator({
    indGen,
    setIndGen,
    randomRangeStart,
    setRandomRangeStart,
    randomRangeEnd,
    setRandomRangeEnd,
    currentStep,
    setCurrentStep,
    nextStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-8">
                Step 3: Choose an individual generator function.
            </h4>
            {/* grid: each element has a name and description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
                {individualData.map((ind, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIndGen(ind.name);

                            if (
                                ["floatingPoint", "integer"].includes(ind.name)
                            ) {
                                setRandomRangeStart("");
                                setRandomRangeEnd("");
                            } else {
                                setRandomRangeStart("0");
                                setRandomRangeEnd("0");
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-2/3 bg-opacity-30 " +
                            (indGen && indGen === ind.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold break-words">{ind.name}</h5>
                        <p className="text-sm mt-2">{ind.description}</p>
                    </button>
                ))}
            </div>
            {indGen && ["floatingPoint", "integer"].includes(indGen) && (
                <div className="mt-8">
                    <h5 className="text-lg font-bold mb-4">
                        Step 3.1: Random Range
                    </h5>
                    {randomRangeStart &&
                        randomRangeEnd &&
                        (isNaN(randomRangeEnd) ||
                            isNaN(randomRangeStart) ||
                            parseInt(randomRangeStart) >
                                parseInt(randomRangeEnd)) && (
                            <p className="text-red-500 font-bold mb-3">
                                Selected range is invalid. Please make sure the
                                start is less than the end and both are numbers.
                            </p>
                        )}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="number"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder="Start Value"
                            value={randomRangeStart.toString()}
                            onChange={(e) => {
                                setRandomRangeStart(e.target.value);

                                if (randomRangeEnd && e.target.value) {
                                    if (
                                        isNaN(randomRangeEnd) ||
                                        isNaN(e.target.value) ||
                                        parseInt(randomRangeEnd) <
                                            parseInt(e.target.value)
                                    ) {
                                        return;
                                    }

                                    setCurrentStep(
                                        currentStep < nextStep
                                            ? nextStep
                                            : currentStep,
                                    );
                                }
                            }}
                        />
                        <input
                            type="number"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder="End Value"
                            value={randomRangeEnd.toString()}
                            onChange={(e) => {
                                setRandomRangeEnd(e.target.value);

                                if (randomRangeStart && e.target.value) {
                                    if (
                                        isNaN(randomRangeStart) ||
                                        isNaN(e.target.value) ||
                                        parseInt(randomRangeStart) >
                                            parseInt(e.target.value)
                                    ) {
                                        return;
                                    }

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
            )}
        </div>
    );
}
