import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { BillItemKey, useBillStore } from "./BillStore";

export type AdjustmentKey = string;

export interface Adjustment {
  name: string;
  percentage: number;
}

interface AdjustmentState {
  adjustments: Map<AdjustmentKey, Adjustment>;
  adjustmentToBills: Map<AdjustmentKey, Set<BillItemKey>>;
  billToAdjustments: Map<BillItemKey, Set<AdjustmentKey>>;
}

interface AdjustmentAction {
  setAdjustment: (key: AdjustmentKey, adjustment: Adjustment) => void;
  addAdjustment: (adjustment: Adjustment) => void;
  removeAdjustment: (key: AdjustmentKey) => void;
  mapBillToAdjustment: (
    billKey: BillItemKey,
    adjustmentKey: AdjustmentKey
  ) => void;
  removeBillFromAdjustment: (
    billKey: BillItemKey,
    adjustmentKey: AdjustmentKey
  ) => void;
}

export const useAdjustmentStore = create<AdjustmentState & AdjustmentAction>()(
  persist(
    (set) => ({
      adjustments: new Map(),
      adjustmentToBills: new Map(),
      billToAdjustments: new Map(),
      setAdjustment: (key, adjustment) =>
        set((state) => ({
          adjustments: new Map(state.adjustments.set(key, adjustment)),
        })),
      addAdjustment: (adjustment) =>
        set((state) => ({
          adjustments: new Map(
            state.adjustments.set(crypto.randomUUID(), adjustment)
          ),
        })),
      removeAdjustment: (key) =>
        set((state) => {
          const newAdjustments = new Map(state.adjustments);
          newAdjustments.delete(key);
          return {
            adjustments: newAdjustments,
          };
        }),
      mapBillToAdjustment: (billKey, adjustmentKey) =>
        set((state) => ({
          adjustmentToBills: new Map(state.adjustmentToBills).set(
            adjustmentKey,
            state.adjustmentToBills.get(adjustmentKey)?.add(billKey) ||
              new Set([billKey])
          ),
          billToAdjustments: new Map(state.billToAdjustments).set(
            billKey,
            state.billToAdjustments.get(billKey)?.add(adjustmentKey) ||
              new Set([adjustmentKey])
          ),
        })),
      removeBillFromAdjustment: (billKey, adjustmentKey) =>
        set((state) => {
          state.adjustmentToBills.get(adjustmentKey)?.delete(billKey);
          state.billToAdjustments.get(billKey)?.delete(adjustmentKey);
          return {
            adjustmentToBills: new Map(state.adjustmentToBills),
            billToAdjustments: new Map(state.billToAdjustments),
          };
        }),
    }),
    {
      name: "adjustment-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str)
            return {
              state: {
                adjustments: new Map(),
                billToAdjustments: new Map(),
                adjustmentToBills: new Map(),
              },
            };
          const state = JSON.parse(str).state as {
            adjustments: [AdjustmentKey, Adjustment][];
            billToAdjustments: [BillItemKey, AdjustmentKey[]][];
            adjustmentToBills: [AdjustmentKey, BillItemKey[]][];
          };
          return {
            state: {
              ...state,
              adjustments: new Map(state.adjustments),
              billToAdjustments: new Map(
                state.billToAdjustments.map(([key, value]) => [
                  key,
                  new Set(value),
                ])
              ),
              adjustmentToBills: new Map(
                state.adjustmentToBills.map(([key, value]) => [
                  key,
                  new Set(value),
                ])
              ),
            },
          };
        },
        setItem: (name, newValue: StorageValue<AdjustmentState>) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              adjustments: Array.from(newValue.state.adjustments.entries()),
              billToAdjustments: Array.from(
                newValue.state.billToAdjustments.entries()
              ).map(([key, value]) => [key, Array.from(value)]),
              adjustmentToBills: Array.from(
                newValue.state.adjustmentToBills.entries()
              ).map(([key, value]) => [key, Array.from(value)]),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

useBillStore.subscribe((state, prev) => {
  const removedBills = Array.from(prev.items.keys()).filter(
    (key) => state.items.get(key) === undefined
  );
  removedBills.forEach((billKey) => {
    const allAdjustments = Array.from(
      useAdjustmentStore.getState().adjustments.keys()
    );
    // can be optimized by using a map of friends to bills
    allAdjustments.forEach((adjustmentKey) =>
      useAdjustmentStore
        .getState()
        .removeBillFromAdjustment(billKey, adjustmentKey)
    );
  });
});

useAdjustmentStore.subscribe((state, prev) => {
  const removedAdjustments = Array.from(prev.adjustments.keys()).filter(
    (key) => state.adjustments.get(key) === undefined
  );
  removedAdjustments.forEach((adjustmentKey) => {
    const allBills = Array.from(useBillStore.getState().items.keys());
    allBills.forEach((billKey) =>
      useAdjustmentStore
        .getState()
        .removeBillFromAdjustment(billKey, adjustmentKey)
    );
  });
});
