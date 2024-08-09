const NavBar = () => {
  // the state of navbar is read from url
  return (
    <>
      <div className="space-x-2 grid grid-cols-3 w-32">
        <a>Home</a>
        <a>Edit</a>
        <a>Summary</a>
      </div>
      <hr className="border-slate-800" />
    </>
  );
};

export default NavBar;
