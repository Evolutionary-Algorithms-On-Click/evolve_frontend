export default function PreviewBO({
  currentStep,
  algorithmType,
  objective,
  direction,
  surrogate,
  acquisition, 
  kernel,
  bounds,
  design,
  params,
}) {
  return (
    <div className="p-4 rounded-xl bg-white/60 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold mb-3">BO Config Summary</h3>

      <div className="space-y-4">

        {/* Algorithm Type */}
        <div>
          <div className="text-xs text-gray-500">Algorithm Type</div>
          <div className="mt-1 inline-block rounded-full border border-pink-300 px-3 py-1 text-sm">
            {algorithmType || "—"}
          </div>
        </div>

        {/* Objective */}
        <div>
          <div className="text-xs text-gray-500">Objective Function</div>
          <div className="mt-1 inline-block rounded-full border border-blue-300 px-3 py-1 text-sm">
            {objective || "—"}
          </div>
        </div>

        {/* Direction */}
        <div>
          <div className="text-xs text-gray-500">Direction</div>
          <div className="mt-1 inline-block rounded-full border border-red-300 px-3 py-1 text-sm">
            {direction || "—"}
          </div>
        </div>

        {/* Surrogate */}
        <div>
          <div className="text-xs text-gray-500">Surrogate Model</div>
          <div className="mt-1 inline-block rounded-full border border-purple-300 px-3 py-1 text-sm">
            {surrogate || "—"}
          </div>
        </div>

        {/* Acquisition */}
        <div>
          <div className="text-xs text-gray-500">Acquisition Function</div>
          <div className="mt-1 inline-block rounded-full border border-green-300 px-3 py-1 text-sm">
            {acquisition || "—"}
          </div>
        </div>

        {/* Kernel (GP only) */}
        {surrogate === "gp" && (
          <div>
            <div className="text-xs text-gray-500">Kernel</div>
            <div className="mt-1 inline-block rounded-full border border-yellow-300 px-3 py-1 text-sm">
              {kernel || "—"}
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
                    x{i}: [{b.min} , {b.max}]
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

        {/* Initial Sampling Strategy */}
        <div>
          <div className="text-xs text-gray-500">Initial Design</div>

          <div className="mt-1 space-y-1 text-sm">
            <div className="inline-block rounded-full border border-indigo-300 px-3 py-1">
              {design?.strategy || "—"}
            </div>

            {/* LHS extra fields */}
            {design?.strategy === "lhs" && (
              <>
                <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2">
                  LHS Type: {design.lhs_type || "—"}
                </div>
                <div className="inline-block rounded-full border border-indigo-200 px-3 py-1 ml-2">
                  Criterion: {design.criterion || "—"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* BO Parameters */}
        <div>
          <div className="text-xs text-gray-500">BO Hyperparameters</div>

          <div className="mt-1 text-sm flex flex-wrap gap-2">
            <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
              Initial Points: {params.initialPoints}
            </div>

            <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
              Iterations: {params.iterations}
            </div>


            {/* Xi for EI/PI */}
            {["ei", "pi"].includes(acquisition) && params.xi !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
                Xi (ξ): {params.xi}
              </div>
            )}

            {/* Kappa for UCB */}
            {acquisition === "lcb" && params.kappa !== undefined && (
              <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
                Kappa (κ): {params.kappa}
              </div>
            )}

            <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
              Random Seed: {params.randomSeed}
            </div>

            <div className="inline-block rounded-full border border-slate-300 px-3 py-1">
              Verbose: {params.verbose ? "Yes" : "No"}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}