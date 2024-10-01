import React, { ReactElement, ReactNode, useCallback, useState } from "react";
import { NotificationContext } from "./notification_context";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<ReactElement | null>(null)

  const showNotification = useCallback(
    (component: ReactElement, duration: number = 3000) => {
      setNotification(component);

      setTimeout(() => {
        setNotification(null);
      }, duration);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: 40,
          zIndex: 1000,
          height: '20%',
          width: '100%',
          borderBottom: '5px solid #F49609',
        }}>
          {notification}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
}
