export default function ConfigureAlgoParams({
    title=`Step 10: Configure Genetic Algorithm`,
    populationSize,
    setPopulationSize,
    generations,
    setGenerations,
    cxpb,
    setCxpb,
    mutpb,
    setMutpb,
    hof,
    setHof,
}) {
    return (
        <div className="mt-16">
            {/* 
                poputlationSize=5000,
                generations=10,
                cxpb=0.5,
                mutpb=0.2 
            */}
            <h4 className="text-lg font-bold mb-4">
                {title}
            </h4>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h5 className="text-lg font-bold mb-4">Population Size</h5>
                    <input
                        type="number"
                        value={populationSize}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Population size must be a number");
                                return;
                            }
                            if (e.target.value < 0) {
                                alert("Population size cannot be negative");
                                return;
                            }

                            setPopulationSize(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <h5 className="text-lg font-bold mb-4">Generations</h5>
                    <input
                        type="number"
                        value={generations}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Generations must be a number");
                                return;
                            }

                            if (e.target.value < 0) {
                                alert("Generations cannot be negative");
                                return;
                            }

                            setGenerations(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <h5 className="text-lg font-bold mb-4">
                        Crossover Probability
                    </h5>
                    <input
                        type="number"
                        value={cxpb}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Crossover probability must be a number");
                                return;
                            }

                            if (e.target.value < 0 || e.target.value > 1) {
                                alert(
                                    "Crossover probability must be between 0 and 1",
                                );
                                return;
                            }

                            if (e.target.value < 0) {
                                alert(
                                    "Crossover probability cannot be negative",
                                );
                                return;
                            }

                            setCxpb(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <h5 className="text-lg font-bold mb-4">
                        Mutation Probability
                    </h5>
                    <input
                        type="number"
                        value={mutpb}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Mutation probability must be a number");
                                return;
                            }

                            if (e.target.value < 0 || e.target.value > 1) {
                                alert(
                                    "Mutation probability must be between 0 and 1",
                                );
                                return;
                            }

                            if (e.target.value < 0) {
                                alert(
                                    "Mutation probability cannot be negative",
                                );
                                return;
                            }

                            setMutpb(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <h5 className="text-lg font-bold mb-4">
                        Hall of Fame Size
                    </h5>
                    <input
                        type="number"
                        value={hof}
                        className="border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter a number"
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Hall of Fame size must be a number");
                                return;
                            }

                            if (e.target.value < 0) {
                                alert("Hall of Fame size cannot be negative");
                                return;
                            }

                            setHof(e.target.value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
