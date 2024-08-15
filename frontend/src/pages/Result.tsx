import { useBillFriendStore } from "../stores/BillFriendStore";
import { useBillStore } from "../stores/BillStore";
import { toPng } from "html-to-image";

const Result = () => {
  const { friendToBills } = useBillFriendStore();
  const { items, name } = useBillStore();

  return (
    <div id="summary">
      <div className="w-full grid grid-flow-col auto-cols-[auto_min-content] mb-4 place-items-center">
        <h1 className="text-xl w-full"> {name} </h1>
        <button
          id="save-image-button"
          className="border p-2 w-32 border-slate-400 rounded-md text-slate-300"
          onClick={() => {
            const appElement = document.getElementById("app")!;
            const summaryElement = document.getElementById("summary")!;

            toPng(appElement, {
              height: summaryElement.scrollHeight + 60,
              filter: (node) =>
                !["save-image-button", "navbar"].includes(node.id),
            }).then((dataURL) => {
              const link = document.createElement("a");
              link.href = dataURL;
              link.download = "downloaded-image.png";

              link.click();
            });
          }}
        >
          Save Image
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8 w-full">
        {Array.from(friendToBills).map(([friend, bills]) => (
          <div
            className="grid grid-flow-row auto-rows-[min-content_auto_min-content] w-full gap-4 divide-slate-500 p-4 rounded-lg bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm"
            key={friend}
          >
            <h2 className="text-lg text-white">{friend}</h2>
            <div className="grid grid-flow-row auto-rows-min gap-1">
              {Array.from(bills).map((billKey) => (
                <div
                  className="grid grid-flow-col gap-6 auto-cols-[auto_min-content] text-slate-400 text-sm"
                  key={billKey}
                >
                  <p>{items.get(billKey)?.name}</p>
                  <p className="">{items.get(billKey)?.price}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="grid grid-flow-col auto-cols-[auto_min-content] text-base text-white">
                <p> Total </p>
                <p>
                  {Array.from(bills).reduce((acc, billKey) => {
                    return acc + (items.get(billKey)?.price ?? 0);
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Result;
