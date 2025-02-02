export default function PreviewGP({
    algo,
    parameters,

    indGen,

    primitiveSet,

    treeGenExpression,
    minHeight,
    maxHeight,

    popFunc,

    selectFunc,
    tempTourSize,

    mutateFunc,
    mode,
    mutExpr,
    mutMinHeight,
    mutMaxHeight,

    matingFunc,
    terminalProb,

    mateHeightLimit,
    mutateHeightLimit,

    generations,
    populationSize,
    cxpb,
    mutpb,
    hofSize,
    currentStep,
}) {
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
            </div>

            {parameters ? <hr className="my-4" /> : null}

            {parameters && parameters.length > 0 && (
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
                                        <td className="border border-gray-300 p-2">
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
                    ) : null}
                </div>
            )}

            {primitiveSet ? <hr className="mt-8" /> : null}

            {primitiveSet && primitiveSet.length > 0 && (
                <h4 className="text-lg font-semibold">Primitive Set</h4>
            )}

            {primitiveSet && (
                <div className="mt-4 flex flex-row flex-wrap gap-1 max-w-[196px]">
                    {primitiveSet.length > 0
                        ? primitiveSet.map((prim, index) => (
                              <code
                                  key={index}
                                  className="border border-blue-400 py-1 px-2 rounded-xl text-foreground"
                              >
                                  {prim}
                              </code>
                          ))
                        : null}
                </div>
            )}

            {treeGenExpression ? <hr className="mt-4" /> : null}

            {treeGenExpression && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Tree-Gen Expression
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {treeGenExpression}
                    </code>

                    <div className="flex flex-wrap mt-2">
                        <div className="w-1/2">
                            <p className="font-semibold">Min Height</p>
                            <p className="font-extralight">
                                {minHeight.toString()}
                            </p>
                        </div>
                        <div className="w-1/2">
                            <p className="font-semibold">Max Height</p>
                            <p className="font-extralight">
                                {maxHeight.toString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {indGen ? <hr className="mt-4" /> : null}

            {indGen && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Individual Generator
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {indGen}
                    </code>
                </div>
            )}

            {popFunc ? <hr className="mt-4" /> : null}

            {popFunc && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Population Function
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {popFunc}
                    </code>
                </div>
            )}

            {selectFunc ? <hr className="mt-4" /> : null}

            {selectFunc && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Selection Function
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {selectFunc}
                    </code>
                    {selectFunc === "selTournament" && (
                        <p className="font-extralight">
                            Tournament Size: {tempTourSize}
                        </p>
                    )}
                </div>
            )}

            {mutateFunc ? <hr className="mt-4" /> : null}

            {mutateFunc && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Mutation Function
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {mutateFunc}
                    </code>

                    <h4 className="text-md font-semibold mt-2 mb-1">
                        Mutation Expression
                    </h4>

                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {mutExpr ? mutExpr : "None"}
                    </code>

                    {mutateFunc === "mutEphemeral" && (
                        <>
                            <h5 className="text-md font-semibold mt-2 mb-1">
                                Mutation Mode
                            </h5>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {mode}
                            </code>
                        </>
                    )}

                    <div className="flex flex-wrap mt-2">
                        <div className="w-1/2">
                            <p className="font-semibold">Min Height</p>
                            <p className="font-extralight">{mutMinHeight}</p>
                        </div>
                        <div className="w-1/2">
                            <p className="font-semibold">Max Height</p>
                            <p className="font-extralight">{mutMaxHeight}</p>
                        </div>
                    </div>
                </div>
            )}

            {matingFunc ? <hr className="mt-4" /> : null}

            {matingFunc && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-1">
                        Mating Function
                    </h4>
                    <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                        {matingFunc}
                    </code>

                    {matingFunc === "cxOnePointLeafBiased" && (
                        <div>
                            <p className="font-semibold">
                                Terminal Probability
                            </p>
                            <p className="font-extralight">{terminalProb}</p>
                        </div>
                    )}
                </div>
            )}

            {mateHeightLimit ? <hr className="mt-4" /> : null}

            {currentStep >= 11 && mateHeightLimit ? (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Bloat Limit</h4>
                    <div>
                        <p className="font-semibold">Mate</p>
                        <p className="font-extralight">{mateHeightLimit}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Mutate</p>
                        <p className="font-extralight">{mutateHeightLimit}</p>
                    </div>
                </div>
            ) : null}

            {currentStep >= 13 ? (
                <>
                    {populationSize ? <hr className="mt-4" /> : null}

                    {populationSize && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Population Size
                            </h4>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
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
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
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
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
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
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
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
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {hofSize}
                            </code>
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
}
