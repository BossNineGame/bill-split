import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BillState {
  name: string;
  items: BillItem[];
}

interface BillAction {
  setItems: (items: BillItem[]) => void;
  addItem: (item: BillItem) => void;
  removeItem: (item: BillItem) => void;
}

export const mockBillStore: BillState = {
  name: "Test Bill",
  items: [
    { id: crypto.randomUUID(), name: "Item 1", price: 10, quantity: 1 },
    { id: crypto.randomUUID(), name: "Item 2", price: 20, quantity: 2 },
    { id: crypto.randomUUID(), name: "Item 3", price: 30, quantity: 3 },
  ],
};

export const useBillStore = create<BillState & BillAction>()(
  persist(
    (set) => ({
      ...mockBillStore,
      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (item) =>
        set((state) => ({ items: [...state.items.filter((i) => i !== item)] })),
    }),
    { name: "bill-store" }
  )
);
