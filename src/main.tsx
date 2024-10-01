import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ColorStateProvider } from "./components/globalstatecontext";
import { NotificationProvider } from "./components/notification/notification_provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ColorStateProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ColorStateProvider>
  </React.StrictMode>,
);
