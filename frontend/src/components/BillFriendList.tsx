import { useContext } from "react";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { FriendListContext } from "../contexts/FriendListContext";
import FluentPersonEdit48Regular from "~icons/fluent/person-edit-48-regular";

const BillFriendList: React.FC<{ itemKey: string }> = ({ itemKey }) => {
  const { billToFriends } = useBillFriendStore();
  const { selectedBill, setSelectedBill } = useContext(FriendListContext);

  return (
    <div
      className={`border-l-4 mx-1 px-2 py-1 ${
        selectedBill === itemKey ? "border-slate-200" : "border-transparent"
      }`}
    >
      <div className="flex flex-row flex-wrap gap-1 rounded-md items-center">
        {Array.from(billToFriends.get(itemKey) || []).map((friend) => (
          <span
            key={friend}
            className="border border-slate-700 text-slate-100 rounded-full px-2"
          >
            {friend}
          </span>
        ))}
        <button
          className="grid grid-cols-1 place-items-center leading-none rounded-full border size-6 border-none"
          onClick={() => setSelectedBill(itemKey)}
        >
          <FluentPersonEdit48Regular className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default BillFriendList;
