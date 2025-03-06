export default function PreviewPSO({
    algorithm,
    dimensions,
    weights,
    minPosition,
    maxPosition,
    minSpeed,
    maxSpeed,
    phi1,
    phi2,
    benchmark,
    populationSize,
    generations,
    currentStep,
}) {
    return (
        <div className="flex flex-col items-start p-4 min-w-16 h-fit md:sticky top-4 bg-gray-100 bg-opacity-70 text-black rounded-2xl">
            <h3 className="text-xl font-bold">PSO Config Summary</h3>

            <div className="flex flex-col">
                {currentStep >= 1 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Algorithm
                        </h4>
                        <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                            {algorithm || "None"}
                        </code>
                    </div>
                )}
                {weights && weights.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">Weights</h4>
                        <table className="w-full text-center">
                            <tbody>
                                {weights.map((w, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            index % 2 === 0
                                                ? "bg-blue-50"
                                                : "bg-white"
                                        }
                                    >
                                        <td className="border-b border-gray-300 p-2">
                                            <p className="font-bold">{w}</p>
                                            <p className="font-extralight">
                                                dim_{index + 1}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {currentStep >= 3 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Dimensions
                        </h4>
                        <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                            {dimensions}
                        </code>
                    </div>
                )}
                {currentStep >= 4 && (
                    <>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Position Range
                            </h4>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {minPosition} to {maxPosition}
                            </code>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Speed Range
                            </h4>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {minSpeed} to {maxSpeed}
                            </code>
                        </div>
                    </>
                )}
                {currentStep >= 5 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-1">
                            Coefficients
                        </h4>
                        <div className="flex flex-col gap-1">
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Cognitive: {phi1}
                            </code>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                Social: {phi2}
                            </code>
                        </div>
                    </div>
                )}
                {currentStep >= 7 && (
                    <>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Evalutaion Function
                            </h4>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {benchmark || "None"}
                            </code>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-1">
                                Population &amp; Generations
                            </h4>
                            <code className="border border-blue-400 py-1 px-3 rounded-full text-foreground">
                                {populationSize} / {generations}
                            </code>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
