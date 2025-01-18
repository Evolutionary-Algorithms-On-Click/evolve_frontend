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

        // Reset coefficients and equation if degree changes
        const newCoefficients = Array(newDegree + 1).fill("");
        setCoefficients(newCoefficients);
        setEquation(""); // Reset the equation
    };

    const handleCoefficientChange = (index, value) => {
        // Strict validation: Only valid numbers are allowed
        if (!/^[-+]?\d*\.?\d*$/.test(value) && value !== "") return; // Ignore invalid input

        const newCoefficients = [...coefficients];
        newCoefficients[index] = value; // Update the coefficient
        setCoefficients(newCoefficients);

        // Update the equation string
        const terms = newCoefficients
            .map((coeff, i) => {
                const power = degree - i; // Correct index for descending powers of x
                const formattedCoeff = parseFloat(coeff);
                if (isNaN(formattedCoeff) || formattedCoeff === 0) return null; // Skip 0 coefficients

                // Handle coefficient display (omit 1 for non-constant terms)
                const coeffStr =
                    power > 0 && formattedCoeff === 1
                        ? ""
                        : formattedCoeff === -1
                        ? "-"
                        : formattedCoeff;

                // Construct term based on the power of x
                if (power === 0) return `${coeffStr}`; // Constant term
                if (power === 1) return `${coeffStr}x`; // x term
                return `${coeffStr}x^${power}`; // Higher degree terms
            })
            .filter(Boolean) // Remove null terms
            .join(" + ")
            .replace(/\+\s?-/g, "- "); // Replace "+ -" with "- "

        setEquation(terms);
    };

    return (
        <div className="my-4 mt-16">
            <h4 className="text-lg font-bold mb-4">Step {nextStep - 1}: Define Polynomial Equation</h4>

            <div className="flex flex-col gap-4">
                {/* Input for Degree of Polynomial */}
                <div>
                    <label className="block mb-2 font-medium">Degree of the Polynomial</label>
                    <input
                        type="number"
                        min="0"
                        value={degree}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        placeholder="Enter degree of the polynomial"
                        onChange={(e) => handleDegreeChange(e)}
                    />
                </div>

                {/* Input for Coefficients */}
                <div>
                    <label className="block mb-2 font-medium">Coefficients</label>
                    {degree > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: degree + 1 }).map((_, i) => {
                                const index = i; // Fix coefficient index ordering
                                return (
                                    <div key={index} className="flex flex-col">
                                        <label className="mb-2 font-medium">
                                            Coefficient of x^{degree - i}
                                        </label>
                                        <input
                                            type="text"
                                            value={coefficients[index] || ""}
                                            className="border border-gray-300 p-2 rounded-lg w-full"
                                            placeholder={`Enter coefficient for x^${degree - i}`}
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

                {/* Display Polynomial Equation */}
                <div className="mt-4">
                    <h5 className="text-lg font-bold">Polynomial Equation</h5>
                    <p className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        {equation || "Equation will appear here"}
                    </p>
                </div>
            </div>

            {/* Proceed Button */}
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
