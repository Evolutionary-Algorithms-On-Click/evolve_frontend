"use client";

import PreviewGP from "@/app/_components/gp/preview";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GPRunResult() {
    const [data, setData] = useState(null);
    const { id } = useParams();

    const router = useRouter();

    /*
{"algorithm":"eaSimple",
"arity":1,"operators":["add","mul","sub","div"],"argNames":["x"],"individualType":"PrimitiveTree","expr":"genFull","min_":1,"max_":4,"realFunction":"1*x**3 + 1*x**2 + 1*x + 1","individualFunction":"initIterate","populationFunction":"initRepeat","selectionFunction":"selRoulette","tournamentSize":0,"expr_mut":"genFull","expr_mut_min":1,"expr_mut_max":3,"crossoverFunction":"cxOnePoint","terminalProb":0.1,"mutationFunction":"mutUniform","mutationMode":"one","mateHeight":1,"mutHeight":3,"weights":[1],"populationSize":2000,"generations":5,"cxpb":0.5,"mutpb":0.2,"mu":0,"lambda_":0,"hofSize":5,"individualSize":10}
*/

    useEffect(() => {
        const cacheData = localStorage.getItem(id);
        if (cacheData) {
            setData(JSON.parse(cacheData));
        } else {
            router.replace("/");
        }
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Evolve OnClick
                </h1>
                <p className="text-gray-600">
                    Run and Visualize algorithms with just a click.
                </p>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
                Execution ID: {id}
            </h2>

            <div className="flex flex-row items-center gap-4 mt-4">
                <Link
                    href="/create/gp"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#dddddd] hover:text-foreground text-sm sm:text-base px-4 py-2 mt-8"
                >
                    View All Runs →
                </Link>
            </div>

            <div className="flex flex-wrap mt-8 gap-4">
                {!data ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <div className="flex flex-row flex-wrap gap-4">
                        <PreviewGP
                            algo={data["inputData"]["algorithm"]}
                            parameters={data["inputData"]["parameters"]}
                            indGen={data["inputData"]["individualFunction"]}
                            primitiveSet={data["inputData"]["operators"]}
                            treeGenExpression={
                                data["inputData"]["treeGenExpression"]
                            }
                            minHeight={data["inputData"]["min_"]}
                            maxHeight={data["inputData"]["max_"]}
                            popFunc={data["inputData"]["populationFunction"]}
                            selectFunc={data["inputData"]["selectionFunction"]}
                            tempTourSize={data["inputData"]["tournamentSize"]}
                            mutateFunc={data["inputData"]["mutationFunction"]}
                            mode={data["inputData"]["mutationMode"]}
                            mutExpr={data["inputData"]["expr_mut"]}
                            mutMinHeight={data["inputData"]["expr_mut_min"]}
                            mutMaxHeight={data["inputData"]["expr_mut_max"]}
                            matingFunc={data["inputData"]["crossoverFunction"]}
                            terminalProb={data["inputData"]["terminalProb"]}
                            mateHeightLimit={data["inputData"]["mateHeight"]}
                            mutateHeightLimit={data["inputData"]["mutHeight"]}
                            generations={data["inputData"]["generations"]}
                            populationSize={data["inputData"]["populationSize"]}
                            cxpb={data["inputData"]["cxpb"]}
                            mutpb={data["inputData"]["mutpb"]}
                            hofSize={data["inputData"]["hofSize"]}
                            currentStep={13}
                        />
                        <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 bg-white shadow-lg">
                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Best Fitness
                                </h3>
                                <p className="text-gray-800 mt-2">
                                    {data && data.bestFitness}
                                </p>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Tree Plot
                                </h3>
                                <Image
                                    src={data && data.plots.treePlot}
                                    alt="Fitness Plot"
                                    width={800}
                                    height={100}
                                    className="mt-2 rounded-lg shadow-md"
                                />
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Population
                                </h3>
                                <div className="flex flex-row space-x-4 mt-4">
                                    <button className="bg-black flex space-x-0 py-1 px-2 rounded-lg hover:scale-105 transition-all h-fit">
                                        <Link
                                            href={data && data.population}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white"
                                        >
                                            Download
                                        </Link>
                                        <Image
                                            src="/download.svg"
                                            alt="Download"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                    <button className="bg-black flex space-x-1 py-1 px-2 rounded-lg hover:scale-105 transition-all">
                                        <Link
                                            href="/uploadPopulation"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white"
                                        >
                                            Unpickle
                                        </Link>
                                        <Image
                                            src="/unpickle.svg"
                                            alt="Download"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
