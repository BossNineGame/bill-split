import { Adjustment, useAdjustmentStore } from "../stores/AdjustmentStore";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { useBillStore } from "../stores/BillStore";
import { toPng } from "html-to-image";
import FluentClipboardImage20Regular from "~icons/fluent/clipboard-image-20-regular";
import FluentClipboardLetter20Regular from "~icons/fluent/clipboard-letter-20-regular";

const useFriendToPrices = () => {
  const { friendToBills, billToFriends } = useBillFriendStore();
  const { adjustments, adjustmentToBills, adjustmentTree } =
    useAdjustmentStore();
  const { items } = useBillStore();

  return Array.from(friendToBills)
    .filter(([, bills]) => bills.size > 0)
    .reduce(
      (acc, current) => {
        const [friend, bills] = current;
        const itemPricePairs = Array.from(bills)
          .map((billKey) => {
            const item = items.get(billKey);
            const friends = billToFriends.get(billKey);
            if (!item || !friends) return undefined;
            return [
              billKey,
              ((item.price * item.quantity) / friends.size).toFixed(2),
            ];
          })
          .filter((x) => x !== undefined) as [string, string][];

        const adjustmentPricePairs = Array.from(adjustments.keys()).map(
          (adjustmentKey) => {
            let currentKey: string | undefined = adjustmentKey;
            let totalAdjustmentPercent: number = 0;
            while (currentKey !== undefined) {
              const adjustment = adjustments.get(currentKey);
              if (!adjustment) return totalAdjustmentPercent;
              if (totalAdjustmentPercent === 0)
                totalAdjustmentPercent = adjustment.percentage / 100;
              else
                totalAdjustmentPercent *=
                  totalAdjustmentPercent < 0.0 && adjustment.percentage < 0.0
                    ? (-1 * adjustment.percentage) / 100
                    : adjustment.percentage / 100;
              currentKey = adjustmentTree.get(currentKey);
            }
            const adjustment = adjustments.get(adjustmentKey);
            return [
              adjustment,
              itemPricePairs
                .reduce(
                  (acc, [billKey, price]) =>
                    adjustmentToBills.get(adjustmentKey)?.has(billKey)
                      ? acc + totalAdjustmentPercent * parseFloat(price)
                      : acc,
                  0
                )
                .toFixed(2),
            ];
          }
        ) as [Adjustment, string][];

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
        return {
          ...acc,
          [friend]: { itemPricePairs, adjustmentPricePairs, totalPrice },
        };
      },
      {} as Record<
        string,
        {
          itemPricePairs: [string, string][];
          adjustmentPricePairs: [Adjustment, string][];
          totalPrice: string;
        }
      >
    );
};

const Result = () => {
  const friendToPrices = useFriendToPrices();
  const { items, name } = useBillStore();

  return (
    <div className="w-[900px] flex flex-col gap-4 ">
      <div className="flex flex-col gap-4" id="summary">
        <div className="w-full flex flex-row gap-4 place-items-center">
          <h1 className="text-xl"> {name} </h1>
          <button
            id="save-image-button"
            className="flex border border-slate-400 rounded-full size-8 items-center justify-center text-slate-300"
            onClick={() => {
              const appElement = document.getElementById("app")!;
              const summaryElement = document.getElementById("summary")!;

              toPng(appElement, {
                width: summaryElement.scrollWidth + 60,
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
            <FluentClipboardImage20Regular />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {Object.entries(friendToPrices).map(
            ([
              friend,
              { itemPricePairs, adjustmentPricePairs, totalPrice },
            ]) => {
              return (
                <div
                  className="grid grid-flow-row auto-rows-[min-content_auto_min-content] w-full gap-4 p-4 rounded-lg bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm"
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
                            className="grid grid-flow-col gap-6 auto-cols-[auto_min-content] text-slate-400 text-xs"
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
            }
          )}
        </div>
        <div className="flex flex-row gap-4 px-2 py-1 text-2xl  rounded-full">
          <span>Total:</span>
          <span>
            {`${Object.values(friendToPrices)
              .reduce((acc, { totalPrice }) => acc + parseFloat(totalPrice), 0)
              .toFixed(2)}
          `}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Result;
