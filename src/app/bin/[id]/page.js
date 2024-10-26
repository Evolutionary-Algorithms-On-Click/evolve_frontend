"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Execution() {
    const [data, setData] = useState(null)
    const { id } = useParams()

    const router = useRouter();

    useEffect(() => {
        const cacheData = localStorage.getItem(id)
        if (cacheData) {
            setData(JSON.parse(cacheData))
        } else {
            router.replace("/")
        }
    }, [router])

    return (
        <main className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8 bg-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Evolve OnClick
                </h1>
                <p className="text-gray-600">Run and Visualize algorithms with just a click.</p>
            </div>

            <h2 className="text-xl font-bold text-gray-800">Execution ID: {id}</h2>

            <div className="flex flex-wrap mt-16 gap-4">
                {!data ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                <div className="flex flex-col items-start border border-gray-400 rounded-2xl p-4 bg-white shadow-lg">
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800">Hall Of Fame</h3>
                        {data && data.hallOfFame.map((hof, index) => (
                            <div key={hof} className="flex flex-col mt-2">
                                <p className="text-gray-800">Individual: {hof.individual.toString()}</p>
                                <p className="text-gray-800">Fitness: {hof.fitness.toString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800">Plot</h3>
                        <h5 className="text-sm text-gray-600">Fitness Plot</h5>
                        <img src={data && data.plots.fitnessPlot} alt="Fitness Plot" width={800} height={100} className="mt-2 rounded-lg shadow-md" />
                        <h5 className="text-sm text-gray-600 mt-4">Mutation CrossOver Effect Plot</h5>
                        <img src={data && data.plots.mutationCrossoverEffectPlot} alt="Mutation CrossOver Effect Plot" width={800} height={100} className="mt-2 rounded-lg shadow-md" />
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800">Population</h3>
                        <a href={data && data.population} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Download Population</a>
                    </div>

                    {/* table with avg, min, max */}
                    <table className="mt-4 text-center w-full">
                        <thead>
                            <tr>
                                <th className="border-b-2 border-gray-300 p-2">Generation</th>
                                <th className="border-b-2 border-gray-300 p-2">Average</th>
                                <th className="border-b-2 border-gray-300 p-2">Minimum</th>
                                <th className="border-b-2 border-gray-300 p-2">Maximum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.data.generation.map((gen, index) => (
                                <tr key={gen}>
                                    <td className="border-b border-gray-200 p-2">{gen}</td>
                                    <td className="border-b border-gray-200 p-2">{data && data.data.average[index]}</td>
                                    <td className="border-b border-gray-200 p-2">{data && data.data.minimum[index]}</td>
                                    <td className="border-b border-gray-200 p-2">{data && data.data.maximum[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}
            </div>
        </main>
    )
}