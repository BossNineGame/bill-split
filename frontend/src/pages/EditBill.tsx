import { createContext, useContext, useState } from "react";
import Input from "../components/Input";
import { useBillFriendStore } from "../stores/BillFriendStore";
import {
  BILL_KEYS,
  type BillItem,
  BillItemKey,
  useBillStore,
} from "../stores/BillStore";
import { Friend, useFriendStore } from "../stores/FriendStore";

const FriendListContext = createContext<{
  showFriend: BillItemKey;
  setShowFriend: React.Dispatch<React.SetStateAction<BillItemKey>>;
}>({ showFriend: "", setShowFriend: () => {} });

const BillItem: React.FC<{ itemKey: string; item: BillItem }> = ({
  itemKey,
  item,
}) => {
  const { setItem, removeItem } = useBillStore();

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setItem(itemKey, {
      ...item,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  return (
    <div className="grid grid-cols-6 gap-4 items-center justify-between">
      <div className="col-span-3 gap-2 flex flex-row">
        <button onClick={() => removeItem(itemKey)}>x</button>
        <div className="px-3 py-1 flex-grow bg-slate-700 rounded-md">
          <Input
            key={`${itemKey}_name`}
            className="p-0"
            name={BILL_KEYS.name}
            placeholder="Item Name"
            value={item.name}
            onChange={handleItemChange}
          />
        </div>
      </div>
      <Input
        key={`${itemKey}_price`}
        name={BILL_KEYS.price}
        type="number"
        className="p-0 col-span-2"
        placeholder="0"
        value={item.price}
        onChange={handleItemChange}
      />
      <Input
        key={`${itemKey}_quantity`}
        name={BILL_KEYS.quantity}
        type="number"
        className="p-0 col-span-1"
        placeholder="1"
        value={item.quantity}
        onChange={handleItemChange}
      />
    </div>
  );
};

const BillFriendList: React.FC<{ itemKey: string }> = ({ itemKey }) => {
  const { billToFriends } = useBillFriendStore();
  const { showFriend, setShowFriend } = useContext(FriendListContext);

  return (
    <div
      className={`border mx-1 px-2 py-1 rounded-lg ${
        showFriend === itemKey ? "border-slate-300" : "border-transparent"
      }`}
    >
      <div className="py-1 rounded-md">
        {Array.from(billToFriends.get(itemKey) || []).map((friend) => (
          <Input
            key={`${itemKey}_name`}
            className="p-0"
            name={BILL_KEYS.name}
            placeholder="Friend Name"
          />
        ))}
        <button
          className="grid grid-cols-1 pb-1 place-items-center leading-none rounded-full border size-6 border-slate-300"
          onClick={() => setShowFriend(itemKey)}
        >
          <span> + </span>
        </button>
      </div>
    </div>
  );
};

const FriendList: React.FC = () => {
  const { setShowFriend } = useContext(FriendListContext);
  const { friends, addFriend, removeFriend } = useFriendStore();
  const [newFriend, setNewFriend] = useState<Friend>("");

  return (
    <div className="flex flex-col p-8 border border-slate-600">
      <button
        className="ml-auto size-8 content-end self-end"
        onClick={() => setShowFriend("")}
      >
        x
      </button>
      <div className="flex flex-row gap-y-2 gap-x-1.5 flex-wrap flex-shrink justify-start">
        {Array.from(friends).map((friend) => (
          <button
            className="flex flex-row border border-slate-500 hover:bg-slate-800 h-fit px-2 py-1 pb-1.5 rounded-full items-center"
            key={friend}
          >
            <span className="col-span-3">{friend}</span>
            <div className="w-2" />
            <button
              className="size-4 leading-none rounded-full hover:bg-slate-700"
              onClick={() => removeFriend(friend)}
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

const EditBill = () => {
  const { items, addItem } = useBillStore();
  const [showFriend, setShowFriend] = useState<BillItemKey>("");

  return (
    <FriendListContext.Provider value={{ showFriend, setShowFriend }}>
      <div
        className={`grid gap-8 ${
          showFriend ? "md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <div>
          <Input className="text-center" placeholder="Bill name" />
          <div className="flex flex-col mt-4 gap-6">
            {Array.from(items).map(([key, item]) => (
              <div className="grid grid-rows-2 gap-1">
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
