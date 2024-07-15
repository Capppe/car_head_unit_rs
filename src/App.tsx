import React, { useRef, useState } from "react";
import "./App.css";
import { MainContainer } from "./components/main_container";
import { NotificationBar } from "./components/notification_bar";
import { MainMenu } from "./screens/main_menu";
import { ImageButton } from "./components/image_button";
import { Taskbar } from "./components/taskbar/taskbar";
import { getNetworkStatus } from "./utils/network";
import { getBluetoothStatus } from "./utils/bluetooth";
import { GlobalStateProvider } from "./components/globalstatecontext";
import { DockBar } from "./components/dockbar/dockbar";

const App = () => {
  const changeWindow = (elem: React.JSX.Element) => {
    setCurrentElement(elem);
  }

  const [currentElement, setCurrentElement] = useState(<MainMenu changeWindow={changeWindow} />)

  return (
    <GlobalStateProvider>
      <div>
        <NotificationBar content="Testtesttesttestesttesttestt" header="Test" imgSrc="info.svg" />
        <Taskbar />
        <MainContainer child_element={currentElement} />
        <ImageButton id="test_network_button" imgSrc="" text="Test network" onClick={() => {
          getNetworkStatus();
        }} />
        <ImageButton id="test_bluetooth_button" imgSrc="" text="Test bluetooth" onClick={() => {
          getBluetoothStatus();
        }} />
        <DockBar />
      </div>
    </GlobalStateProvider>
  );
}

export default App;
