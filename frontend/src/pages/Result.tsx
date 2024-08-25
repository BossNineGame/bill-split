import { AdjustmentKey, useAdjustmentStore } from "../stores/AdjustmentStore";
import { useBillFriendStore } from "../stores/BillFriendStore";
import { BillItemKey, useBillStore } from "../stores/BillStore";
import { toPng } from "html-to-image";
import FluentClipboardImage20Regular from "~icons/fluent/clipboard-image-20-regular";
// import FluentClipboardLetter20Regular from "~icons/fluent/clipboard-letter-20-regular";
import { useFriendStore } from "../stores/FriendStore";

type ItemPrices = Record<
  BillItemKey,
  Record<AdjustmentKey, number> & { originalPrice: number; totalPrice: number }
>;

const useItemPrices = () => {
  const { adjustments, billToAdjustments, adjustmentTree } =
    useAdjustmentStore();
  const { items } = useBillStore();

  const getTotalAdjustmentPercentage = (
    billKey: string,
    adjustmentKey: string
  ): number => {
    const itemAdjustments = billToAdjustments.get(billKey);
    const inner = (adjustmentKey: string | undefined): number => {
      if (
        !itemAdjustments ||
        adjustmentKey === undefined ||
        !itemAdjustments.has(adjustmentKey)
      )
        return 100;
      const adjustment = adjustments.get(adjustmentKey)!;
      return (
        ((adjustment.percentage + 100) / 100) *
        inner(adjustmentTree.get(adjustmentKey))
      );
    };
    console.log(
      items.get(billKey)!.name,
      adjustments.get(adjustmentKey)!.name,
      inner(adjustmentKey)
    );
    return inner(adjustmentKey);
  };

  return Array.from(items).reduce<ItemPrices>((acc, [billKey, { price }]) => {
    const itemAdjustments = billToAdjustments.get(billKey);
    if (!itemAdjustments)
      return {
        ...acc,
        [billKey]: { originalPrice: price, totalPrice: price },
      };

    const adjustmentPrices = Array.from(itemAdjustments.keys()).reduce<
      Record<AdjustmentKey, number>
    >(
      (acc2, adjustmentKey) => ({
        ...acc2,
        [adjustmentKey]:
          ((getTotalAdjustmentPercentage(billKey, adjustmentKey) - 100) / 100) *
          price,
      }),
      {}
    );

    const totalPrice = Object.values(adjustmentPrices).reduce(
      (acc, price) => acc + price,
      price
    );

    return {
      ...acc,
      [billKey]: {
        originalPrice: price,
        ...adjustmentPrices,
        totalPrice: totalPrice,
      },
    };
  }, {});
};

const Result = () => {
  const itemPrices = useItemPrices();
  console.log(itemPrices);
  const { items, name } = useBillStore();
  const { friends } = useFriendStore();
  const { billToFriends } = useBillFriendStore();

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
          {Array.from(friends).map((friend) => {
            return (
              <div
                className="grid grid-flow-row auto-rows-[min-content_auto_min-content] w-full gap-4 p-4 rounded-lg bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm"
                key={friend}
              >
                <h2 className="text-lg text-white">{friend}</h2>
                <div className="grid grid-flow-row auto-rows-min gap-1">
                  {Object.entries(itemPrices).map(
                    ([billKey, { totalPrice }]) =>
                      billToFriends.get(billKey)?.has(friend) && (
                        <div
                          className="grid grid-flow-col gap-6 auto-cols-[auto_min-content] text-slate-400 text-sm"
                          key={billKey}
                        >
                          <p>{items.get(billKey)!.name}</p>
                          <p>
                            {(
                              totalPrice / billToFriends.get(billKey)!.size
                            ).toFixed(2)}
                          </p>
                        </div>
                      )
                  )}
                </div>
                {/* <div className="grid grid-flow-row auto-rows-min gap-1">
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
                  </div> */}
                <div>
                  <div className="grid grid-flow-col auto-cols-[auto_min-content] text-base text-white">
                    <p> Total </p>
                    <p>
                      {Object.entries(itemPrices)
                        .reduce(
                          (acc, [billKey, { totalPrice }]) =>
                            billToFriends.get(billKey)?.has(friend)
                              ? totalPrice + acc
                              : acc,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row gap-4 px-2 py-1 text-2xl  rounded-full">
          <span>Total:</span>
          <span>
            {Object.values(itemPrices)
              .reduce((acc, { totalPrice }) => totalPrice + acc, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Result;
