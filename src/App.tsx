import React, { useEffect, useState } from "react";
import "./App.css";
import { MainContainer } from "./components/main_container";
import { MainMenu } from "./screens/main_menu";
import { Taskbar } from "./components/taskbar/taskbar";
import { useColorState } from "./components/globalstatecontext";
import { DockBar } from "./components/dockbar/dockbar";

const App = () => {
  const { colorState } = useColorState();
  const changeWindow = (elem: React.JSX.Element) => {
    setCurrentElement(elem);
  }

  const [currentElement, setCurrentElement] = useState(<MainMenu changeWindow={changeWindow} />)

  useEffect(() => {
    document.body.style.backgroundColor = colorState.colors.background;
    document.body.style.color = colorState.colors.text;

    const taskbar = document.getElementById('taskbar');
    if (taskbar) taskbar.style.backgroundColor = colorState.colors.topBar;

    const bottomBar = document.getElementById('dockbar');
    if (bottomBar) bottomBar.style.backgroundColor = colorState.colors.bottomBar;

    const icons = document.getElementsByTagName('img');
    if (icons) {
      for (let icon of icons) {
        icon.style.color = colorState.colors.icon;
      }
    }
  }, [colorState]);

  const showHomeWindow = () => {
    setCurrentElement(<MainMenu changeWindow={changeWindow} />);
  }

  return (
    <div style={{ height: '100%' }}>
      <Taskbar />
      <MainContainer child_element={currentElement} />
      <DockBar goHome={showHomeWindow} changeWindow={changeWindow} />
    </div>
  );
}

export default App;
