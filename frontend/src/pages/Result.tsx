import { Adjustment, useAdjustmentStore } from "../stores/AdjustmentStore";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { useBillStore } from "../stores/BillStore";
import { toPng } from "html-to-image";

const Result = () => {
  const { friendToBills, billToFriends } = useBillFriendStore();
  const { adjustments, adjustmentToBills } = useAdjustmentStore();
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
            }).then(async (dataURL) => {
              // const link = document.createElement("a");
              // link.href = dataURL;
              // link.download = "downloaded-image.png";

              // link.click();
              const blob = await fetch(dataURL).then((res) => res.blob());

              // save to clipboard
              navigator.clipboard
                .write([new ClipboardItem({ "image/png": blob })])
                .then(() => {
                  alert("Image saved to clipboard");
                });
            });
          }}
        >
          Save Image
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-4 w-full">
        {Array.from(friendToBills).map(([friend, bills]) => {
          const itemPricePairs = Array.from(bills).map((billKey) => {
            const item = items.get(billKey);
            const friends = billToFriends.get(billKey);
            if (!item || !friends) return [];
            return [
              billKey,
              ((item.price * item.quantity) / friends.size).toFixed(2),
            ];
          });

          const adjustmentPricePairs = Array.from(adjustments).map(
            ([adjustmentKey, adjustment]) => [
              adjustment,
              itemPricePairs
                .reduce(
                  (acc, [billKey, price]) =>
                    adjustmentToBills.get(adjustmentKey)?.has(billKey)
                      ? acc +
                        (adjustment.percentage * parseFloat(price)) / 100.0
                      : acc,
                  0
                )
                .toFixed(2),
            ]
          ) as [Adjustment, string][];

          // const adjustmentPricePairsAcc = adjustmentPricePairs.map(
          //   ([adjustment, price], idx) => [
          //     adjustment,
          //     (
          //       (idx > 0
          //         ? (parseFloat(adjustmentPricePairs[idx - 1][1]) *
          //             adjustment.percentage) /
          //           100.0
          //         : 0) + parseFloat(price)
          //     ).toFixed(2),
          //   ]
          // );

          const totalPrice = (
            itemPricePairs.reduce(
              (acc, [, price]) => acc + parseFloat(price),
              0
            ) +
            adjustmentPricePairs.reduce(
              (acc, [, price]) => acc + parseFloat(price),
              0
            )
          ).toFixed(2);
          return (
            <div
              className="grid grid-flow-row auto-rows-[min-content_auto_min-content] w-full gap-4 divide-slate-500 p-4 rounded-lg bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm"
              key={friend}
            >
              <h2 className="text-lg text-white">{friend}</h2>
              <div className="grid grid-flow-row auto-rows-min gap-1">
                {itemPricePairs.map(([billKey, price]) => (
                  <div
                    className="grid grid-flow-col gap-6 auto-cols-[auto_min-content] text-slate-400 text-sm"
                    key={billKey}
                  >
                    <p>{items.get(billKey)!.name}</p>
                    <p>{price}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-flow-row auto-rows-min gap-1">
                {adjustmentPricePairs.map(
                  ([adjustment, price]) =>
                    parseFloat(price) !== 0 && (
                      <div
                        className="grid grid-flow-col gap-6 auto-cols-[auto_min-content] text-slate-400 text-sm"
                        key={adjustment.name}
                      >
                        <p>{`${adjustment.name} ${adjustment.percentage}%`}</p>
                        <p>{price}</p>
                      </div>
                    )
                )}
              </div>
              <div>
                <div className="grid grid-flow-col auto-cols-[auto_min-content] text-base text-white">
                  <p> Total </p>
                  <p> {totalPrice} </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Result;
