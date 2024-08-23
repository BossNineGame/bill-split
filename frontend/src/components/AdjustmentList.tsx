import { createContext, useCallback, useContext, useState } from "react";
import Input from "./Input";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";
import { useAdjustmentStore } from "../stores/AdjustmentStore";
import FluentBranchRequest20Regular from "~icons/fluent/branch-request-20-regular";
import { twMerge } from "tailwind-merge";

const AdjustmentTreeContext = createContext<{
  newChildKey: string | undefined;
  setNewChildKey: (key?: string) => void;
}>({
  newChildKey: undefined,
  setNewChildKey: () => {},
});

const AdjustmentTree = ({ adjustmentKey }: { adjustmentKey?: string }) => {
  const { adjustments, removeAdjustment, setAdjustmentParent, adjustmentTree } =
    useAdjustmentStore();

  const isAncestorOf = useCallback(
    (ancestorKey: string, childKey: string | undefined) => {
      let currentKey: string | undefined = childKey;
      while (currentKey) {
        if (currentKey === ancestorKey) return true;
        currentKey = adjustmentTree.get(currentKey);
      }
      return false;
    },
    [adjustmentTree]
  );

  const adjustment = adjustmentKey ? adjustments.get(adjustmentKey) : undefined;
  const { newChildKey, setNewChildKey } = useContext(AdjustmentTreeContext);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-flow-col auto-cols-[auto_min-content] gap-1 h-8 ">
        <button
          className={twMerge(
            "w-full justify-self-center leading-none rounded-md items-center text-sm border border-slate-500",
            newChildKey && newChildKey !== adjustmentKey
              ? "bg-slate-600"
              : "bg-slate-700"
          )}
          onClick={() => {
            if (newChildKey) {
              if (adjustmentKey && isAncestorOf(newChildKey, adjustmentKey)) {
                setAdjustmentParent(
                  adjustmentKey,
                  adjustmentTree.get(newChildKey)
                );
              }
              setAdjustmentParent(newChildKey, adjustmentKey);
              setNewChildKey(undefined);
            }
          }}
        >
          {adjustment
            ? `${adjustment.name} ${adjustment.percentage}%`
            : "Item Price"}
        </button>
        {adjustmentKey && (
          <div className="flex flex-row gap-0.5 text-sm">
            <button onClick={() => removeAdjustment(adjustmentKey)}>
              <FluentDismiss12Regular />
            </button>
            <button onClick={() => setNewChildKey(adjustmentKey)}>
              <FluentBranchRequest20Regular />
            </button>
          </div>
        )}
      </div>
      <div className="mx-2 justify-center">
        <div className="grid grid-flow-col auto-cols-fr gap-2">
          {Array.from(adjustments.keys()).map((childKey) => {
            const parent = adjustmentTree.get(childKey);
            return parent === adjustmentKey ? (
              <AdjustmentTree adjustmentKey={childKey} />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

const AdjustmentList = () => {
  const { addAdjustment } = useAdjustmentStore();
  const [newAdjustment, setNewAdjustment] = useState<{
    name: string;
    percentage: string;
  }>({
    name: "",
    percentage: "",
  });
  const [newChildKey, setNewChildKey] = useState<string | undefined>(undefined);

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
      <AdjustmentTreeContext.Provider value={{ newChildKey, setNewChildKey }}>
        <AdjustmentTree adjustmentKey={undefined} />
      </AdjustmentTreeContext.Provider>
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
