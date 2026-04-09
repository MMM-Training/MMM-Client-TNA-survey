import React from "react";
import { Question } from "../types";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuestionRendererProps {
  key?: string | number;
  question: Question;
  value: any;
  otherValue?: string;
  optionDetails?: Record<string, any>;
  onChange: (value: any) => void;
  onOtherChange?: (value: string) => void;
  onOptionDetailChange?: (option: string, value: any) => void;
  fullResponse?: Record<string, any>;
  error?: string;
}

export function QuestionRenderer({
  question,
  value,
  otherValue,
  optionDetails = {},
  onChange,
  onOtherChange,
  onOptionDetailChange,
  fullResponse = {},
  error,
}: QuestionRendererProps) {
  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
            placeholder="Type your answer here..."
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all min-h-[120px]"
            placeholder="Type your detailed answer here..."
          />
        );

      case "radio":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="space-y-2">
                <label
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                    value === option
                      ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={() => onChange(option)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                      value === option ? "border-brand-teal" : "border-slate-300"
                    }`}
                  >
                    <AnimatePresence>
                      {value === option && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2.5 h-2.5 bg-brand-teal rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="font-medium">{option}</span>
                </label>
                {((option === "Other" && value === "Other") || 
                  (question.optionsWithInputs?.includes(option) && value === option)) && (
                  <div className="px-4 pb-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                      {option === "Other" ? "If other, please specify:" : `Please specify ${option.toLowerCase()}:`}
                    </label>
                    <input
                      type="text"
                      value={option === "Other" ? (otherValue || "") : (optionDetails[option] || "")}
                      onChange={(e) => {
                        if (option === "Other") {
                          onOtherChange?.(e.target.value);
                        } else {
                          onOptionDetailChange?.(option, e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                      placeholder={option === "Other" ? "Please specify..." : `Enter ${option.toLowerCase()} name...`}
                      autoFocus={option === "Other"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "checkbox":
        const currentValues = Array.isArray(value) ? value : [];
        const handleCheckboxChange = (option: string) => {
          let newValues;
          if (currentValues.includes(option)) {
            newValues = currentValues.filter((v: string) => v !== option);
          } else {
            if (question.maxSelections && currentValues.length >= question.maxSelections) {
              return;
            }
            newValues = [...currentValues, option];
          }
          onChange(newValues);
        };

        return (
          <div className={question.variant === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
            {question.options?.map((option) => (
              <div key={option} className="space-y-2">
                <label
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all h-full ${
                    currentValues.includes(option)
                      ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  } ${question.variant === "grid" ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={currentValues.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${
                      currentValues.includes(option)
                        ? "border-brand-teal bg-brand-teal"
                        : "border-slate-300"
                    }`}
                  >
                    <AnimatePresence>
                      {currentValues.includes(option) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="font-medium">{option}</span>
                </label>
                {((option === "Other" && currentValues.includes("Other")) || 
                  (question.optionsWithInputs?.includes(option) && currentValues.includes(option))) && (
                  <div className="px-4 pb-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                      {option === "Other" ? "If other, please specify:" : `Please specify ${option.toLowerCase()}:`}
                    </label>
                    <input
                      type="text"
                      value={option === "Other" ? (otherValue || "") : (optionDetails[option] || "")}
                      onChange={(e) => {
                        if (option === "Other") {
                          onOtherChange?.(e.target.value);
                        } else {
                          onOptionDetailChange?.(option, e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                      placeholder={option === "Other" ? "Please specify..." : `Enter ${option.toLowerCase()} name...`}
                      autoFocus={option === "Other"}
                    />
                  </div>
                )}
                {question.optionsWithCheckboxes?.[option] && currentValues.includes(option) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 mx-2"
                  >
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Select specific {option.toLowerCase()} modules:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {question.optionsWithCheckboxes[option].map((subOption) => {
                        const subValues = Array.isArray(optionDetails[option]) ? optionDetails[option] : [];
                        const isChecked = subValues.includes(subOption);
                        
                        const ratings = (optionDetails[`${option}_ratings`] as Record<string, string>) || {};
                        const currentRating = ratings[subOption];
                        
                        return (
                          <div key={subOption} className="space-y-2">
                            <div 
                              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-2 rounded-lg border transition-all ${
                                isChecked 
                                  ? "border-brand-teal bg-brand-teal/5" 
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <label className="flex items-center cursor-pointer flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    const nextValues = isChecked
                                      ? subValues.filter((v: string) => v !== subOption)
                                      : [...subValues, subOption];
                                    onOptionDetailChange?.(option, nextValues);

                                    if (isChecked) {
                                      const nextRatings = { ...ratings };
                                      delete nextRatings[subOption];
                                      onOptionDetailChange?.(`${option}_ratings`, nextRatings);
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                                  isChecked ? "bg-brand-teal border-brand-teal" : "border-slate-300"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`leading-tight font-medium text-sm ${isChecked ? "text-brand-teal" : "text-slate-700"}`}>
                                  {subOption}
                                </span>
                              </label>

                              {isChecked && question.rateSubOptions && (
                                <motion.div 
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex flex-wrap gap-1"
                                >
                                  {(question.columns || ["NA", "1", "2", "3", "4"]).map((col) => (
                                    <button
                                      key={col}
                                      type="button"
                                      onClick={() => {
                                        onOptionDetailChange?.(`${option}_ratings`, {
                                          ...ratings,
                                          [subOption]: col
                                        });
                                      }}
                                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                        currentRating === col
                                          ? "bg-brand-teal border-brand-teal text-white shadow-sm"
                                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                      }`}
                                    >
                                      {col}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                            {subOption === "Other" && isChecked && (
                              <div className="px-3 pb-2 w-full">
                                <input
                                  type="text"
                                  value={optionDetails[`${option}_other`] || ""}
                                  onChange={(e) => onOptionDetailChange?.(`${option}_other`, e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                                  placeholder="Please specify..."
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
            {question.maxSelections && (
              <p className={`text-xs text-slate-500 mt-2 ${question.variant === "grid" ? "col-span-full" : ""}`}>
                Select up to {question.maxSelections} options.
              </p>
            )}
          </div>
        );

      case "scale":
        const range = Array.from(
          { length: (question.max || 5) - (question.min || 1) + 1 },
          (_, i) => (question.min || 1) + i
        );
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-medium text-slate-500">{question.minLabel}</span>
              <span className="text-sm font-medium text-slate-500">{question.maxLabel}</span>
            </div>
            <div className="flex justify-between gap-2">
              {range.map((num) => (
                <div key={num} className="flex-1 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChange(num)}
                    className={`w-full py-4 rounded-xl border font-bold transition-all ${
                      value === num
                        ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {num}
                  </button>
                  {question.stepLabels?.[num] && (
                    <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-wider ${
                      value === num ? "text-brand-teal" : "text-slate-400"
                    }`}>
                      {question.stepLabels[num]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "grid":
        const gridValue = (value as Record<string, string>) || {};
        let rows = question.rows || [];
        
        if (question.dynamicRowsFrom) {
          const sources = Array.isArray(question.dynamicRowsFrom) 
            ? question.dynamicRowsFrom 
            : [question.dynamicRowsFrom];
          
          const allSelectedRows: string[] = [];
          sources.forEach(sourceId => {
            const selectedRows = fullResponse[sourceId];
            if (Array.isArray(selectedRows)) {
              selectedRows.forEach(row => {
                if (row === "Other") {
                  const otherVal = fullResponse[`${sourceId}_other`];
                  if (otherVal && typeof otherVal === "string" && otherVal.trim() !== "") {
                    allSelectedRows.push(otherVal.trim());
                  }
                } else {
                  allSelectedRows.push(row);
                }
              });
            }
          });
          
          if (allSelectedRows.length > 0) {
            rows = allSelectedRows;
          } else if (sources.length > 0) {
            rows = []; // If sources are defined but nothing selected, clear rows
          }
        }

        if (rows.length === 0 && question.dynamicRowsFrom) {
          return (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
              <p className="text-slate-500 font-medium italic">No tools selected for rating.</p>
              <p className="text-xs text-slate-400">Please go back and select the tools you use.</p>
            </div>
          );
        }

        return (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-slate-50 border-b border-slate-200 sticky left-0 z-10">
                    Task
                  </th>
                  {question.columns?.map((col) => (
                    <th
                      key={col}
                      className="p-4 text-center bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const hasSubOptions = !!(question.rowsWithCheckboxes?.[row] && question.rateSubOptions);
                  const isSelected = !!gridValue[row] && gridValue[row] !== "NA";

                  return (
                    <tr key={row} className="hover:bg-slate-50 transition-colors">
                      <td 
                        className="p-4 border-b border-slate-100 font-medium text-slate-700 sticky left-0 bg-white z-10"
                        colSpan={hasSubOptions ? (1 + (question.columns?.length || 0)) : 1}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {hasSubOptions && (
                              <div 
                                onClick={() => {
                                  onChange({
                                    ...gridValue,
                                    [row]: isSelected ? undefined : "Selected",
                                  });
                                }}
                                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                                  isSelected ? "bg-brand-teal border-brand-teal" : "border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            )}
                            <span>{row}</span>
                          </div>
                          {((row === "Other" && gridValue[row]) || 
                            (question.rowsWithInputs?.includes(row) && gridValue[row])) && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={row === "Other" ? (otherValue || "") : (optionDetails[row] || "")}
                                onChange={(e) => {
                                  if (row === "Other") {
                                    onOtherChange?.(e.target.value);
                                  } else {
                                    onOptionDetailChange?.(row, e.target.value);
                                  }
                                }}
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                                placeholder={row === "Other" ? "Please specify..." : `Enter ${row.toLowerCase()} name...`}
                                autoFocus={row === "Other"}
                              />
                            </div>
                          )}
                          {question.rowsWithCheckboxes?.[row] && isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                          >
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Select specific {row.toLowerCase()} tools used:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {question.rowsWithCheckboxes[row].map((subOption) => {
                                const subValues = Array.isArray(optionDetails[row]) ? optionDetails[row] : [];
                                const isChecked = subValues.includes(subOption);
                                const ratings = (optionDetails[`${row}_ratings`] as Record<string, string>) || {};
                                const currentRating = ratings[subOption];
                                
                                return (
                                  <div key={subOption} className="space-y-2">
                                    <div 
                                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-2 rounded-lg border transition-all ${
                                        isChecked 
                                          ? "border-brand-teal bg-brand-teal/5" 
                                          : "border-slate-200 bg-white hover:border-slate-300"
                                      }`}
                                    >
                                      <label className="flex items-center cursor-pointer flex-1 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => {
                                            const nextValues = isChecked
                                              ? subValues.filter((v: string) => v !== subOption)
                                              : [...subValues, subOption];
                                            onOptionDetailChange?.(row, nextValues);

                                            if (isChecked) {
                                              const nextRatings = { ...ratings };
                                              delete nextRatings[subOption];
                                              onOptionDetailChange?.(`${row}_ratings`, nextRatings);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 flex-shrink-0 ${
                                          isChecked ? "bg-brand-teal border-brand-teal" : "border-slate-300"
                                        }`}>
                                          {isChecked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`truncate font-medium text-sm ${isChecked ? "text-brand-teal" : "text-slate-700"}`}>
                                          {subOption}
                                        </span>
                                      </label>

                                      {isChecked && question.rateSubOptions && (
                                        <motion.div 
                                          initial={{ opacity: 0, x: 10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex flex-wrap gap-1"
                                        >
                                          {(question.columns || ["NA", "1", "2", "3", "4"]).map((col) => (
                                            <button
                                              key={col}
                                              type="button"
                                              onClick={() => {
                                                onOptionDetailChange?.(`${row}_ratings`, {
                                                  ...ratings,
                                                  [subOption]: col
                                                });
                                              }}
                                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                                currentRating === col
                                                  ? "bg-brand-teal border-brand-teal text-white shadow-sm"
                                                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                              }`}
                                            >
                                              {col}
                                            </button>
                                          ))}
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {(Array.isArray(optionDetails[row]) && optionDetails[row].includes("Other")) && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={optionDetails[`${row}_other`] || ""}
                                  onChange={(e) => onOptionDetailChange?.(`${row}_other`, e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                                  placeholder="Please specify other tool..."
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </td>
                    {!hasSubOptions && question.columns?.map((col) => (
                      <td key={col} className="p-4 border-b border-slate-100 text-center">
                        <label className="inline-flex items-center justify-center w-full h-full cursor-pointer">
                          <input
                            type="radio"
                            name={`${question.id}-${row}`}
                            value={col}
                            checked={gridValue[row] === col}
                            onChange={() =>
                              onChange({
                                ...gridValue,
                                [row]: col,
                              })
                            }
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              gridValue[row] === col
                                ? "border-brand-teal bg-brand-teal/5"
                                : "border-slate-300"
                            }`}
                          >
                            <AnimatePresence>
                              {gridValue[row] === col && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-3 h-3 bg-brand-teal rounded-full"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </label>
                      </td>
                    ))}
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-lg font-semibold text-slate-900 mb-1 whitespace-pre-wrap">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {question.description && (
          <p className="text-sm text-slate-500 mb-3 whitespace-pre-wrap">{question.description}</p>
        )}
      </div>
      {renderInput()}
      {error && <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>}
    </div>
  );
}
