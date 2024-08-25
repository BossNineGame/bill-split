import { useState } from "react";
import { BILL_KEYS, type BillItem, useBillStore } from "../stores/BillStore";
import Input from "./Input";
import FluentDismiss12Regular from "~icons/fluent/dismiss-12-regular";

const BillItem: React.FC<{ itemKey: string; item: BillItem }> = ({
  itemKey,
  item,
}) => {
  const { setItem, removeItem } = useBillStore();
  const [newItem, setNewItem] = useState<Record<keyof BillItem, string>>({
    name: item.name,
    price: item.price.toString(),
    quantity: item.quantity.toString(),
  });

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof BillItem
  ) => {
    const { value } = e.target;
    if (type === "name") {
      setNewItem((prev) => ({ ...prev, [type]: value }));
      setItem(itemKey, { ...item, [type]: value });
    } else {
      const parsedValue = value.replace(/[^0-9.-]+/g, "");
      const numericValue = Number(parsedValue);
      setNewItem((prev) => ({ ...prev, [type]: parsedValue }));
      setItem(itemKey, {
        ...item,
        [type]: Number.isNaN(numericValue) ? 0 : numericValue,
      });
    }
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
            value={newItem.name}
            onChange={(e) => handleItemChange(e, BILL_KEYS.name)}
          />
          <button onClick={() => removeItem(itemKey)}>
            <FluentDismiss12Regular className="text-sm text-center text-slate-300" />
          </button>
        </div>
      </div>
      <Input
        key={`${itemKey}_price`}
        name={BILL_KEYS.price}
        inputMode="numeric"
        className="py-0 px-1"
        placeholder="0"
        value={newItem.price}
        onChange={(e) => handleItemChange(e, BILL_KEYS.price)}
      />
      <div className="flex gap-1">
        <span className="text-slate-700"> x </span>
        <Input
          key={`${itemKey}_quantity`}
          name={BILL_KEYS.quantity}
          inputMode="numeric"
          className="p-0"
          placeholder="1"
          value={newItem.quantity}
          onChange={(e) => handleItemChange(e, BILL_KEYS.quantity)}
        />
      </div>
    </div>
  );
};

export default BillItem;
