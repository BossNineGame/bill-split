const NavBar = () => {
  // the state of navbar is read from url
  return (
    <div>
      <div className="space-x-2 grid grid-cols-3 w-48">
        <a>Upload</a>
        <a>Edit</a>
        <a>Result</a>
      </div>
      <hr className="border-slate-700 my-4" />
    </div>
  );
};

export default NavBar;
