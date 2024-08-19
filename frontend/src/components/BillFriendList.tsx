import { useBillFriendStore } from "../stores/BillFriendStore";
import { useFriendStore } from "../stores/FriendStore";
import { twMerge } from "tailwind-merge";
// import FluentPeople24Regular from "~icons/fluent/people-24-regular";

const BillFriendList: React.FC<{ itemKey: string }> = ({ itemKey }) => {
  const { billToFriends, removeFriendFromBill, mapFriendToBill } =
    useBillFriendStore();
  const { friends } = useFriendStore();

  return (
    <div className="flex flex-row flex-wrap gap-1 rounded-md items-center text-sm">
      {/* <FluentPeople24Regular className="text-slate-300 mr-1" /> */}

      {Array.from(friends).map((friend) => (
        <button
          key={friend}
          className={twMerge(
            "border border-slate-700 text-slate-600 rounded-full px-2",
            billToFriends.get(itemKey)?.has(friend)
              ? "border-slate-400 text-slate-300"
              : ""
          )}
          onClick={() => {
            if (billToFriends.get(itemKey)?.has(friend)) {
              removeFriendFromBill(friend, itemKey);
            } else {
              mapFriendToBill(friend, itemKey);
            }
          }}
        >
          {friend}
        </button>
      ))}
    </div>
  );
};

export default BillFriendList;
