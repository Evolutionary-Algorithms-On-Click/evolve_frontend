export default function PreviewML({
    datasetURL,
    targetColumnName,
    sep,
    mlImportCodeString,
    mlEvalFunctionCodeString,
    chosenAlgo,
    mu,
    lambda,
    parameters,
    matingFunc,
    mutateFunc,
    selectFunc,
    tempTourSize,
    populationSize,
    generations,
    cxpb,
    mutpb,
    hof,
    currentStep,
}) {
    return (
        <div className="flex flex-col items-start p-4 h-fit md:sticky top-4 bg-gray-100 bg-opacity-70 text-black rounded-2xl">
            <h3 className="text-xl font-bold">ML Config Summary</h3>
            <div className="flex flex-col mt-4">
                {currentStep >= 1 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Dataset Configuration
                        </h4>
                        <div>
                            <p className="text-sm">Dataset URL:</p>
                            <pre className="border border-blue-400 py-1 rounded-full text-foreground overflow-auto w-[400px]">
                                <code className="w-[400px]">
                                    {datasetURL || "Not provided"}
                                </code>
                            </pre>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm">Target Column:</p>
                            <code className="border border-blue-400 py-1 rounded-full text-foreground">
                                {targetColumnName || "Not provided"}
                            </code>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm">Separator:</p>
                            <code className="border border-blue-400 py-1 rounded-full text-foreground">
                                {sep}
                            </code>
                        </div>
                    </div>
                )}
                {currentStep >= 2 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">ML Code</h4>
                        <div>
                            <p className="text-sm">Import Code:</p>
                            <pre className="bg-gray-200 p-2 rounded-lg text-sm mt-1 w-[400px] overflow-auto">
                                <code className="w-[400px]">
                                    {mlImportCodeString}
                                </code>
                            </pre>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm">Evaluation Function Code:</p>
                            <pre className="bg-gray-200 p-2 rounded-lg text-sm mt-1 w-[400px] overflow-auto">
                                <code className="w-[400px]">
                                    {mlEvalFunctionCodeString}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
                {currentStep >= 3 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Algorithm Selection
                        </h4>
                        <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                            {chosenAlgo || "None"}
                        </code>
                    </div>
                )}
                {currentStep >= 4 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Evolutionary Parameters
                        </h4>
                        <div className="flex flex-col gap-2">
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                μ: {mu}, λ: {lambda}
                            </code>
                            {parameters && parameters.length > 0 && (
                                <div>
                                    <p className="text-sm">Weights:</p>
                                    <table className="w-full text-center mt-1">
                                        <tbody>
                                            {parameters.map((w, index) => (
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
                                                            {w}
                                                        </p>
                                                        <p className="font-extralight">
                                                            param_{index + 1}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Mating: {matingFunc || "None"}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Mutation: {mutateFunc || "None"}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Selection: {selectFunc || "None"} (Tournament
                                Size: {tempTourSize})
                            </code>
                        </div>
                    </div>
                )}
                {currentStep >= 5 && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Optimization Settings
                        </h4>
                        <div className="flex flex-col gap-2">
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Population: {populationSize}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Generations: {generations}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Crossover Prob: {cxpb}, Mutation Prob: {mutpb}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Hall of Fame Size: {hof}
                            </code>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
