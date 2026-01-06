export default function Preview({
    algo,
    parameters,
    indGen,
    indSize,
    popFunc,
    mateFunc,
    mutateFunc,
    selectFunc,
    evalFunc,
    tempTourSize,
    populationSize,
    generations,
    cxpb,
    mutpb,
    hofSize,
    crossOverProb = 0.25,
    scalingFactor = 1,
    currentStep,
}) {
    return (
        <div className="flex flex-col items-start p-4 min-w-[280px] w-full h-fit md:sticky md:top-24 bg-gray-100 bg-opacity-70 text-black rounded-2xl border border-gray-400">
            <h3 className="text-xl font-bold">Config Summary</h3>
            <div className="flex flex-col w-full">
                {currentStep >= 1 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">Algorithm</h4>
                        <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                            {algo || "None"}
                        </code>
                    </div>
                )}

                {currentStep >= 2 && parameters && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">Weights</h4>
                        {parameters.length > 0 ? (
                            <table className="w-full text-center">
                                <tbody>
                                    {parameters.map((param, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-blue-50"
                                                    : "bg-white"
                                            }
                                        >
                                            <td className="border-b border-gray-300 p-2">
                                                <p className="font-bold">
                                                    {param + ".0"}
                                                </p>
                                                <p className="font-extralight">
                                                    dim_{index + 1}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>None</p>
                        )}
                    </div>
                )}

                {currentStep >= 3 && indGen && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Individual Generator
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {indGen}
                        </code>
                    </div>
                )}

                {currentStep >= 4 && indSize > 0 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Individual Size
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {indSize}
                        </code>
                    </div>
                )}

                {currentStep >= 5 && popFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Population Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {popFunc}
                        </code>
                    </div>
                )}

                {currentStep >= 6 && mateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Mating Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {mateFunc}
                        </code>
                    </div>
                )}

                {currentStep >= 7 && mutateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Mutation Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {mutateFunc}
                        </code>
                    </div>
                )}

                {currentStep >= 8 && selectFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Selection Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {selectFunc}
                        </code>
                        {selectFunc === "selTournament" && (
                            <p className="font-extralight">
                                Tournament Size = {tempTourSize}
                            </p>
                        )}
                    </div>
                )}

                {currentStep >= 9 && evalFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Evaluation Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {evalFunc}
                        </code>
                    </div>
                )}

                {currentStep >= 10 && (
                    <>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Population Size
                            </h4>
                            <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                {populationSize}
                            </code>
                        </div>

                        {algo === "de" && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    DE Parameters
                                </h4>
                                <div className="flex gap-2">
                                    <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                        CR: {crossOverProb}
                                    </code>
                                    <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                        F: {scalingFactor}
                                    </code>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Generations
                            </h4>
                            <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                {generations}
                            </code>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Crossover Probability
                            </h4>
                            <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                {cxpb}
                            </code>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Mutation Probability
                            </h4>
                            <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                {mutpb}
                            </code>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Hall of Fame Size
                            </h4>
                            <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                {hofSize}
                            </code>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
