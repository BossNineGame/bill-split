import { useHash } from "../contexts/HashContext";
import MdiGithub from "~icons/mdi/github";

const NavBar = () => {
  const hash = useHash();

  const highlight = (path: string) => {
    return hash === path ? "text-white" : "text-slate-600";
  };

  return (
    <div id="navbar">
      <div className="grid grid-cols-[repeat(3,_min-content)_auto] gap-4 items-center">
        <a href="/#" className={highlight("")}>
          Upload
        </a>
        <a href="/#edit" className={highlight("#edit")}>
          Edit
        </a>
        <a href="/#result" className={highlight("#result")}>
          Result
        </a>
        <a
          href="https://github.com/BossNineGame/bill-split"
          className="place-self-end self-center text-xl"
        >
          <MdiGithub />
        </a>
      </div>
      <hr className="border-slate-700 my-4" />
    </div>
  );
};

export default NavBar;
