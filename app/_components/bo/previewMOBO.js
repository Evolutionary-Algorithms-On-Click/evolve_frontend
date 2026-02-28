export default function PreviewMOBO({
  currentStep,
  algorithmType,
  problem,
  problemConfig,
  customFunction,
  dimensions,
  modelConfig,
  acquisition,
  bounds,
  design,
  mcSampler,
  refPoint,
  params,
}) {
  return (
    <div className="p-4 rounded-xl bg-white/60 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold mb-3">MOBO Config Summary</h3>

      <div className="space-y-4">
        {/* Algorithm Type */}
        <div>
          <div className="text-xs text-gray-500">Algorithm Type</div>
          <div className="mt-1 inline-block rounded-full border border-purple-300 px-3 py-1 text-sm">
            {algorithmType || "—"}
          </div>
        </div>

        {/* Problem */}
        <div>
          <div className="text-xs text-gray-500">Problem</div>
          <div className="mt-1 inline-block rounded-full border border-blue-300 px-3 py-1 text-sm">
            {problem || "—"}
          </div>
          {problemConfig && (
            <div className="mt-1 text-xs text-gray-600">
              {typeof problemConfig.objectives === "number" ? `${problemConfig.objectives} obj` : "M: configurable"}
              {" | "}
              {typeof problemConfig?.dim === "number" 
              ? `${problemConfig.dim}D` 
              : dimensions 
                ? `${dimensions}D` 
                : "D: configurable"} 
            </div>
          )}
        </div>

        

        {/* Custom Function Info */}
        {problem === "custom" && customFunction && (
          <div>
            <div className="text-xs text-gray-500">Custom Function</div>
            <div className="mt-1 text-xs text-gray-600">
              <div>Name: {customFunction.name || "—"}</div>
              <div>Dimensions: {customFunction.dim || "—"}</div>
              <div>Objectives: {customFunction.numObjectives || "—"}</div>
            </div>
          </div>
        )}

         {/* Bounds */}
        <div>
          <div className="text-xs text-gray-500">Bounds</div>
          <div className="mt-1 text-sm">
            {bounds && bounds.length > 0 ? (
              <div className="space-y-1">
                {bounds.map((b, i) => (
                  <div
                    key={i}
                    className="inline-block rounded-full border border-orange-300 px-3 py-1 text-xs mr-2"
                  >
                    x{i + 1}: [{b.min} , {b.max}]
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-block rounded-full border border-orange-300 px-3 py-1 text-sm">
                —
              </div>
            )}
          </div>
        </div>

        {/* Model Configuration */}
        {modelConfig && (
          <div>
            <div className="text-xs text-gray-500">Model Configuration</div>
            <div className="mt-1 space-y-1">
              <div className="inline-block rounded-full border border-cyan-300 px-3 py-1 text-sm">
                {modelConfig.architecture === "independent" ? "🔹 Independent" : "🔗 Joint"}
              </div>
              
              <div className="inline-block rounded-full border border-cyan-200 px-3 py-1 text-xs ml-2">
                {modelConfig.modelType === "single_task" && "SingleTaskGP"}
                {modelConfig.modelType === "single_task_fixed_noise" && "SingleTaskGP (Fixed Noise)"}
                {modelConfig.modelType === "multi_task" && "MultiTaskGP"}
              </div>

              {modelConfig.modelType === "single_task_fixed_noise" && modelConfig.noiseLevel && (
                <div className="inline-block rounded-full border border-orange-200 px-3 py-1 text-xs ml-2">
                  σ: {modelConfig.noiseLevel}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acquisition */}
        <div>
          <div className="text-xs text-gray-500">Acquisition Function</div>
          <div className="mt-1 inline-block rounded-full border border-green-300 px-3 py-1 text-sm">
            {acquisition || "—"}
          </div>
        </div>

       

        {/* Initial Sampling Strategy */}
        <div>
          <div className="text-xs text-gray-500">Initial Design</div>

          <div className="mt-1 space-y-1 text-sm">
            <div className="inline-block rounded-full border border-indigo-300 px-3 py-1">
              {design?.strategy || "—"}
            </div>

            {/* Strategy-specific params */}
            {design?.strategy === "sobol" && (
              <>
                {design.scramble !== undefined && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Scramble: {design.scramble ? "Yes" : "No"}
                  </div>
                )}
                {design.power2 !== undefined && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Power2: {design.power2 ? "Yes" : "No"}
                  </div>
                )}
                {design.optimization && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Opt: {design.optimization}
                  </div>
                )}
              </>
            )}

            {design?.strategy === "lhs" && (
              <>
                {design.scramble !== undefined && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Scramble: {design.scramble ? "Yes" : "No"}
                  </div>
                )}
                {design.strength && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Strength: {design.strength}
                  </div>
                )}
                {design.optimization && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Opt: {design.optimization}
                  </div>
                )}
              </>
            )}

            {design?.strategy === "halton" && (
              <>
                {design.scramble !== undefined && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Scramble: {design.scramble ? "Yes" : "No"}
                  </div>
                )}
                {design.optimization && (
                  <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2 text-xs">
                    Opt: {design.optimization}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* MC Sampler */}
        <div>
          <div className="text-xs text-gray-500">MC Sampler</div>
          <div className="mt-1 space-x-2">
            <div className="inline-block rounded-full border border-purple-300 px-3 py-1 text-sm">
              {mcSampler?.type || "—"}
            </div>
            {mcSampler?.samples && (
              <div className="inline-block rounded-full border border-purple-200 px-3 py-1 text-xs">
                {mcSampler.samples} samples
              </div>
            )}
          </div>
        </div>

        {/* Reference Point */}
        <div>
          <div className="text-xs text-gray-500">Reference Point</div>
          <div className="mt-1">
            {refPoint?.useHeuristic ? (
              <div className="inline-block rounded-full border border-green-300 px-3 py-1 text-sm">
                Automatic Heuristic
              </div>
            ) : refPoint?.values ? (
              <div className="inline-block rounded-full border border-yellow-300 px-3 py-1 text-xs">
                Manual: [{refPoint.values.join(", ")}]
              </div>
            ) : (
              <div className="inline-block rounded-full border border-gray-300 px-3 py-1 text-sm">
                —
              </div>
            )}
          </div>
        </div>

        {/* BO Parameters */}
        <div>
          <div className="text-xs text-gray-500">MOBO Parameters</div>

          <div className="mt-1 text-sm flex flex-wrap gap-2">
            {params?.initialPoints !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Init: {params.initialPoints}
              </div>
            )}

            {params?.iterations !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Iter: {params.iterations}
              </div>
            )}

            {params?.batchSize !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Batch: {params.batchSize}
              </div>
            )}

            {params?.restarts !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Restarts: {params.restarts}
              </div>
            )}

            {params?.rawSamples !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Raw: {params.rawSamples}
              </div>
            )}

            {params?.beta !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                β: {params.beta}
              </div>
            )}

            {params?.randomSeed !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Seed: {params.randomSeed}
              </div>
            )}

            {params?.verbose !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs">
                Verbose: {params.verbose ? "Yes" : "No"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}