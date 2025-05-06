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

            {/* Responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            "border border-gray-300 p-4 rounded-lg w-full text-left bg-opacity-30" +
                            (indGen && indGen === ind.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{ind.name}</h5>
                        <p className="text-sm">{ind.description}</p>
                    </button>
                ))}
            </div>

            {indGen && ["floatingPoint", "integer"].includes(indGen) && (
                <div className="mt-6">
                    <h5 className="text-lg font-bold mb-2">
                        Step 3.1: Random Range
                    </h5>

                    {randomRangeStart &&
                        randomRangeEnd &&
                        (isNaN(randomRangeEnd) ||
                            isNaN(randomRangeStart) ||
                            parseInt(randomRangeStart) >
                                parseInt(randomRangeEnd)) && (
                            <p className="text-blue-500 mb-3">
                                Selected range is invalid. Ensure start &lt; end
                                and both are numbers.
                            </p>
                        )}

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="number"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder="Start"
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
                            placeholder="End"
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
