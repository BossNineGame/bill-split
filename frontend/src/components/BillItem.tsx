import { BILL_KEYS, type BillItem, useBillStore } from "../stores/BillStore";
import Input from "./Input";

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
        value={item.price.toString()}
        onChange={handleItemChange}
      />
      <Input
        key={`${itemKey}_quantity`}
        name={BILL_KEYS.quantity}
        type="number"
        className="p-0 col-span-1"
        placeholder="1"
        value={item.quantity.toString()}
        onChange={handleItemChange}
      />
    </div>
  );
};

export default BillItem;
