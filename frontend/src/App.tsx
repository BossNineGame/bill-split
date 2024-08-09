import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="w-full h-screen bg-slate-900 text-white p-12">
      <NavBar />
      <div className="grid grid-rows-4 h-full">
        <h1 className="text-center text-3xl"> Simpless </h1>
        <div className="grid grid-rows-1 rounded-md w-full h-full">
          <div> A camera logo </div>
          <div> Upload a bill </div>
        </div>
        <div>OR</div>
        <div className="grid grid-rows-1 rounded-md w-full h-full">
          <div> A plus logo </div>
          <div> Add items </div>
        </div>
      </div>
    </div>
  );
}
