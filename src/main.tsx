import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DetailsWindow from "./DetailsWindow";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const appWindow = getCurrentWebviewWindow();
const windowLabel = appWindow.label;

console.log("Window label:", windowLabel);

// Выбираем компонент в зависимости от метки окна
// Окна с префиксом "details-" показывают DetailsWindow
const isDetailsWindow = typeof windowLabel === 'string' && windowLabel.startsWith("details");
console.log("Is details window:", isDetailsWindow);

const Component = isDetailsWindow ? DetailsWindow : App;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>,
);
