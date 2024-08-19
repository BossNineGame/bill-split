import { useHash } from "../contexts/HashContext";

const NavBar = () => {
  const hash = useHash();

  const highlight = (path: string) => {
    return hash === path ? "text-white" : "text-slate-600";
  };

  return (
    <div id="navbar">
      <div className="grid grid-flow-col auto-cols-min gap-4">
        <a href="/#" className={highlight("")}>
          Upload
        </a>
        <a href="/#edit" className={highlight("#edit")}>
          Edit
        </a>
        <a href="/#result" className={highlight("#result")}>
          Result
        </a>
      </div>
      <hr className="border-slate-700 my-4" />
    </div>
  );
};

export default NavBar;
