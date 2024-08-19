import { useAdjustmentStore } from "../stores/AdjustmentStore";
import { twMerge } from "tailwind-merge";
// import FluentPeople24Regular from "~icons/fluent/people-24-regular";

const BillAdjustmentList: React.FC<{ itemKey: string }> = ({ itemKey }) => {
  const {
    adjustments,
    billToAdjustments,
    removeBillFromAdjustment,
    mapBillToAdjustment,
  } = useAdjustmentStore();

  return (
    <div className="flex flex-row flex-wrap gap-1 rounded-md items-center text-sm">
      {/* <FluentPeople24Regular className="text-slate-300 mr-1" /> */}

      {Array.from(adjustments).map(([adjustmentKey, adjustment]) => (
        <button
          key={adjustmentKey}
          className={twMerge(
            "border border-slate-700 text-slate-600 rounded-md px-2",
            billToAdjustments.get(itemKey)?.has(adjustmentKey)
              ? "border-slate-400 text-slate-300 bg-slate-800"
              : ""
          )}
          onClick={() => {
            if (billToAdjustments.get(itemKey)?.has(adjustmentKey)) {
              removeBillFromAdjustment(itemKey, adjustmentKey);
            } else {
              mapBillToAdjustment(itemKey, adjustmentKey);
            }
          }}
        >
          {`${adjustment.name} ${adjustment.percentage}%`}
        </button>
      ))}
    </div>
  );
};

export default BillAdjustmentList;
