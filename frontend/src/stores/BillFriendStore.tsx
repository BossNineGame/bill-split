import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { Friend, useFriendStore } from "./FriendStore";
import { useBillStore } from "./BillStore";

type BillItemKey = string;

interface BillToFriendsState {
  billToFriends: Map<BillItemKey, Set<Friend>>;
  friendToBills: Map<Friend, Set<BillItemKey>>;
}

interface BillToFriendsActions {
  mapFriendToBill: (friend: Friend, bill: BillItemKey) => void;
  removeFriendFromBill: (friend: Friend, bill: BillItemKey) => void;
}

export const useBillFriendStore = create<
  BillToFriendsState & BillToFriendsActions
>()(
  persist(
    (set) => ({
      billToFriends: new Map(),
      friendToBills: new Map(),
      mapFriendToBill: (friend, billKey) =>
        set((state) => ({
          billToFriends: new Map(state.billToFriends).set(
            billKey,
            state.billToFriends.get(billKey)?.add(friend) || new Set([friend])
          ),
          friendToBills: new Map(state.friendToBills).set(
            friend,
            state.friendToBills.get(friend)?.add(billKey) || new Set([billKey])
          ),
        })),
      removeFriendFromBill: (friend, billKey) =>
        set((state) => {
          state.billToFriends.get(billKey)?.delete(friend);
          state.friendToBills.get(friend)?.delete(billKey);
          return {
            billToFriends: new Map(state.billToFriends),
            friendToBills: new Map(state.friendToBills),
          };
        }),
    }),
    {
      name: "bill-friend-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str)
            return {
              state: { billToFriends: new Map(), friendToBills: new Map() },
            };
          const state = JSON.parse(str).state as {
            billToFriends: string[][];
            friendToBills: string[][];
          };

          return {
            state: {
              ...state,
              billToFriends: new Map(
                state.billToFriends.map(([key, value]) => [key, new Set(value)])
              ),
              friendToBills: new Map(
                state.friendToBills.map(([key, value]) => [key, new Set(value)])
              ),
            },
          };
        },
        setItem: (name, newValue: StorageValue<BillToFriendsState>) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              billToFriends: Array.from(
                newValue.state.billToFriends.entries()
              ).map(([billKey, friends]) => [billKey, Array.from(friends)]),
              friendToBills: Array.from(
                newValue.state.friendToBills.entries()
              ).map(([friend, billKeys]) => [friend, Array.from(billKeys)]),
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
    const allFriends = useFriendStore.getState().friends;
    // can be optimized by using a map of friends to bills
    allFriends.forEach((friend) =>
      useBillFriendStore.getState().removeFriendFromBill(friend, billKey)
    );
  });
});

useFriendStore.subscribe((state, prev) => {
  const removedFriends = Array.from(prev.friends).filter(
    (friend) => !state.friends.has(friend)
  );
  removedFriends.forEach((friend) => {
    const allBills = useBillStore.getState().items;
    // can be optimized by using a map of friends to bills
    Array.from(allBills.keys()).forEach((billKey) => {
      useBillFriendStore.getState().removeFriendFromBill(friend, billKey);
    });
  });
});
