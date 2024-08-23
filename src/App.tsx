import React, { useState } from "react";
import "./App.css";
import { MainContainer } from "./components/main_container";
import { NotificationBar } from "./components/notification_bar";
import { MainMenu } from "./screens/main_menu";
import { Taskbar } from "./components/taskbar/taskbar";
import { GlobalStateProvider } from "./components/globalstatecontext";
import { DockBar } from "./components/dockbar/dockbar";

const App = () => {
  const changeWindow = (elem: React.JSX.Element) => {
    setCurrentElement(elem);
  }

  const [currentElement, setCurrentElement] = useState(<MainMenu changeWindow={changeWindow} />)

  const showHomeWindow = () => {
    setCurrentElement(<MainMenu changeWindow={changeWindow} />);
  }

  return (
    <GlobalStateProvider>
      <div style={{ height: '100%' }}>
        <NotificationBar />
        <Taskbar />
        <MainContainer child_element={currentElement} />
        <DockBar goHome={showHomeWindow} />
      </div>
    </GlobalStateProvider>
  );
}

export default App;
