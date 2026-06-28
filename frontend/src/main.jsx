import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root.jsx";

import { LayoutGroup } from "framer-motion";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LayoutGroup>
      <Root />
    </LayoutGroup>
  </StrictMode>,
);
