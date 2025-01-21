"use client";

import Preview from "@/app/_components/non-gp/preview";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Execution() {
    const [data, setData] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [showCode, setShowCode] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const cacheData = localStorage.getItem(id);
        if (cacheData) {
            const parsedData = JSON.parse(cacheData);
            setData(parsedData);

            // Fetch the code content
            fetch(parsedData.code)
                .then((response) => response.text())
                .then((text) => setCodeContent(text))
                .catch((error) =>
                    console.error("Error fetching code content:", error),
                );
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
                    href="/create/non-gp"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    ← Go Back
                </Link>
                <button
                    className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-4 py-2 mt-8"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowCode(!showCode);
                    }}
                >
                    {showCode ? "Hide Code </>" : "Show Code </ >"}
                </button>
                <Link
                    href="/bin"
                    className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
                >
                    View All Runs →
                </Link>
            </div>

            <div className="flex flex-wrap mt-8 gap-4">
                {!data ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <div className="flex flex-row flex-wrap justify-center items-start gap-4">
                        <Preview
                            algo={data["inputData"]["algorithm"]}
                            parameters={data["inputData"]["weights"]}
                            indGen={data["inputData"]["individual"]}
                            indSize={data["inputData"]["individualSize"]}
                            popFunc={data["inputData"]["populationFunction"]}
                            mateFunc={data["inputData"]["crossoverFunction"]}
                            mutateFunc={data["inputData"]["mutationFunction"]}
                            selectFunc={data["inputData"]["selectionFunction"]}
                            evalFunc={data["inputData"]["evaluationFunction"]}
                            tempTourSize={data["inputData"]["tournamentSize"]}
                            populationSize={data["inputData"]["populationSize"]}
                            generations={data["inputData"]["generations"]}
                            cxpb={data["inputData"]["cxpb"]}
                            mutpb={data["inputData"]["mutpb"]}
                            hofSize={data["inputData"]["hofSize"]}
                            currentStep={10}
                        />
                        <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 bg-white shadow-lg max-w-[80%]">
                            {showCode ? (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Code
                                    </h3>
                                    <pre className="bg-gray-200 p-4 rounded-lg overflow-auto text-sm mt-4">
                                        <code className="overflow-auto text-wrap">
                                            {codeContent}
                                        </code>
                                    </pre>
                                </div>
                            ) : (
                                <>
                                    {/* Best Individual */}
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Best Individual
                                        </h3>
                                        {data && data.hallOfFame.length > 0 && (
                                            <div className="flex flex-col mt-2">
                                                <p className="text-gray-800">
                                                    Individual:{" "}
                                                    {data.hallOfFame[0].individual.toString()}
                                                </p>
                                                <p className="text-gray-800">
                                                    Fitness:{" "}
                                                    {data.hallOfFame[0].fitness.toString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hall Of Fame */}
                                    {data && data.hallOfFame.length > 1 ? (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Hall Of Fame
                                            </h3>
                                            {data.hallOfFame.map(
                                                (hof, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col mt-2"
                                                    >
                                                        <p className="text-gray-800">
                                                            Individual:{" "}
                                                            {hof.individual.toString()}
                                                        </p>
                                                        <p className="text-gray-800">
                                                            Fitness:{" "}
                                                            {hof.fitness.toString()}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : null}

                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Plot
                                        </h3>
                                        <h5 className="text-sm text-gray-600">
                                            Fitness Plot
                                        </h5>
                                        <Image
                                            src={data && data.plots.fitnessPlot}
                                            alt="Fitness Plot"
                                            width={800}
                                            height={100}
                                            className="mt-2 rounded-lg shadow-md"
                                        />
                                        <h5 className="text-sm text-gray-600 mt-4">
                                            Mutation CrossOver Effect Plot
                                        </h5>
                                        <Image
                                            src={
                                                data &&
                                                data.plots
                                                    .mutationCrossoverEffectPlot
                                            }
                                            alt="Mutation CrossOver Effect Plot"
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
                                                    href={
                                                        data && data.population
                                                    }
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

                                    {/* table with avg, min, max */}
                                    <table className="mt-8 text-center w-full">
                                        <thead>
                                            <tr>
                                                <th className="border-b-2 border-gray-300 p-2">
                                                    Generation
                                                </th>
                                                <th className="border-b-2 border-gray-300 p-2">
                                                    Average
                                                </th>
                                                <th className="border-b-2 border-gray-300 p-2">
                                                    Minimum
                                                </th>
                                                <th className="border-b-2 border-gray-300 p-2">
                                                    Maximum
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data &&
                                                data.data.generation.map(
                                                    (gen, index) => (
                                                        <tr key={gen}>
                                                            <td className="border-b border-gray-200 p-2">
                                                                {gen}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-2">
                                                                {data &&
                                                                    data.data
                                                                        .average[
                                                                        index
                                                                    ]}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-2">
                                                                {data &&
                                                                    data.data
                                                                        .minimum[
                                                                        index
                                                                    ]}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-2">
                                                                {data &&
                                                                    data.data
                                                                        .maximum[
                                                                        index
                                                                    ]}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
