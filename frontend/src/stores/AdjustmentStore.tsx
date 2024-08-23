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
  adjustmentTree: Map<AdjustmentKey, AdjustmentKey>;
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
  setAdjustmentParent: (
    childKey: AdjustmentKey,
    parentKey?: AdjustmentKey
  ) => void;
}

export const useAdjustmentStore = create<AdjustmentState & AdjustmentAction>()(
  persist(
    (set) => ({
      adjustments: new Map(),
      adjustmentToBills: new Map(),
      billToAdjustments: new Map(),
      adjustmentTree: new Map(),
      setAdjustment: (key, adjustment) =>
        set((state) => ({
          adjustments: new Map(state.adjustments.set(key, adjustment)),
        })),
      addAdjustment: (adjustment) =>
        set((state) => {
          const newKey = crypto.randomUUID();
          const allBills = Array.from(useBillStore.getState().items.keys());
          allBills.forEach((billKey) =>
            state.mapBillToAdjustment(billKey, newKey)
          );
          return {
            adjustments: new Map(state.adjustments).set(newKey, adjustment),
          };
        }),
      removeAdjustment: (key) =>
        set((state) => {
          const newAdjustments = new Map(state.adjustments);
          newAdjustments.delete(key);
          const allBills = Array.from(useBillStore.getState().items.keys());
          allBills.forEach((billKey) => {
            state.removeBillFromAdjustment(billKey, key);
          });
          const newAdjustmentTree = new Map(state.adjustmentTree);
          newAdjustmentTree.forEach((parentKey, childKey) => {
            if (parentKey === key) {
              newAdjustmentTree.delete(childKey);
            }
          });
          newAdjustmentTree.delete(key);

          return {
            adjustments: newAdjustments,
            adjustmentTree: newAdjustmentTree,
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
      setAdjustmentParent: (childKey, parentKey) =>
        set((state) => {
          const newAdjustmentTree = new Map(state.adjustmentTree);
          if (parentKey === undefined) newAdjustmentTree.delete(childKey);
          else newAdjustmentTree.set(childKey, parentKey);
          return {
            adjustmentTree: newAdjustmentTree,
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
                adjustmentTree: new Map(),
              },
            };
          const state = JSON.parse(str).state as {
            adjustments: [AdjustmentKey, Adjustment][];
            billToAdjustments: [BillItemKey, AdjustmentKey[]][];
            adjustmentToBills: [AdjustmentKey, BillItemKey[]][];
            adjustmentTree: [AdjustmentKey, AdjustmentKey][];
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
              adjustmentTree: new Map(state.adjustmentTree),
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
              adjustmentTree: Array.from(
                newValue.state.adjustmentTree.entries()
              ),
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

  // Map new bills to all adjustments by default
  const addedBills = Array.from(state.items.keys()).filter(
    (key) => prev.items.get(key) === undefined
  );
  addedBills.forEach((billKey) => {
    const allAdjustments = Array.from(
      useAdjustmentStore.getState().adjustments.keys()
    );
    allAdjustments.forEach((adjustmentKey) =>
      useAdjustmentStore.getState().mapBillToAdjustment(billKey, adjustmentKey)
    );
  });
});
