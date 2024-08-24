import { useRef, useState } from "react";
import Input from "../components/Input";
import { BillItemKey, useBillStore } from "../stores/BillStore";
import { FriendListContext } from "../contexts/FriendListContext";
import FriendList from "../components/FriendList";
import BillItem from "../components/BillItem";
import BillFriendList from "../components/BillFriendList";
import FluentPeopleEdit24Regular from "~icons/fluent/people-edit-32-regular";
import FluentDataUsageEdit24Regular from "~icons/fluent/data-usage-edit-24-regular";
import AdjustmentList from "../components/AdjustmentList";
import BillAdjustmentList from "../components/BillAdjustmentList";

const EditBill = () => {
  const { items, addItem, name, setName } = useBillStore();
  const [selectedBill, setSelectedBill] = useState<BillItemKey>("");
  const friendListDialogRef = useRef<HTMLDialogElement>(null);
  const adjustmentListDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <FriendListContext.Provider value={{ selectedBill, setSelectedBill }}>
      <div>
        <div className="grid grid-flow-col auto-cols-[auto_min-content_min-content] gap-2 pl-4 pb-4 items-center">
          <Input
            className="text-center p-1"
            placeholder="New Bill"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button
            className="flex border border-slate-400 rounded-full size-8 items-center justify-center text-sm text-slate-300"
            onClick={() => friendListDialogRef.current?.showModal()}
          >
            <FluentPeopleEdit24Regular className="ml-[2px]" />
          </button>
          <button
            className="flex border border-slate-400 rounded-full size-8 items-center justify-center text-sm text-slate-300"
            onClick={() => adjustmentListDialogRef.current?.showModal()}
          >
            <FluentDataUsageEdit24Regular className="ml-[2px] mt-[1px]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-6">
          {Array.from(items).map(([key, item]) => (
            <div key={key} className="flex flex-col gap-2">
              <BillItem key={key} itemKey={key} item={item} />
              <BillFriendList key={key + "_friends"} itemKey={key} />
              <BillAdjustmentList key={key + "_adjustments"} itemKey={key} />
            </div>
          ))}
          <button
            className="p-1 md:col-span-2 lg:col-span-3 border border-slate-400 rounded-md text-slate-300"
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
        ref={friendListDialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            friendListDialogRef.current?.close();
          }
        }}
      >
        <FriendList />
      </dialog>
      <dialog
        className="w-3/4 backdrop:bg-slate-900/80 "
        ref={adjustmentListDialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            adjustmentListDialogRef.current?.close();
          }
        }}
      >
        <AdjustmentList />
      </dialog>
    </FriendListContext.Provider>
  );
};

export default EditBill;
