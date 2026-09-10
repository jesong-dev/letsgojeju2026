import "../../styles/reset.css";
import { createRoot } from "react-dom/client";
import { App } from "./index";

createRoot(document.getElementById("app")!).render(<App />);
