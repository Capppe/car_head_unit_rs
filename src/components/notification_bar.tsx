import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalState } from "./globalstatecontext";
import { NormalNotif } from "./notification_templates/normal_notif";

interface NotificationProps {
  content: React.JSX.Element;
  timeout: number;
}

export const NotificationBar = () => {
  const [content, setContent] = useState<NotificationProps>({
    content: <NormalNotif imgSrc="" header="" content="" />,
    timeout: 0,
  });
  const [barVisible, setBarVisible] = useState(false);

  const timer = useRef<number>();

  const { state, setState } = useGlobalState();

  useEffect(() => {
    console.log("Initializing showNotif");
    setState({
      ...state,
      showNotif: (c: React.JSX.Element, t: number) => showNotif(c, t)
    });

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const showNotif = useCallback((content: React.JSX.Element, timeout: number) => {
    setContent({ content, timeout })
    setBarVisible(true);

    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => hideNotif(), timeout);
  }, []);

  const hideNotif = () => {
    setBarVisible(false);
  }

  return (
    <div className={barVisible ? "top" : "top invisible"} id="top_div" onClick={() => hideNotif()}>
      {content.content}
    </div >
  );
}
