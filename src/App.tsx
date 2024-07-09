import React, { useRef, useState } from "react";
import "./App.css";
import { MainContainer } from "./components/main_container";
import { NotificationBar } from "./components/notification_bar";
import { MainMenu } from "./screens/main_menu";
import { ImageButton } from "./components/image_button";
import { Taskbar } from "./components/taskbar/taskbar";
import { getNetworkStatus } from "./utils/network";

function App() {
  const changeWindow = (elem: React.JSX.Element) => {
    setCurrentElement(elem);
  }

  const hideNotif = () => {
    clearTimeout(timer.current);
    setShouldShowNotif(false);
  }

  const showNotif = () => {
    setShouldShowNotif(true);
    timer.current = setTimeout(() => {
      hideNotif();
      clearTimeout(timer.current);
    }, 5000);
  }

  const [currentElement, setCurrentElement] = useState(<MainMenu changeWindow={changeWindow} />)
  const [shouldShowNotif, setShouldShowNotif] = useState(false);
  const timer = useRef<number>();

  return (
    <div>
      <NotificationBar barVisible={shouldShowNotif} toggleBarVisible={hideNotif} content="Testtesttesttestesttesttestt" header="Test" imgSrc="info.svg" />
      <Taskbar />
      <MainContainer child_element={currentElement} />
      <ImageButton id="test_notif_button" imgSrc="" text="Test notif" onClick={() => {
        showNotif();
      }} />
      <ImageButton id="test_network_button" imgSrc="" text="Test network" onClick={() => {
        getNetworkStatus();
      }} />
    </div>
  );
}

export default App;
