import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/* PWA：file:// 下不注册，避免报错 */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
