import { useContext, useState } from "react";
import { FriendListContext } from "../contexts/FriendListContext";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { Friend, useFriendStore } from "../stores/FriendStore";
import Input from "./Input";
import FluentDelete16Regular from "~icons/fluent/delete-16-regular";
import FluentPersonAdd20Regular from "~icons/fluent/person-add-20-regular";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";

const FriendList: React.FC = () => {
  const { selectedBill } = useContext(FriendListContext);
  const { friends, addFriend, removeFriend } = useFriendStore();
  const [newFriend, setNewFriend] = useState<Friend>("");
  const { friendToBills, mapFriendToBill, removeFriendFromBill } =
    useBillFriendStore();
  const [isRemoveMode, setIsRemoveMode] = useState(false);

  return (
    <div className=" flex flex-col gap-4 p-6 border border-slate-600 bg-slate-800 text-white">
      <h2 className="ml-2 text-lg"> Assign friends </h2>
      {/* <button
        className="relative -top-4 h-0 self-end"
        onClick={() => setSelectedBill("")}
      >
        x
      </button> */}
      <div className="flex flex-row gap-y-2 gap-x-1.5 flex-wrap flex-shrink justify-start">
        {Array.from(friends).map((friend) => (
          <button
            className={`flex flex-row gap-1 border border-slate-500 h-fit px-3 py-1 rounded-full items-center text-sm ${
              isRemoveMode
                ? "border-red-500"
                : friendToBills.get(friend)?.has(selectedBill)
                ? "bg-slate-700"
                : "bg-transparent"
            }`}
            onClick={() => {
              if (isRemoveMode) {
                removeFriend(friend);
                return;
              }
              if (friendToBills.get(friend)?.has(selectedBill)) {
                removeFriendFromBill(friend, selectedBill);
              } else {
                mapFriendToBill(friend, selectedBill);
              }
            }}
            key={friend}
          >
            <span className="flex-grow">{friend}</span>
          </button>
        ))}
      </div>
      <div className="flex-grow" />
      <div className=" grid grid-flow-col gap-2 auto-cols-[auto_min-content_min-content] items-center">
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
          className="border border-slate-400 px-4 rounded-md text-slate-300"
          onClick={() => addFriend(newFriend)}
        >
          <span>Add</span>
        </button>
        <button
          className={`text-slate-300 ${isRemoveMode ? "text-red-500" : ""}`}
          onClick={() => setIsRemoveMode((prev) => !prev)}
        >
          <FluentDelete16Regular className="h-full" />
        </button>
      </div>
    </div>
  );
};

export default FriendList;
