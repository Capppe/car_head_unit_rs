import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalStateProvider } from "./components/globalstatecontext";
import { NotificationProvider } from "./components/notification/notification_provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
);
