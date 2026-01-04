import TheoryTooltip from "@/app/_components/TheoryTooltip";

export function ConfigurePopulationSizeAndGenerations({
    populationSize,
    generations,
    setPopulationSize,
    setGenerations,
    currentStep,
    nextStep,
    setCurrentStep,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">
                Step 7: Configure Population Size and Generations.
            </h4>

            {/* Population Size Input */}
            <div className="mb-4">
                <label
                    htmlFor="populationSize"
                    className="flex items-center text-gray-700 text-sm font-bold mb-2"
                >
                    Population Size
                    <TheoryTooltip id="populationSize" />
                </label>
                <input
                    type="number"
                    id="populationSize"
                    value={populationSize}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter population size"
                    onChange={(e) =>
                        setPopulationSize(parseInt(e.target.value, 10))
                    }
                />
            </div>

            {/* Generations Input */}
            <div className="mb-4">
                <label
                    htmlFor="generations"
                    className="flex items-center text-gray-700 text-sm font-bold mb-2"
                >
                    Generations
                    <TheoryTooltip id="generations" />
                </label>
                <input
                    type="number"
                    id="generations"
                    value={generations}
                    className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter number of generations"
                    onChange={(e) =>
                        setGenerations(parseInt(e.target.value, 10))
                    }
                />
            </div>
        </div>
    );
}
