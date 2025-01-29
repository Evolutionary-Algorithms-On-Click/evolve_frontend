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
    currentStep,
}) {
    // Section will have a div representing selected values.
    return (
        <div className="flex flex-col items-start p-4 min-w-16 h-fit md:sticky top-4 bg-grey-100 bg-opacity-70 text-black">
            <h3 className="text-xl font-bold">Config Summary</h3>
            <div className="flex flex-col">
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">Algorithm</h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {algo || "None"}
                    </code>
                </div>

                {parameters ? <hr className="my-4" /> : null}

                {parameters && (
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

                {indGen ? <hr className="mt-4" /> : null}

                {indGen && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Individual Generator
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {indGen}
                        </code>
                    </div>
                )}

                {indSize ? <hr className="mt-4" /> : null}

                {indSize && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Individual Size
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {indSize}
                        </code>
                    </div>
                )}

                {popFunc ? <hr className="mt-4" /> : null}

                {popFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Population Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {popFunc}
                        </code>
                    </div>
                )}

                {mateFunc ? <hr className="mt-4" /> : null}

                {mateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Mating Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {mateFunc}
                        </code>
                    </div>
                )}

                {mutateFunc ? <hr className="mt-4" /> : null}

                {mutateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Mutation Function
                        </h4>
                        <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                            {mutateFunc}
                        </code>
                    </div>
                )}

                {selectFunc ? <hr className="mt-4" /> : null}

                {selectFunc && (
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

                {evalFunc ? <hr className="mt-4" /> : null}

                {evalFunc && (
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
                        {populationSize ? <hr className="mt-4" /> : null}

                        {populationSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    Population Size
                                </h4>
                                <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                    {populationSize}
                                </code>
                            </div>
                        )}

                        {generations ? <hr className="mt-4" /> : null}

                        {generations && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    Generations
                                </h4>
                                <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                    {generations}
                                </code>
                            </div>
                        )}

                        {cxpb ? <hr className="mt-4" /> : null}

                        {cxpb && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    Crossover Probability
                                </h4>
                                <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                    {cxpb}
                                </code>
                            </div>
                        )}

                        {mutpb ? <hr className="mt-4" /> : null}

                        {mutpb && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    Mutation Probability
                                </h4>
                                <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                    {mutpb}
                                </code>
                            </div>
                        )}

                        {hofSize ? <hr className="mt-4" /> : null}

                        {hofSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold mb-1">
                                    Hall of Fame Size
                                </h4>
                                <code className="border border-blue-400 py-1 px-2 rounded-xl text-foreground">
                                    {hofSize}
                                </code>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
