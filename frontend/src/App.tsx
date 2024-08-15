import NavBar from "./components/NavBar";
import { useHash } from "./contexts/HashContext";
import EditBill from "./pages/EditBill";
import Home from "./pages/Home";
import Result from "./pages/Result";

export default function App() {
  const hash = useHash();
  return (
    <div
      id="app"
      className="flex flex-col w-full h-screen p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-y-scroll"
    >
      <NavBar />
      <div className="flex flex-col h-full">
        {hash === "#edit" ? (
          <EditBill />
        ) : hash === "#result" ? (
          <Result />
        ) : (
          <Home />
        )}
      </div>
    </div>
  );
}
