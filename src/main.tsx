import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Details from "./Details";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const appWindow = getCurrentWebviewWindow();
const windowLabel = appWindow.label;

// Выбираем компонент в зависимости от метки окна
const Component = windowLabel === "details" ? Details : App;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>,
);
