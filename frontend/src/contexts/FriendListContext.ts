import { createContext } from "react";
import { BillItemKey } from "../stores/BillStore";

export const FriendListContext = createContext<{
  showFriend: BillItemKey;
  setShowFriend: React.Dispatch<React.SetStateAction<BillItemKey>>;
}>({ showFriend: "", setShowFriend: () => { } });
