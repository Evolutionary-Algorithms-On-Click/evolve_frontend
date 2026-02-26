"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function ConfigureMOModel({
  modelConfig = {
    architecture: "independent",
    modelType: "single_task",
    noiseLevel: null,
  },
  setModelConfig = () => {},
  nextStep = () => {},
  prevStep = () => {},
}) {
  const [showArchitectureInfo, setShowArchitectureInfo] = useState(false);
  const [showModelTypeInfo, setShowModelTypeInfo] = useState(false);
  const [showNoiseInfo, setShowNoiseInfo] = useState(false);

  const handleArchitectureChange = (architecture) => {
    if (architecture === "joint") {
      setModelConfig({
        architecture: "joint",
        modelType: "multi_task",
        noiseLevel: null,
      });
    } else {
      setModelConfig({
        architecture: "independent",
        modelType: "single_task",
        noiseLevel: null,
      });
    }
  };

  const handleModelTypeChange = (modelType) => {
    setModelConfig((prev) => ({
      ...prev,
      modelType,
      noiseLevel: modelType === "single_task_fixed_noise" ? 0.01 : null,
    }));
  };

  const handleNoiseLevelChange = (noiseLevel) => {
    setModelConfig((prev) => ({
      ...prev,
      noiseLevel,
    }));
  };

  const isIndependent = modelConfig.architecture === "independent";
  const isFixedNoise = modelConfig.modelType === "single_task_fixed_noise";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Model Configuration
        </h2>
        <p className="text-gray-600 text-sm">
          Configure how the Gaussian Process models your objectives
        </p>
      </div>

      {/* Architecture Selection */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base font-medium text-gray-700">
            Model Architecture
          </h3>
          <button
            onMouseEnter={() => setShowArchitectureInfo(true)}
            onMouseLeave={() => setShowArchitectureInfo(false)}
            className="relative text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info size={16} />
            {showArchitectureInfo && (
              <div className="absolute left-6 top-0 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                <div className="mb-3">
                  <strong className="text-blue-300">Independent:</strong> Uses separate GPs for each objective (ModelListGP). Flexible but doesn't share information between objectives.
                </div>
                <div>
                  <strong className="text-purple-300">Joint:</strong> Uses a single multi-output GP (MultiTaskGP). Can learn correlations between objectives and share statistical strength.
                </div>
              </div>
            )}
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleArchitectureChange("independent")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
              modelConfig.architecture === "independent"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">Independent</div>
            <div className="text-xs text-gray-500 mt-1">Separate GP per objective</div>
          </button>

          <button
            onClick={() => handleArchitectureChange("joint")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
              modelConfig.architecture === "joint"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">Joint</div>
            <div className="text-xs text-gray-500 mt-1">Multi-output GP</div>
          </button>
        </div>
      </div>

      {/* Model Type Selection (only for Independent) */}
      {isIndependent && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-medium text-gray-700">
              Model Type
            </h3>
            <button
              onMouseEnter={() => setShowModelTypeInfo(true)}
              onMouseLeave={() => setShowModelTypeInfo(false)}
              className="relative text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info size={16} />
              {showModelTypeInfo && (
                <div className="absolute left-6 top-0 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                  <div className="mb-3">
                    <strong className="text-green-300">SingleTaskGP:</strong> Standard GP that automatically learns the noise level from data. Best for most cases.
                  </div>
                  <div>
                    <strong className="text-orange-300">Fixed Noise:</strong> Use when you know the exact measurement noise in your observations. The noise variance is not learned.
                  </div>
                </div>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleModelTypeChange("single_task")}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                modelConfig.modelType === "single_task"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">SingleTaskGP</div>
              <div className="text-xs text-gray-500 mt-1">
                Inferred noise (recommended)
              </div>
            </button>

            <button
              onClick={() => handleModelTypeChange("single_task_fixed_noise")}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                modelConfig.modelType === "single_task_fixed_noise"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">SingleTaskGP (Fixed Noise)</div>
              <div className="text-xs text-gray-500 mt-1">
                Known noise variance
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Noise Level Configuration (only for Fixed Noise) */}
      {isIndependent && isFixedNoise && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-base font-medium text-gray-700">
              Noise Standard Deviation (σ)
            </label>
            <button
              onMouseEnter={() => setShowNoiseInfo(true)}
              onMouseLeave={() => setShowNoiseInfo(false)}
              className="relative text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info size={16} />
              {showNoiseInfo && (
                <div className="absolute left-6 top-0 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                  <p className="mb-2">
                    The standard deviation of observation noise, applied uniformly to all objectives.
                  </p>
                  <p>
                    <strong>Typical range:</strong> 0.001 - 0.1
                  </p>
                  <p className="mt-2 text-orange-300">
                    Variance (σ²) = {((modelConfig.noiseLevel || 0.01) ** 2).toFixed(6)}
                  </p>
                </div>
              )}
            </button>
          </div>
          
          <input
            type="number"
            step="0.001"
            min="0.000001"
            max="1.0"
            value={modelConfig.noiseLevel || 0.01}
            onChange={(e) => handleNoiseLevelChange(Number(e.target.value))}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      )}

      {/* Summary Box */}
      <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Current Configuration
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Architecture:</span>
            <span className="font-medium text-gray-900">
              {modelConfig.architecture === "independent" 
                ? "Independent" 
                : "Joint"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="font-medium text-gray-900">
              {modelConfig.modelType === "single_task" && "SingleTaskGP"}
              {modelConfig.modelType === "single_task_fixed_noise" && "SingleTaskGP (Fixed)"}
              {modelConfig.modelType === "multi_task" && "MultiTaskGP"}
            </span>
          </div>
          {isFixedNoise && (
            <div className="flex justify-between">
              <span>Noise σ:</span>
              <span className="font-medium text-gray-900">
                {modelConfig.noiseLevel || 0.01}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}