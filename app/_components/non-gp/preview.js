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
        <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 min-w-16 h-fit md:sticky top-4 bg-white text-black">
            <h3 className="text-xl font-bold">Config Summary</h3>
            <div className="flex flex-col">
                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Algorithm</h4>
                    <code className="bg-foreground p-1 rounded-lg text-background">
                        {algo || "None"}
                    </code>
                </div>

                {parameters ? <hr className="my-4" /> : null}

                {parameters && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">Weights</h4>
                        {parameters.length > 0 ? (
                            <table className="w-full text-center">
                                <tbody>
                                    {parameters.map((param, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-gray-100"
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
                        <h4 className="text-lg font-semibold">
                            Individual Generator
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {indGen}
                        </code>
                    </div>
                )}

                {indSize ? <hr className="mt-4" /> : null}

                {indSize && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                            Individual Size
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {indSize}
                        </code>
                    </div>
                )}

                {popFunc ? <hr className="mt-4" /> : null}

                {popFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                            Population Function
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {popFunc}
                        </code>
                    </div>
                )}

                {mateFunc ? <hr className="mt-4" /> : null}

                {mateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                            Mating Function
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {mateFunc}
                        </code>
                    </div>
                )}

                {mutateFunc ? <hr className="mt-4" /> : null}

                {mutateFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                            Mutation Function
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {mutateFunc}
                        </code>
                    </div>
                )}

                {selectFunc ? <hr className="mt-4" /> : null}

                {selectFunc && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                            Selection Function
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
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
                        <h4 className="text-lg font-semibold">
                            Evaluation Function
                        </h4>
                        <code className="bg-foreground p-1 rounded-lg text-background">
                            {evalFunc}
                        </code>
                    </div>
                )}

                {currentStep >= 10 && (
                    <>
                        {populationSize ? <hr className="mt-4" /> : null}

                        {populationSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Population Size
                                </h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">
                                    {populationSize}
                                </code>
                            </div>
                        )}

                        {generations ? <hr className="mt-4" /> : null}

                        {generations && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Generations
                                </h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">
                                    {generations}
                                </code>
                            </div>
                        )}

                        {cxpb ? <hr className="mt-4" /> : null}

                        {cxpb && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Crossover Probability
                                </h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">
                                    {cxpb}
                                </code>
                            </div>
                        )}

                        {mutpb ? <hr className="mt-4" /> : null}

                        {mutpb && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Mutation Probability
                                </h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">
                                    {mutpb}
                                </code>
                            </div>
                        )}

                        {hofSize ? <hr className="mt-4" /> : null}

                        {hofSize && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Hall of Fame Size
                                </h4>
                                <code className="bg-foreground p-1 rounded-lg text-background">
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
