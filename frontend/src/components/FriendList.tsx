import { useState } from "react";
import { Friend, useFriendStore } from "../stores/FriendStore";
import Input from "./Input";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";

const FriendList: React.FC = () => {
  const { friends, addFriend, removeFriend } = useFriendStore();
  const [newFriend, setNewFriend] = useState<Friend>("");

  const handleAddFriend = () => {
    addFriend(newFriend);
    setNewFriend("");
  };

  return (
    <div className=" flex flex-col gap-4 p-6 border border-slate-600 bg-slate-800 text-white">
      <h2 className="ml-2 text-lg"> Edit friends </h2>
      {/* <button
        className="relative -top-4 h-0 self-end"
        onClick={() => setSelectedBill("")}
      >
        x
      </button> */}
      <div className="flex flex-row gap-y-2 gap-x-1.5 flex-wrap flex-shrink justify-start">
        {Array.from(friends).map((friend) => (
          <div
            className="flex flex-row gap-1 border border-slate-500 h-fit px-3 py-2 rounded-full items-center text-sm"
            key={friend}
          >
            <span className="flex-grow leading-none">{friend}</span>
            <button className="flex" onClick={() => removeFriend(friend)}>
              <FluentDismiss12Regular />
            </button>
          </div>
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
              handleAddFriend();
            }
          }}
        />
        <button
          className="border border-slate-400 px-4 rounded-md text-slate-300"
          onClick={() => handleAddFriend()}
        >
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default FriendList;
