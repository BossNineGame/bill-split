import FluentScanCamera48Filled from "~icons/fluent/scan-camera-48-filled";
import FluentAddSquareMultiple24Filled from "~icons/fluent/add-square-multiple-24-filled";

const Home = () => {
  return (
    <>
      <h1 className="text-center text-4xl mb-4"> Simpless </h1>
      <div className="grid grid-rows-2 h-full md:grid-rows-none md:grid-cols-2 gap-8 text-2xl">
        <button className="flex flex-col p-8 text-center rounded-2xl bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm items-center">
          <FluentScanCamera48Filled className="size-36 mx-auto flex-grow" />
          <h2>Scan a bill</h2>
        </button>
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
