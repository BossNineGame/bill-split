import { useState } from "react";
import Input from "../components/Input";
import { BillItemKey, useBillStore } from "../stores/BillStore";
import { FriendListContext } from "../contexts/FriendListContext";
import FriendList from "../components/FriendList";
import BillItem from "../components/BillItem";
import BillFriendList from "../components/BillFriendList";

const EditBill = () => {
  const { items, addItem } = useBillStore();
  const [showFriend, setShowFriend] = useState<BillItemKey>("");

  return (
    <FriendListContext.Provider value={{ showFriend, setShowFriend }}>
      <div className={`grid gap-8 md:grid-cols-3`}>
        <div className="col-span-2">
          <Input className="text-center" placeholder="Bill name" />
          <div className="flex flex-col mt-4 gap-6">
            {Array.from(items).map(([key, item]) => (
              <div key={key} className="grid grid-rows-2 gap-1">
                <BillItem key={key} itemKey={key} item={item} />
                <BillFriendList key={key + "_friends"} itemKey={key} />
              </div>
            ))}
            <button
              className="p-1 border border-slate-400 rounded-md text-slate-300"
              onClick={() =>
                addItem({
                  name: "",
                  price: 0,
                  quantity: 1,
                })
              }
            >
              + Add item
            </button>
          </div>
        </div>
        <FriendList />
      </div>
    </FriendListContext.Provider>
  );
};

export default EditBill;
