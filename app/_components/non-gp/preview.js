export default function Preview({
    algo,
    parameters,
    indGen,
    indSize,
    popFunc,
    mateFunc,
    mutateFunc,
    selectFunc,
    evalFunc,
    tempTourSize,
    populationSize,
    generations,
    cxpb,
    mutpb,
    hofSize,
    crossOverProb = 0.25,
    scalingFactor = 1,
    currentStep,
}) {
    return (
        <div className="flex flex-col items-start p-6 bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Config Summary</h3>
            </div>
            
            <div className="flex flex-col w-full space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
                {currentStep >= 1 && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Algorithm</label>
                        <div className="inline-flex items-center px-3 py-1 bg-white border border-blue-100 rounded-full text-blue-700 text-sm font-semibold shadow-sm">
                            {algo || "Not selected"}
                        </div>
                    </div>
                )}

                {currentStep >= 2 && parameters && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300 delay-75">
                         <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Weights</label>
                        {parameters.length > 0 ? (
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <tbody className="divide-y divide-gray-50">
                                        {parameters.map((param, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-2.5">
                                                    <span className="text-gray-400 text-[10px] font-mono block">DIM_{index + 1}</span>
                                                    <span className="font-bold text-gray-900">{param}.0</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-400 italic font-medium">No weights defined</span>
                        )}
                    </div>
                )}

                {currentStep >= 3 && indGen && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Individual Gen</label>
                        <div className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-gray-800 text-sm font-medium shadow-sm">
                            {indGen}
                        </div>
                    </div>
                )}

                {currentStep >= 4 && indSize > 0 && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Individual Size</label>
                        <div className="inline-flex items-center px-4 py-1.5 bg-blue-600 rounded-lg text-white text-sm font-bold shadow-md">
                            {indSize}
                        </div>
                    </div>
                )}

                {currentStep >= 5 && popFunc && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Population Func</label>
                        <div className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-gray-800 text-sm font-medium shadow-sm">
                            {popFunc}
                        </div>
                    </div>
                )}

                {currentStep >= 6 && mateFunc && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Mating Func</label>
                        <div className="px-3 py-2 bg-white border border-indigo-50 rounded-xl text-indigo-700 text-sm font-semibold shadow-sm">
                            {mateFunc}
                        </div>
                    </div>
                )}

                {currentStep >= 7 && mutateFunc && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Mutation Func</label>
                        <div className="px-3 py-2 bg-white border border-purple-50 rounded-xl text-purple-700 text-sm font-semibold shadow-sm">
                            {mutateFunc}
                        </div>
                    </div>
                )}

                {currentStep >= 8 && selectFunc && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Selection Func</label>
                        <div className="px-3 py-2 bg-white border border-emerald-50 rounded-xl text-emerald-700 text-sm font-semibold shadow-sm">
                            {selectFunc}
                            {selectFunc === "selTournament" && (
                                <span className="ml-2 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded uppercase">k={tempTourSize}</span>
                            )}
                        </div>
                    </div>
                )}

                {currentStep >= 9 && evalFunc && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Eval Function</label>
                        <div className="px-3 py-2 bg-white border border-amber-50 rounded-xl text-amber-700 text-sm font-semibold shadow-sm break-all">
                            {evalFunc}
                        </div>
                    </div>
                )}

                {currentStep >= 10 && (
                    <div className="pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-500">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Pop Size</label>
                                <span className="font-bold text-gray-900">{populationSize}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Generations</label>
                                <span className="font-bold text-gray-900">{generations}</span>
                            </div>
                        </div>

                        {algo === "de" && (
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <label className="text-[10px] font-bold uppercase text-blue-400 block mb-1.5">DE Parameters</label>
                                <div className="flex gap-3">
                                    <div>
                                        <span className="text-[10px] text-blue-500 mr-1">CR:</span>
                                        <span className="font-bold text-blue-700">{crossOverProb}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-blue-500 mr-1">F:</span>
                                        <span className="font-bold text-blue-700">{scalingFactor}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">CX Prob</label>
                                <span className="font-bold text-gray-700">{cxpb}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Mut Prob</label>
                                <span className="font-bold text-gray-700">{mutpb}</span>
                            </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">HOF Size</label>
                            <span className="font-bold text-gray-900">{hofSize}</span>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
