import React, { useRef, useState } from "react";
import { TaskbarMenu } from "./taskbarmenu";
import { useGlobalState } from "../globalstatecontext";

interface DropDownIF {
  children: React.ReactNode;
}

export const DropDown: React.FC<DropDownIF> = (props: DropDownIF) => {

  const { state } = useGlobalState();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const ddRef = useRef<any>(null);

  const minSwipeDistance = 250;

  document.addEventListener("mousedown", (e: MouseEvent) => {
    if (!modalVisible) return;

    if (ddRef.current && !ddRef.current.contains(e.target)) {
      hideTaskbar();
    }
  })

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (modalVisible) return;
    setTouchStart(e.clientY);
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!touchStart) return;

    if (e.clientY - touchStart > minSwipeDistance) { showTaskbar(); }
    else { hideTaskbar(); }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!touchStart) return;

    const distance = e.clientY - touchStart;
    const isDownSwipe = distance > minSwipeDistance;

    if (isDownSwipe) { showTaskbar(); }
    else { hideTaskbar(); }

    setTouchStart(null);
  }

  const showTaskbar = () => { setModalVisible(true); }
  const hideTaskbar = () => { setModalVisible(false); }

  return (
    <div className="none">
      <div
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className="dropdown"
        id="taskbar"
      >
        {props.children}
      </div>
      <TaskbarMenu ddRef={ddRef} modalVisible={modalVisible} notifications={state.missedNotifs} />
    </div>
  );
}
