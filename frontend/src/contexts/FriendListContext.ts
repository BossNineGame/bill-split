import { createContext } from "react";
import { BillItemKey } from "../stores/BillStore";

export const FriendListContext = createContext<{
  selectedBill: BillItemKey;
  setSelectedBill: React.Dispatch<React.SetStateAction<BillItemKey>>;
}>({ selectedBill: "", setSelectedBill: () => { } });
