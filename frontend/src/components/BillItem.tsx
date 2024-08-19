import { BILL_KEYS, type BillItem, useBillStore } from "../stores/BillStore";
import Input from "./Input";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";

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
    <div className="grid grid-flow-col auto-cols-[auto_4em_3em] gap-2 md:gap-4 items-center">
      <div className="gap-2 flex flex-row">
        <div className="flex flex-row items-center flex-grow px-2 py-1 bg-slate-700 rounded-md">
          <Input
            key={`${itemKey}_name`}
            className="p-0"
            name={BILL_KEYS.name}
            placeholder="Item Name"
            value={item.name}
            onChange={handleItemChange}
          />
          <button onClick={() => removeItem(itemKey)}>
            <FluentDismiss12Regular className="text-sm text-center text-slate-300" />
          </button>
        </div>
      </div>
      <Input
        key={`${itemKey}_price`}
        name={BILL_KEYS.price}
        type="number"
        className="py-0 px-1"
        placeholder="0"
        value={item.price.toString()}
        onChange={handleItemChange}
      />
      <div className="flex gap-1">
        <span className="text-slate-700"> x </span>
        <Input
          key={`${itemKey}_quantity`}
          name={BILL_KEYS.quantity}
          type="number"
          className="p-0"
          placeholder="1"
          value={item.quantity.toString()}
          onChange={handleItemChange}
        />
      </div>
    </div>
  );
};

export default BillItem;
