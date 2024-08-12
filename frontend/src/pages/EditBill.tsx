import Input from "../components/Input";
import { BILL_KEYS, type BillItem, useBillStore } from "../stores/BillStore";

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

const EditBill = () => {
  const { items, addItem } = useBillStore();

  return (
    <>
      <Input className="text-center" placeholder="Bill name" />
      <div className="flex flex-col mt-4 gap-4">
        {Array.from(items).map(([key, item]) => (
          <BillItem key={key} itemKey={key} item={item} />
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
    </>
  );
};

export default EditBill;
