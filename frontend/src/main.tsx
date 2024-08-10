import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashProvider } from "./contexts/HashProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashProvider>
      <App />
    </HashProvider>
  </StrictMode>
);
