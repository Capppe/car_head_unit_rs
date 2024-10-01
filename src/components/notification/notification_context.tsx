import { createContext, ReactElement, useContext } from "react";

interface NotificationContextType {
  showNotification: (component: ReactElement, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }

  return context;
}
