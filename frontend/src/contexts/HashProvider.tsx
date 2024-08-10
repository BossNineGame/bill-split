import React, { PropsWithChildren } from "react";
import { HashContext } from "./HashContext";

export const HashProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hash, setHash] = React.useState<string>(window.location.hash);

  React.useEffect(() => {
    const handleHash = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return <HashContext.Provider value={hash}>{children}</HashContext.Provider>;
};
