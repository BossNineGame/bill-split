import TextInput from "../components/TextInput";
import { useBillStore } from "../stores/BillStore";

const EditBill = () => {
  const { items } = useBillStore();
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // const id = parseInt(e.target.id);
    // const item = items.find((item) => item.id === id);
    // if (item) {
    //   item[name] = value;
    // }
  };

  return (
    <>
      <TextInput placeholder="Bill name" />
      <div className="flex flex-col mt-4 gap-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-3 gap-4 items-center justify-between"
          >
            {/* <p>{item.id}</p> */}
            <div className="px-3 py-1 bg-slate-700 rounded-md">
              <TextInput
                id=
                className="pb-1"
                name="name"
                placeholder="Item Name"
                value={item.name}
                onChange={handleItemChange}
              />
            </div>

            <TextInput
              className="pb-1"
              name="price"
              placeholder="Item Name"
              value={item.price}
              onChange={handleItemChange}
            />
            <TextInput
              className="pb-1"
              name="quantity"
              placeholder="Item Name"
              value={item.quantity}
              onChange={handleItemChange}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default EditBill;
