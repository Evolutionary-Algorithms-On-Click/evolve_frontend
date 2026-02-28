"use client";

import { useState, useEffect } from "react";
import Loader from "@/app/_components/Loader";
import { LogOut } from "lucide-react";
import Link from "next/link";

import ChooseAlgorithmType from "./sbo_components/chooseAlgorithmType";

// STANDARD BO COMPONENTS
import ChooseObjective from "./sbo_components/chooseObjective";
import UploadCustomFunction from "./sbo_components/uploadCustomFunction";
import ChooseDirection from "./sbo_components/chooseDirection";
import ChooseSurrogate from "./sbo_components/chooseSurrogate";
import ChooseAcquisition from "./sbo_components/chooseAcquisition";
import ConfigureKernel from "./sbo_components/configureKernel";
import ConfigureBounds from "./sbo_components/configureBounds";
import ConfigureInitialDesign from "./sbo_components/configureInitialDesign";
import ConfigureBOParams from "./sbo_components/configureBOParams";

// MOBO COMPONENTS
import ChooseMOProblem from "./mobo_components/chooseMOProblem";
import UploadCustomMOFunction from "./mobo_components/uploadCustomMOFunction";
import ChooseMOAcquisition from "./mobo_components/chooseMOAcquisition";
import ConfigureMOBounds from "./mobo_components/configureMOBounds";
import ConfigureMOInitialDesign from "./mobo_components/configureMOInitialDesign";
import ConfigureMCSampler from "./mobo_components/configureMCSampler";
import ConfigureReferencePoint from "./mobo_components/configureReferencePoint";
import ConfigureMOBOParams from "./mobo_components/configureMOBOParams";
import ConfigureMOModel from "./mobo_components/configureMOModel";

// PREVIEW COMPONENTS
import PreviewBO from "@/app/_components/bo/preview";
import PreviewMOBO from "@/app/_components/bo/previewMOBO";

