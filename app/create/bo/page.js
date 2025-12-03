"use client";

import { useState, useEffect } from "react";
import Loader from "@/app/_components/Loader";
import { LogOut } from "lucide-react";
import Link from "next/link";

import ChooseAlgorithmType from "./sbo_components/chooseAlgorithmType";

// STEP COMPONENTS
import ChooseObjective from "./sbo_components/chooseObjective";
import UploadCustomFunction from "./sbo_components/uploadCustomFunction";
import ChooseDirection from "./sbo_components/chooseDirection";
import ChooseSurrogate from "./sbo_components/chooseSurrogate";
import ChooseAcquisition from "./sbo_components/chooseAcquisition";
import ConfigureKernel from "./sbo_components/configureKernel";
import ConfigureBounds from "./sbo_components/configureBounds";
import ConfigureInitialDesign from "./sbo_components/configureInitialDesign";
import ConfigureBOParams from "./sbo_components/configureBOParams";

// Preview card
import PreviewBO from "@/app/_components/bo/preview";

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
  const [dimensions, setDimensions] = useState(1);

  const [algorithmType, setAlgorithmType] = useState("standard_bo");

  // BO STATES
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

  const next = () => setStep((s) => Math.min(10, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // --------------------------
  // SUBMIT TO BACKEND
  // --------------------------
const submit = async () => {
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
      randomSeed: params.randomSeed
    },
    params: {
      initialPoints: params.initialPoints,
      iterations: params.iterations,
      verbose: params.verbose,
      ...( ["ei", "pi"].includes(acquisition) && { xi: params.xi }),
      ...( acquisition === "lcb" && { kappa: params.kappa }),
      randomSeed: params.randomSeed
    }
  };

  const response = await fetch(
    `${backend}/api/bo`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    }
  );

  switch (response.status) {
    case 200:
      const data = await response.json();
      window.location.href = `/bin/bo/${data.data.runID}`;
      break;
    default:
      alert("Error running Bayesian Optimization.");
  }
};


  const stepTitle = [
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ChooseAlgorithmType
            algorithmType={algorithmType}
            setAlgorithmType={setAlgorithmType}
            nextStep={next}
          />
        );

      case 2:
        return (
          <ChooseObjective
            objective={objective}
            setObjective={setObjective}
            setDirection={setDirection}
            nextStep={() => {
              // If custom, go to upload step, else skip to direction
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
        // Custom function upload (only if objective === "custom")
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
              // Go back to upload if custom, else to objective selection
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
            submit={submit}
            prevStep={prev}
          />
        );
    }
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
            </div>
          </div>

          {/* RIGHT CONFIG PANEL */}
          <div className="order-1 md:order-2 md:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="text-sm text-gray-700 mb-4 font-semibold">
                Step {step > 3 && objective !== "custom" ? step - 1 : step} of{" "}
                {objective === "custom" ? "10" : "9"} — {stepTitle[step]}
              </div>

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