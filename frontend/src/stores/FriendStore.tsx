import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

export interface Friend {
  name: string;
}

interface FriendState {
  friends: Set<Friend>;
}

interface FriendActions {
  addFriend: (friend: Friend) => void;
  removeFriend: (friend: Friend) => void;
}

export const useFriendStore = create<FriendState & FriendActions>()(
  persist(
    (set) => ({
      friends: new Set([]),
      addFriend: (friend) =>
        set((state) => ({ friends: state.friends.add(friend) })),
      removeFriend: (friend) =>
        set((state) => ({
          friends: (() => {
            state.friends.delete(friend);
            return new Set(state.friends);
          })(),
        })),
    }),
    {
      name: "friend-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return { state: { friends: new Set([]) } };
          const state = JSON.parse(str).state as FriendState;
          return {
            state: {
              ...state,
              friends: new Set(state.friends),
            },
          };
        },
        setItem: (name, newValue: StorageValue<FriendState>) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              friends: Array.from(newValue.state.friends.keys()),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
