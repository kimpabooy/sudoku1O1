import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css' (borttagen)
import App from "./App.jsx";
import "./style/General.css";
import "./style/Board.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
