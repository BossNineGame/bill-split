import React from "react";

export const HashContext = React.createContext<string>("");

export const useHash = () => React.useContext(HashContext);

