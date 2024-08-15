import { useContext, useState } from "react";
import { FriendListContext } from "../contexts/FriendListContext";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { Friend, useFriendStore } from "../stores/FriendStore";
import Input from "./Input";

const FriendList: React.FC = () => {
  const { showFriend } = useContext(FriendListContext);
  const { friends, addFriend, removeFriend } = useFriendStore();
  const [newFriend, setNewFriend] = useState<Friend>("");
  const { friendToBills, mapFriendToBill, removeFriendFromBill } =
    useBillFriendStore();

  return (
    <div className="flex flex-col p-6 border border-slate-600">
      {/* <button
        className="relative -top-4 h-0 self-end"
        onClick={() => setShowFriend("")}
      >
        x
      </button> */}
      <div className="flex flex-row gap-y-2 gap-x-1.5 flex-wrap flex-shrink justify-start">
        {Array.from(friends).map((friend) => (
          <button
            className={`flex flex-row border border-slate-500  h-fit px-2 py-1 pb-1.5 rounded-full items-center ${
              friendToBills.get(friend)?.has(showFriend)
                ? "bg-slate-700"
                : "bg-transparent"
            }`}
            onClick={() => {
              if (friendToBills.get(friend)?.has(showFriend)) {
                removeFriendFromBill(friend, showFriend);
              } else {
                mapFriendToBill(friend, showFriend);
              }
            }}
            key={friend}
          >
            <span className="col-span-3">{friend}</span>
            <div className="w-2" />
            <button
              className="size-4 leading-none rounded-full hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                removeFriend(friend);
              }}
            >
              x
            </button>
          </button>
        ))}
      </div>
      <div className="flex-grow" />
      <div className=" grid grid-cols-2 gap-2">
        <Input
          className="p-0.5"
          onChange={(e) => setNewFriend(e.target.value)}
          placeholder="friend name"
          value={newFriend}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newFriend !== "") {
              addFriend(newFriend);
              setNewFriend("");
            }
          }}
        />
        <button
          className="border border-slate-400 rounded-md text-slate-300"
          onClick={() => addFriend(newFriend)}
        >
          <span>+ Add friend</span>
        </button>
      </div>
    </div>
  );
};

export default FriendList;
