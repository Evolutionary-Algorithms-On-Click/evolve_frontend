import { selectionData } from "@/app/_data/selection";

export default function ChooseSelectionFunction({
    title = "Step 8: Choose a selection function.",
    selData = selectionData,
    selectFunc,
    setSelectFunc,
    currentStep,
    nextStep,
    setCurrentStep,
    tempTourSize,
    setTempTourSize,
}) {
    return (
        <div className="mt-16">
            <h4 className="text-lg font-bold mb-4">{title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 align-top">
                {selData.map((sel, index) => (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectFunc(sel.name);
                            if (sel.name !== "selTournament") {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                                return;
                            }
                        }}
                        key={index}
                        className={
                            "border p-4 rounded-lg max-w-xl text-left items-start min-w-full sm:min-w-2/3 bg-opacity-30" +
                            (selectFunc && selectFunc === sel.name
                                ? " border-blue-500 bg-blue-100 text-blue-900"
                                : " border-gray-300 hover:bg-gray-100 hover:text-foreground")
                        }
                    >
                        <h5 className="text-lg font-bold">{sel.name}</h5>
                        <p>{sel.description}</p>
                    </button>
                ))}
            </div>

            {selectFunc === "selTournament" && (
                <div className="mt-4">
                    <h5 className="text-lg font-bold mb-4">Tournament Size</h5>
                    <input
                        type="number"
                        value={tempTourSize}
                        className="border border-gray-300 p-2 rounded-lg min-w-full sm:min-w-2/3"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Please enter a valid number.");
                                return;
                            }
                            if (e.target.value < 0) {
                                alert("Please enter a positive number.");
                                return;
                            }
                            setTempTourSize(e.target.value);
                            if (e.target.value > 0) {
                                setCurrentStep(
                                    currentStep < nextStep
                                        ? nextStep
                                        : currentStep,
                                );
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
