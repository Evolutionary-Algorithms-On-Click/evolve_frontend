export default function ConfigureEquation({
    currentStep,
    setCurrentStep,
    nextStep,
    degree,
    setDegree,
    coefficients,
    setCoefficients,
    equation,
    setEquation,
}) {
    const handleDegreeChange = (e) => {
        const newDegree = parseInt(e.target.value) || 0;
        setDegree(newDegree);

        // Reset coefficients if degree changes
        const newCoefficients = Array(newDegree + 1).fill(0);
        setCoefficients(newCoefficients);
    };

    const handleCoefficientChange = (index, value) => {
        const newCoefficients = [...coefficients];
        newCoefficients[index] = parseFloat(value) || 0;
        setCoefficients(newCoefficients);

        // Update the equation string
        const terms = newCoefficients
            .map((coeff, i) => {
                const power = newCoefficients.length - 1 - i;
                return `${coeff}${power > 0 ? `x^${power}` : ""}`;
            })
            .filter((term) => !term.startsWith("0"))
            .join(" + ");
        setEquation(terms);
    };

    return (
        <div className="my-4 mt-16">
            <h4 className="text-lg font-bold mb-4">Step {nextStep - 1}: Define Polynomial Equation</h4>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block mb-2 font-medium">Degree of the Polynomial</label>
                    <input
                        type="number"
                        value={degree}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        placeholder="Enter degree of the polynomial"
                        onChange={(e) => handleDegreeChange(e)}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Coefficients</label>
                    {degree > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: degree + 1 }).map((_, i) => {
                                const index = degree - i;
                                return (
                                    <div key={index} className="flex flex-col">
                                        <label className="mb-2 font-medium">
                                            Coefficient of x^{index}
                                        </label>
                                        <input
                                            type="number"
                                            value={coefficients[index] || ""}
                                            className="border border-gray-300 p-2 rounded-lg w-full"
                                            placeholder={`Enter coefficient for x^${index}`}
                                            onChange={(e) =>
                                                handleCoefficientChange(index, e.target.value)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <h5 className="text-lg font-bold">Polynomial Equation</h5>
                    <p className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        {equation || "Equation will appear here"}
                    </p>
                </div>
            </div>

            {degree > 0 && equation && (
                <button
                    onClick={() => setCurrentStep(currentStep < nextStep ? nextStep : currentStep)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    Proceed to Next Step
                </button>
            )}
        </div>
    );
}
