const Home = () => {
  return (
    <>
      <h1 className="text-center text-3xl mb-4"> Simpless </h1>
      <div className="grid grid-rows-2 h-full md:grid-rows-none md:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 text-center rounded-2xl bg-slate-600/20 shadow-slate-700 shadow-inner backdrop-blur-sm">
          <div className="row-span-full col-span-full content-center p-4">
            A camera logo
          </div>
          <div className="row-span-full col-span-full content-end p-4">
            Upload a bill
          </div>
        </div>
        <div className="grid grid-cols-1 p-4 rounded-2xl w-full h-full bg-slate-600/20 shadow-slate-700 shadow-inner text-center">
          <div className="row-span-full col-span-full content-center ">
            A plus logo
          </div>
          <div className="row-span-full col-span-full content-end">
            Add a bill
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
