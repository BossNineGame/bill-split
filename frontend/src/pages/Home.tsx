import FluentScanCamera48Filled from "~icons/fluent/scan-camera-48-filled";
import FluentAddSquareMultiple24Filled from "~icons/fluent/add-square-multiple-24-filled";
import { useRef, useState } from "react";
import Input from "../components/Input";
import { getBillsFromImage } from "../services/openAi";
import { BillItem, useBillStore } from "../stores/BillStore";
import LineMdLoadingLoop from "~icons/line-md/loading-loop";

const Home = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useBillStore();
  const [gptToken, setGptToken] = useState<string>(
    new URLSearchParams(window.location.search).get("gptToken") ?? ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.item(0);
      if (file) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          let quality = 0.9;
          let base64String;

          do {
            base64String = canvas.toDataURL("image/jpeg", quality);
            const fileSizeInMB =
              (base64String.length * (3 / 4)) / (1024 * 1024);

            if (fileSizeInMB > 20) {
              quality -= 0.1;
            } else {
              break;
            }
          } while (quality > 0);

          const apiKey = import.meta.env.DEV
            ? `${import.meta.env.VITE_OPEN_API_KEY}`
            : gptToken;

          const bills = JSON.parse(
            (await getBillsFromImage(apiKey, base64String)) ?? gptToken
          ).items as BillItem[];

          bills.forEach((bill) => {
            addItem(bill);
          });
          setIsLoading(false);
          alert("Add bills successfully, please proceed to edit page");
        };
        // Read the file as a data URL
        const reader = new FileReader();

        reader.onloadend = () => {
          img.src = reader.result as string;
        };

        reader.readAsDataURL(file);
      }
    } catch (e) {
      alert(`error, please try again ${e}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-rows-2 h-full md:grid-rows-none md:grid-cols-2 gap-8 text-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row text-sm items-center justify-center gap-2">
            <div className="">Enter GPT token:</div>
            <Input
              className="grow w-auto p-1"
              type="password"
              placeholder="sk-proj-...."
              onChange={(e) => setGptToken(e.target.value)}
            />
          </div>
          <button
            className="flex-grow flex flex-col p-8 text-center rounded-2xl bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm items-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                setIsLoading(true);
                handleImageUpload(e);
              }}
            />
            {!isLoading ? (
              <>
                <FluentScanCamera48Filled className="size-36 mx-auto flex-grow" />
                <h2>Scan a bill</h2>
              </>
            ) : (
              <>
                <LineMdLoadingLoop className="size-36 mx-auto flex-grow" />
                <h2>Scanning...</h2>
              </>
            )}
          </button>
        </div>
        <a
          href="/#edit"
          className="flex flex-col p-8 text-center rounded-2xl bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm"
        >
          <FluentAddSquareMultiple24Filled className="size-36 mx-auto flex-grow" />
          <h2>Add a bill</h2>
        </a>
      </div>
    </>
  );
};

export default Home;
