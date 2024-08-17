import { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import { BillItemKey, useBillStore } from "../stores/BillStore";
import { FriendListContext } from "../contexts/FriendListContext";
import FriendList from "../components/FriendList";
import BillItem from "../components/BillItem";
import BillFriendList from "../components/BillFriendList";

const EditBill = () => {
  const { items, addItem, name, setName } = useBillStore();
  const [selectedBill, setSelectedBill] = useState<BillItemKey>("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selectedBill !== "") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [selectedBill]);

  return (
    <FriendListContext.Provider value={{ selectedBill, setSelectedBill }}>
      <div>
        <Input
          className="text-center"
          placeholder="New Bill"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
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
      <dialog
        className="w-3/4 backdrop:bg-slate-900/80 "
        ref={dialogRef}
        onClose={() => setSelectedBill("")}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedBill("");
          }
        }}
      >
        <FriendList />
      </dialog>
    </FriendListContext.Provider>
  );
};

export default EditBill;
