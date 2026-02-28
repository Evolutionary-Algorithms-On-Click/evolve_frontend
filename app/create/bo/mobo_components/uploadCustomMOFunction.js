"use client";

import { useEffect, useMemo, useState } from "react";

export default function UploadCustomMOFunction({
  customFunction,
  setCustomFunction,
  nextStep,
  prevStep,
}) {
  const [functionName, setFunctionName] = useState(
    customFunction?.name || "custom_mo_function"
  );
  const [description, setDescription] = useState(
    customFunction?.description || ""
  );
  const [dim, setDim] = useState(customFunction?.dim || 2);
  const [isDimLocked, setIsDimLocked] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [numObjectives, setNumObjectives] = useState(
    customFunction?.numObjectives || 2
  );

  const [objectives, setObjectives] = useState(
    customFunction?.objectives && customFunction.objectives.length > 0
      ? customFunction.objectives
      : [
          { label: "Objective 1", formula: "", direction: "maximize" },
          { label: "Objective 2", formula: "", direction: "minimize" },
        ]
  );

  // ==============================
  // Auto-detect dimensions from formulas
  // ==============================
  const detectDimensionsFromFormulas = (objectivesList) => {
    const allFormulas = objectivesList
      .slice(0, numObjectives)
      .map(obj => obj.formula)
      .filter(f => f && f.trim())
      .join(' ');

    if (!allFormulas) {
      return null; // No formulas yet
    }

    // Find all x1, x2, x3, ... references
    const regex = /\bx(\d+)\b/g;
    const indices = new Set();
    let match;

    while ((match = regex.exec(allFormulas)) !== null) {
      const idx = parseInt(match[1], 10);
      if (!isNaN(idx) && idx > 0) {
        indices.add(idx);
      }
    }

    if (indices.size === 0) {
      return null; // No variables found
    }

    // Check for contiguous indices starting from 1
    const sortedIndices = Array.from(indices).sort((a, b) => a - b);
    const minIndex = sortedIndices[0];
    const maxIndex = sortedIndices[sortedIndices.length - 1];

    // Must start from x1
    if (minIndex !== 1) {
      return {
        error: true,
        message: `Variables must start from x1. You're using x${sortedIndices.join(', x')} but missing x1. Please use contiguous variables starting from x1.`,
      };
    }

    // Check for gaps
    for (let i = 1; i <= maxIndex; i++) {
      if (!indices.has(i)) {
        return {
          error: true,
          message: `Non-contiguous variable indices detected. You're using x${sortedIndices.join(', x')} but missing x${i}. Please use contiguous variables starting from x1.`,
        };
      }
    }

    return maxIndex; // The highest index is the dimension count
  };

  // Auto-detect dimensions when formulas change
  useEffect(() => {
    const result = detectDimensionsFromFormulas(objectives);
    
    if (result && typeof result === 'object' && result.error) {
      // Show error but don't lock
      setValidationError(result.message);
      setIsDimLocked(false);
      return;
    }
    
    if (result && typeof result === 'number') {
      // Auto-detected valid dimensions
      setDim(result);
      setIsDimLocked(true);
      setValidationError("");
    } else {
      // No formulas yet, allow manual input
      setIsDimLocked(false);
      setValidationError("");
    }
  }, [objectives, numObjectives]);

  // Ensure objectives array length matches numObjectives
  useEffect(() => {
    setObjectives((prev) => {
      const copy = [...prev];
      if (copy.length < numObjectives) {
        // add blank objectives
        const toAdd = numObjectives - copy.length;
        for (let i = 0; i < toAdd; i++) {
          copy.push({
            label: `Objective ${copy.length + 1}`,
            formula: "",
            direction: "minimize",
          });
        }
      } else if (copy.length > numObjectives) {
        // trim extra
        return copy.slice(0, numObjectives);
      }
      return copy;
    });
  }, [numObjectives]);

  const updateObjectiveField = (index, field, value) => {
    setObjectives((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addObjective = () => {
    setNumObjectives((n) => n + 1);
  };

  const removeObjective = (index) => {
    if (numObjectives <= 1) return;
    setObjectives((prev) => prev.filter((_, i) => i !== index));
    setNumObjectives((n) => Math.max(1, n - 1));
  };

  // ==============================
  // Formula → Python conversion
  // ==============================

  const toPythonExpression = (rawFormula) => {
    let expr = (rawFormula || "").trim();

    if (!expr) return "";

    // Replace ^ with ** for powers
    expr = expr.replace(/\^/g, "**");

    // Map x1, x2, ... → x[0], x[1], ...
    expr = expr.replace(/\bx(\d+)\b/g, (_, dStr) => {
      const idx = parseInt(dStr, 10) - 1;
      if (isNaN(idx) || idx < 0) return _; // fallback, keep original
      return `x[${idx}]`;
    });

    // Wrap known math functions with np.*
    expr = expr.replace(
      /\b(sin|cos|tan|log|sqrt|exp|abs)\s*\(/g,
      (_, fn) => `np.${fn}(`,
    );

    return expr;
  };

  const buildPythonCode = useMemo(() => {
    // Basic guard
    if (!numObjectives || numObjectives <= 0) {
      return "# Please define at least one objective.";
    }

    const lines = [];
    lines.push("import numpy as np");
    lines.push("");
    lines.push(`def ${functionName || "custom_mo_function"}(x):`);
    lines.push('    """');
    lines.push("    Auto-generated multi-objective function from EVOC UI.");
    lines.push("    ");
    lines.push("    Args:");
    lines.push("        x: numpy array of shape (d,) - input parameters");
    lines.push("    ");
    lines.push("    Returns:");
    lines.push("        numpy array of shape (M,) - M objective values");
    lines.push('    """');
    lines.push("");
    lines.push("    x = np.asarray(x)");

    const objectiveVarNames = [];

    objectives.slice(0, numObjectives).forEach((obj, idx) => {
      const varName = `f${idx + 1}`;
      objectiveVarNames.push(varName);

      const pyExpr = toPythonExpression(obj.formula);
      const label = (obj.label || `Objective ${idx + 1}`).trim();
      const dir = obj.direction || "minimize";

      if (!pyExpr) {
        lines.push(
          `    # TODO: Define formula for ${label} (${dir})`,
        );
        lines.push(`    ${varName} = 0.0`);
        return;
      }

      // For minimize, we wrap with negative sign so that all objectives are "maximized"
      if (dir === "minimize") {
        lines.push(
          `    # Objective ${idx + 1}: ${label} (minimize; negated for maximization)`
        );
        lines.push(`    ${varName} = -(${pyExpr})`);
      } else {
        lines.push(
          `    # Objective ${idx + 1}: ${label} (maximize)`
        );
        lines.push(`    ${varName} = ${pyExpr}`);
      }
      lines.push("");
    });

    if (objectiveVarNames.length === 0) {
      lines.push("    return np.array([])");
    } else {
      lines.push(
        `    return np.array([${objectiveVarNames.join(", ")}])`,
      );
    }

    return lines.join("\n");
  }, [functionName, numObjectives, objectives]);

  const handleSave = () => {
    // Check for validation errors first
    if (validationError) {
      alert(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate function name
    if (!functionName || functionName.trim() === "") {
      alert("Function name cannot be empty.");
      return;
    }
    
    // Validate function name is valid Python identifier
    const validPythonName = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!validPythonName.test(functionName)) {
      alert("Function name must be a valid Python identifier (letters, numbers, underscores only, cannot start with a number).");
      return;
    }
    
    // Validate dimensions
    if (dim < 1) {
      alert("Number of input dimensions (D) must be at least 1.");
      return;
    }
    
    if (dim > 50) {
      alert("Number of input dimensions (D) cannot exceed 50.");
      return;
    }
    
    // Validate objectives
    if (numObjectives < 1) {
      alert("You must define at least one objective.");
      return;
    }
    
    if (numObjectives > 10) {
      alert("Number of objectives cannot exceed 10.");
      return;
    }
    
    // Validate all objectives have labels
    const emptyLabels = objectives
      .slice(0, numObjectives)
      .some((obj) => !obj.label.trim());
    if (emptyLabels) {
      alert("All objectives must have labels.");
      return;
    }
    
    // Check for empty formulas
    const missingFormula = objectives
      .slice(0, numObjectives)
      .some((obj) => !obj.formula.trim());
    if (missingFormula) {
      alert("All objectives must have formulas. Please define the mathematical expression for each objective.");
      return;
    }
    
    // Validate variable indices don't exceed dimensions
    const invalidVariables = objectives
      .slice(0, numObjectives)
      .some((obj) => {
        const matches = obj.formula.match(/\bx(\d+)\b/g);
        if (!matches) return false;
        return matches.some((match) => {
          const idx = parseInt(match.substring(1), 10);
          return idx > dim || idx < 1;
        });
      });
    
    if (invalidVariables) {
      alert(`Formula contains invalid variable indices. Variables must be x1 to x${dim} based on your dimension count.`);
      return;
    }
    
    // Validate formulas have basic syntax (no empty parentheses, balanced brackets)
    const syntaxErrors = objectives
      .slice(0, numObjectives)
      .some((obj, idx) => {
        const formula = obj.formula.trim();
        // Check for balanced parentheses
        let parenCount = 0;
        for (const char of formula) {
          if (char === '(') parenCount++;
          if (char === ')') parenCount--;
          if (parenCount < 0) return true; // Closing before opening
        }
        if (parenCount !== 0) {
          alert(`Objective ${idx + 1} has unbalanced parentheses.`);
          return true;
        }
        
        // Check for empty parentheses
        if (formula.includes('()')) {
          alert(`Objective ${idx + 1} contains empty parentheses.`);
          return true;
        }
        
        return false;
      });
    
    if (syntaxErrors) {
      return;
    }
    
    // All validations passed - NOW save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("bo_custom_mo_func_dim", String(dim));
    }
    
    setCustomFunction({
      code: buildPythonCode,
      name: functionName || "custom_mo_function",
      dim,
      numObjectives,
      description: description || "User-defined multi-objective function",
      objectives: objectives.slice(0, numObjectives),
    });

    nextStep();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Design Custom Multi-Objective Function
      </h2>

      <p className="text-gray-600 mb-4">
        Define each objective using simple math expressions. Use{" "}
        <span className="font-mono text-sm">x1</span>,{" "}
        <span className="font-mono text-sm">x2</span>,{" "}
        <span className="font-mono text-sm">x3</span>, ... for input
        variables, and operators like{" "}
        <span className="font-mono text-sm">+</span>,{" "}
        <span className="font-mono text-sm">-</span>,{" "}
        <span className="font-mono text-sm">*</span>,{" "}
        <span className="font-mono text-sm">/</span>,{" "}
        <span className="font-mono text-sm">^</span> (power), and
        functions like{" "}
        <span className="font-mono text-sm">sin(x1)</span>,{" "}
        <span className="font-mono text-sm">cos(x2)</span>,{" "}
        <span className="font-mono text-sm">log(x1)</span>.
      </p>

      {/* Validation Error - Place at TOP for visibility */}
      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 mb-2">Validation Error</h3>
              <p className="text-sm text-red-700 leading-relaxed">{validationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Function Name & Description */}
      <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Function Name
          </label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="custom_mo_function"
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Trade-off between accuracy and energy usage"
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Objectives Builder */}
      <div className="mt-4 mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Define Objectives
        </h3>
        <button
          type="button"
          onClick={addObjective}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          + Add Objective
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {objectives.slice(0, numObjectives).map((obj, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objective {idx + 1} Label
                </label>
                <input
                  type="text"
                  value={obj.label}
                  onChange={(e) =>
                    updateObjectiveField(idx, "label", e.target.value)
                  }
                  placeholder={`Objective ${idx + 1}`}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="mt-2 md:mt-0">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Direction
                </span>
                <div className="inline-flex rounded-lg border border-gray-300 bg-white overflow-hidden text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      updateObjectiveField(idx, "direction", "maximize")
                    }
                    className={
                      "px-3 py-1.5 " +
                      (obj.direction === "maximize"
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100")
                    }
                  >
                    📈 Maximize
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateObjectiveField(idx, "direction", "minimize")
                    }
                    className={
                      "px-3 py-1.5 " +
                      (obj.direction === "minimize"
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100")
                    }
                  >
                    📉 Minimize
                  </button>
                </div>
              </div>

              {numObjectives > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(idx)}
                  className="text-xs text-red-500 hover:text-red-600 mt-2 md:mt-6"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formula
              </label>
              <input
                type="text"
                value={obj.formula}
                onChange={(e) =>
                  updateObjectiveField(idx, "formula", e.target.value)
                }
                placeholder="e.g., x1^2 + x2^2"
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use{" "}
                <span className="font-mono">x1, x2, x3, ...</span> for
                inputs. Examples:{" "}
                <span className="font-mono">x1^2 + x2^2</span>,{" "}
                <span className="font-mono">(x1 - 1)^2 + x2^2</span>,{" "}
                <span className="font-mono">sin(x1) + cos(x2)</span>.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Python Code (always visible) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Auto-Generated Python Code
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          This is the code that will be sent to the backend. You don&apos;t
          need to edit it — it&apos;s generated from your objectives.
        </p>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
          <pre className="whitespace-pre">
            <code>{buildPythonCode}</code>
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!!validationError}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}