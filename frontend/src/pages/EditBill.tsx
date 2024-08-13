import { createContext, useContext, useState } from "react";
import Input from "../components/Input";
import { useBillFriendStore } from "../stores/BillFriendStore";
import {
  BILL_KEYS,
  type BillItem,
  BillItemKey,
  useBillStore,
} from "../stores/BillStore";

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
      className={`mx-4 p-2 rounded-lg ${
        showFriend === itemKey ? "border border-slate-300" : ""
      }`}
    >
      <div className="px-3 py-1 rounded-md">
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
  return (
    <div>
      <button onClick={() => setShowFriend("")}> x </button>
      FriendList
    </div>
  );
};

const EditBill = () => {
  const { items, addItem } = useBillStore();
  const [showFriend, setShowFriend] = useState<BillItemKey>("");

  return (
    <FriendListContext.Provider value={{ showFriend, setShowFriend }}>
      <div className={`grid ${showFriend ? "md:grid-cols-2" : "grid-cols-1"}`}>
        <div>
          <Input className="text-center" placeholder="Bill name" />
          <div className="flex flex-col mt-4 gap-6">
            {Array.from(items).map(([key, item]) => (
              <div className="grid grid-rows-2 gap-3">
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
