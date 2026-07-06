import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { App } from "./app.tsx";

const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
