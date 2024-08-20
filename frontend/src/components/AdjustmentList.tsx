import { useState } from "react";
import Input from "./Input";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";
import { useAdjustmentStore } from "../stores/AdjustmentStore";

const AdjustmentList = () => {
  const { adjustments, addAdjustment, removeAdjustment } = useAdjustmentStore();
  const [newAdjustment, setNewAdjustment] = useState<{
    name: string;
    percentage: string;
  }>({
    name: "",
    percentage: "",
  });
  const handleAddAdjustment = () => {
    if (
      newAdjustment.name === "" ||
      newAdjustment.percentage === "" ||
      Number.isNaN(Number(newAdjustment.percentage))
    )
      return;
    addAdjustment({
      name: newAdjustment.name,
      percentage: Number(newAdjustment.percentage),
    });
    setNewAdjustment({ name: "", percentage: "" });
  };

  return (
    <div className=" flex flex-col gap-4 p-6 border border-slate-600 bg-slate-800 text-white">
      <h2 className="ml-2 text-lg"> Edit Adjustments </h2>
      <div className="flex flex-col gap-y-2 flex-wrap flex-shrink justify-start ">
        {Array.from(adjustments).map(([key, adjustment]) => (
          <div
            className="flex px-3 py-2 rounded-md items-center text-sm border border-slate-500"
            key={key}
          >
            <span className="flex-grow leading-none">{`${adjustment.name} ${adjustment.percentage}%`}</span>
            <button className="flex" onClick={() => removeAdjustment(key)}>
              <FluentDismiss12Regular />
            </button>
          </div>
        ))}
      </div>
      <div className="flex-grow" />
      <div className=" grid grid-flow-col gap-2 auto-cols-[auto_4em_min-content] items-center">
        <Input
          className="p-0.5"
          onChange={(e) =>
            setNewAdjustment((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Adjustment name"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newAdjustment.name !== "") {
              handleAddAdjustment();
            }
          }}
          value={newAdjustment.name}
        />
        <div className="flex flex-row items-center">
          <Input
            key="percentage"
            name="percentage"
            className="p-0.5"
            onChange={(e) => {
              setNewAdjustment((prev) => ({
                ...prev,
                percentage: e.target.value,
              }));
            }}
            placeholder="percentage"
            inputMode="numeric"
            value={newAdjustment.percentage}
          />
          <span className="leading-none">%</span>
        </div>
        <button
          className="border border-slate-400 px-4 rounded-md text-slate-300"
          onClick={() => handleAddAdjustment()}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AdjustmentList;