export default function BOPage() {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      window.location.href = "/auth";
      return;
    } else {
      setUserData({
        email: localStorage.getItem("email"),
        userName: localStorage.getItem("userName"),
        fullName: localStorage.getItem("fullName"),
        id: localStorage.getItem("id"),
      });
    }
  }, []);

  const [step, setStep] = useState(1);
  const [algorithmType, setAlgorithmType] = useState("");

  // ==================== STANDARD BO STATES ====================
  const [dimensions, setDimensions] = useState(1);
  const [objective, setObjective] = useState("");
  const [customFunction, setCustomFunction] = useState(null);
  const [direction, setDirection] = useState("");
  const [surrogate, setSurrogate] = useState("");
  const [acquisition, setAcquisition] = useState("");
  const [kernel, setKernel] = useState("");
  const [bounds, setBounds] = useState([]);
  const [design, setDesign] = useState({
    strategy: "",
    lhs_type: "",
    criterion: "",
  });
  const [params, setParams] = useState({
    initialPoints: 5,
    iterations: 20,
    verbose: true,
    xi: 0.01,
    kappa: 2.576,
    randomSeed: 42,
  });

  // ==================== MOBO STATES ====================
  const [moProblem, setMoProblem] = useState("");
  const [problemConfig, setProblemConfig] = useState(null);
  const [customMOFunction, setCustomMOFunction] = useState(null);
  const [moModelConfig, setMoModelConfig] = useState({
    architecture: "independent",
    modelType: "single_task",
    noiseLevel: null,
  }); // NEW STATE
  const [moAcquisition, setMoAcquisition] = useState("");
  const [moBounds, setMoBounds] = useState([]);
  const [moDimensions, setMoDimensions] = useState(2);
  const [moDesign, setMoDesign] = useState({
    strategy: "",
    scramble: true,
    optimization: null,
  });
  const [mcSampler, setMcSampler] = useState({
    type: "sobol_qmc",
    samples: 128,
  });
  const [refPoint, setRefPoint] = useState({
    useHeuristic: true,
    values: null,
  });
  const [moParams, setMoParams] = useState({
    initialPoints: 10,
    iterations: 20,
    batchSize: 1,
    restarts: 10,
    rawSamples: 512,
    beta: 0.2,
    randomSeed: 42,
    verbose: true,
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // ==================== SUBMIT FUNCTIONS ====================
  const submitStandardBO = async () => {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:5002";

    const payload = {
      algorithm_type: algorithmType,
      direction,
      objective,
      custom_function: objective === "custom" ? customFunction : null,
      surrogate,
      acquisition,
      kernel: surrogate === "gp" ? kernel : null,
      bounds,
      initial_design: {
        strategy: design.strategy,
        lhs_type: design.lhs_type || null,
        criterion: design.criterion || null,
        randomSeed: params.randomSeed,
      },
      params: {
        initialPoints: params.initialPoints,
        iterations: params.iterations,
        verbose: params.verbose,
        ...(["ei", "pi"].includes(acquisition) && { xi: params.xi }),
        ...(acquisition === "lcb" && { kappa: params.kappa }),
        randomSeed: params.randomSeed,
      },
    };

    const response = await fetch(`${backend}/api/bo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        window.location.href = `/bin/bo/${data.data.runID}`;
        break;
      default:
        alert("Error running Bayesian Optimization.");
    }
  };

  const submitMOBO = async () => {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:5002";

    const payload = {
      algorithm_type: "mobo",
      problem: moProblem,
      problem_config: problemConfig,
      custom_function: moProblem === "custom" ? customMOFunction : null,
      model_config: moModelConfig, // NEW FIELD
      acquisition: moAcquisition,
      bounds: moBounds,
      initial_design: moDesign,
      mc_sampler: mcSampler,
      ref_point: refPoint,
      params: moParams,
    };

    const response = await fetch(`${backend}/api/mobo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        window.location.href = `/bin/mobo/${data.data.runID}`;
        break;
      default:
        alert("Error running Multi-Objective Bayesian Optimization.");
    }
  };

  // Reset dimensions when problem changes (for configurable problems)
  useEffect(() => {
    if (algorithmType === "mobo" && moProblem && problemConfig) {
      // Only reset if dimensions are configurable
      if (problemConfig.dim === "configurable") {
        setMoDimensions(null); // Reset to null so preview shows "configurable"
        setMoBounds([]); // Clear bounds too
      }
    }
  }, [moProblem, algorithmType]);
  // ==================== STEP RENDERING ====================
  const renderStep = () => {
    // Step 1: Algorithm Type Selection
    if (step === 1) {
      return (
        <ChooseAlgorithmType
          algorithmType={algorithmType}
          setAlgorithmType={setAlgorithmType}
          nextStep={next}
        />
      );
    }

    // ==================== STANDARD BO FLOW ====================
    if (algorithmType === "standard_bo") {
      switch (step) {
        case 2:
          return (
            <ChooseObjective
              objective={objective}
              setObjective={setObjective}
              setDirection={setDirection}
              nextStep={() => {
                if (objective === "custom") {
                  setStep(3);
                } else {
                  setStep(4);
                }
              }}
              prevStep={prev}
            />
          );

        case 3:
          if (objective === "custom") {
            return (
              <UploadCustomFunction
                customFunction={customFunction}
                setCustomFunction={setCustomFunction}
                nextStep={next}
                prevStep={prev}
              />
            );
          }
          return null;

        case 4:
          return (
            <ChooseDirection
              direction={direction}
              setDirection={setDirection}
              objective={objective}
              nextStep={next}
              prevStep={() => {
                if (objective === "custom") {
                  setStep(3);
                } else {
                  setStep(2);
                }
              }}
            />
          );

        case 5:
          return (
            <ChooseSurrogate
              surrogate={surrogate}
              setSurrogate={setSurrogate}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 6:
          return (
            <ChooseAcquisition
              acquisition={acquisition}
              setAcquisition={setAcquisition}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 7:
          return (
            <ConfigureKernel
              kernel={kernel}
              setKernel={setKernel}
              surrogate={surrogate}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 8:
          return (
            <ConfigureBounds
              dimensions={dimensions}
              setDimensions={setDimensions}
              bounds={bounds}
              setBounds={setBounds}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 9:
          return (
            <ConfigureInitialDesign
              design={design}
              setDesign={setDesign}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 10:
          return (
            <ConfigureBOParams
              params={params}
              setParams={setParams}
              acquisition={acquisition}
              submit={submitStandardBO}
              prevStep={prev}
            />
          );
      }
    }

    // ==================== MOBO FLOW ====================
    if (algorithmType === "mobo") {
      switch (step) {
        case 2:
          return (
            <ChooseMOProblem
              problem={moProblem}
              setProblem={setMoProblem}
              setProblemConfig={setProblemConfig}
              nextStep={() => {
                // If custom, go to step 3 (upload function)
                // Otherwise, skip to step 4 (bounds)
                if (moProblem === "custom") {
                  setStep(3);
                } else {
                  setStep(4);
                }
              }}
              prevStep={prev}
            />
          );

        case 3:
          // Only render if custom problem selected
          if (moProblem === "custom") {
            return (
              <UploadCustomMOFunction
                customFunction={customMOFunction}
                setCustomFunction={setCustomMOFunction}
                nextStep={next}
                prevStep={prev}
              />
            );
          }
          // If not custom, this step shouldn't be reached
          return null;

        case 4:
          return (
            <ConfigureMOBounds
              dimensions={moDimensions}
              setDimensions={setMoDimensions}
              bounds={moBounds}
              setBounds={setMoBounds}
              problem={moProblem}
              problemConfig={problemConfig}
              setProblemConfig={setProblemConfig}
              customFunctionDim={customMOFunction?.dim}
              customFunctionObjectives={customMOFunction?.numObjectives}
              nextStep={next}
              prevStep={() => {
                // If custom, go back to step 3 (custom function)
                // Otherwise, go back to step 2 (problem selection)
                if (moProblem === "custom") {
                  setStep(3);
                } else {
                  setStep(2);
                }
              }}
            />
          );

        case 5:
          return (
            <ConfigureMOModel
              modelConfig={moModelConfig}
              setModelConfig={setMoModelConfig}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 6:
          return (
            <ChooseMOAcquisition
              acquisition={moAcquisition}
              setAcquisition={setMoAcquisition}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 7:
          return (
            <ConfigureMOInitialDesign
              design={moDesign}
              setDesign={setMoDesign}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 8:
          return (
            <ConfigureMCSampler
              mcSampler={mcSampler}
              setMcSampler={setMcSampler}
              nextStep={next}
              prevStep={prev}
            />
          );

        case 9:
          return (
            <ConfigureReferencePoint
              refPoint={refPoint}
              setRefPoint={setRefPoint}
              numObjectives={
                moProblem === "custom"
                  ? customMOFunction?.numObjectives || 2
                  : problemConfig?.objectives || 2

              }
              nextStep={next}
              prevStep={prev}
            />
          );

        case 10:
          return (
            <ConfigureMOBOParams
              params={moParams}
              setParams={setMoParams}
              acquisition={moAcquisition}
              design={moDesign}
              submit={submitMOBO}
              prevStep={prev}
            />
          );
      }
    }
  };

  // ==================== STEP TITLES ====================
  const getStepTitle = () => {
    if (step === 1) return "Algorithm Type";

    if (algorithmType === "standard_bo") {
      const sboTitles = [
        "",
        "Algorithm Type",
        "Objective",
        "Custom Function Upload",
        "Direction",
        "Surrogate",
        "Acquisition",
        "Kernel",
        "Bounds",
        "Initial Sampling Strategy",
        "BO Hyperparameters",
      ];
      return sboTitles[step];
    }

    if (algorithmType === "mobo") {
      if (moProblem === "custom") {
        const moboCustomTitles = [
          "",
          "Algorithm Type",
          "Problem Selection",
          "Custom Function Upload",
          "Bounds",
          "Model Configuration",
          "Acquisition Function",
          "Initial Sampling",
          "MC Sampler",
          "Reference Point",
          "MOBO Parameters",
        ];
        return moboCustomTitles[step];
      } else {
        const moboBuiltinTitles = [
          "",
          "Algorithm Type",
          "Problem Selection",
          "Bounds",
          "Model Configuration",
          "Acquisition Function",
          "Initial Sampling",
          "MC Sampler",
          "Reference Point",
          "MOBO Parameters",
        ];
        return moboBuiltinTitles[step];
      }
    }

    return "";
  };

  const getTotalSteps = () => {
    if (algorithmType === "standard_bo") {
      return objective === "custom" ? 10 : 9;
    }
    if (algorithmType === "mobo") {
      return moProblem === "custom" ? 10 : 9;
    }
    return 10;
  };

  const getCurrentStepNumber = () => {
    if (algorithmType === "standard_bo" && objective !== "custom" && step > 3) {
      return step - 1;
    }
    if (algorithmType === "mobo" && moProblem !== "custom" && step > 3) {
      return step - 1;
    }
    return step;
  };

  return isLoading ? (
    <Loader type={"full"} message={"Running Algorithm..."} />
  ) : (
    <main className="flex flex-col justify-center items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-mono)] p-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Evolve OnClick</h1>
        <p>Run and Visualize algorithms with just a click.</p>
      </div>

      {userData.fullName && (
        <div className="mt-4 flex flex-row gap-2 bg-gray-900 rounded-full px-4 text-[#6eff39] items-center">
          <div className="py-2">
            <p className="text-xs">
              {userData.fullName} {"</>"} @{userData.userName}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth";
            }}
            className="text-[#ff2e2e] font-semibold border-l border-[#ffffff] pl-3 py-2 flex flex-row justify-center items-center"
          >
            <LogOut className="mx-1" size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-row gap-4">
        <Link
          href="/create"
          className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
        >
          ← Go Back
        </Link>
        <Link
          href="/bin"
          className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-background text-foreground hover:bg-[#000000] hover:text-background text-sm sm:text-base px-4 py-2 mt-8"
        >
          View Previous Runs →
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT PREVIEW PANEL */}
          <div className="order-2 md:order-1">
            <div className="sticky top-6">
              {algorithmType === "standard_bo" ? (
                <PreviewBO
                  currentStep={step}
                  algorithmType={algorithmType}
                  direction={direction}
                  objective={objective}
                  surrogate={surrogate}
                  acquisition={acquisition}
                  kernel={kernel}
                  bounds={bounds}
                  design={design}
                  params={params}
                />
              ) : algorithmType === "mobo" ? (
                <PreviewMOBO
                  currentStep={step}
                  algorithmType={algorithmType}
                  problem={moProblem}
                  problemConfig={problemConfig}
                  customFunction={customMOFunction}
                  dimensions={moDimensions}
                  bounds={moBounds}
                  modelConfig={moModelConfig}
                  acquisition={moAcquisition}
                  design={moDesign}
                  mcSampler={mcSampler}
                  refPoint={refPoint}
                  params={moParams}
                />
              ) : null}
            </div>
          </div>

          {/* RIGHT CONFIG PANEL */}
          <div className="order-1 md:order-2 md:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              {step > 1 && (
                <div className="text-sm text-gray-700 mb-4 font-semibold">
                  Step {getCurrentStepNumber()} of {getTotalSteps()} — {getStepTitle()}
                </div>
              )}

              {renderStep()}

              <div className="flex items-center justify-between mt-6">
                <div />

                <button
                  onClick={() => (window.location.href = "/create")}
                  className="px-5 py-2 rounded-lg border"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}