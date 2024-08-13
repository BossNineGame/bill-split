import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

export type BillItemKey = string;
export interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

export const BILL_KEYS: Record<keyof BillItem, keyof BillItem> = {
  name: "name",
  price: "price",
  quantity: "quantity",
};

interface BillState {
  name: string;
  items: Map<BillItemKey, BillItem>;
}

interface BillAction {
  setItem: (key: string, item: BillItem) => void;
  addItem: (item: BillItem) => void;
  removeItem: (key: string) => void;
}

export const mockBillState: BillState = {
  name: "Test Bill",
  items: new Map([
    ["0", { name: "Item 1", price: 10, quantity: 1 }],
    ["1", { name: "Item 2", price: 20, quantity: 2 }],
    ["2", { name: "Item 3", price: 30, quantity: 3 }],
  ]),
};

export const useBillStore = create<BillState & BillAction>()(
  persist(
    (set) => ({
      name: "",
      items: new Map(),
      setItem: (id, item) =>
        set((state) => ({ items: new Map(state.items).set(id, item) })),
      addItem: (item) =>
        set((state) => ({
          items: new Map(state.items).set(crypto.randomUUID(), item),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: (() => {
            state.items.delete(id);
            return new Map(state.items);
          })(),
        })),
    }),
    {
      name: "bill-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return { state: mockBillState };
          const state = JSON.parse(str).state as BillState;
          return {
            state: {
              ...state,
              items: new Map(state.items),
            },
          };
        },
        setItem: (name, newValue: StorageValue<BillState>) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              items: Array.from(newValue.state.items.entries()),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
