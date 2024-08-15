import React, { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { Board } from "../../screens/arduino_mgr";
import { invoke } from "@tauri-apps/api/tauri";

interface ArduinoMonitorProps {
  board?: Board;
}

type Payload = {
  message: string;
}

export const ArduinoMonitor: React.FC<ArduinoMonitorProps> = ({ board }) => {
  const isListening = useRef(false);

  useEffect(() => {
    startListening();
    startEventListener();

    // return () => {
    //   console.log("Returning");
    //   if (isListening.current) {
    //     isListening.current = false;
    //     stopListening();
    //   }
    // }
  }, []);

  const startListening = async () => {
    console.log(board);
    if (!board || isListening.current) return;
    isListening.current = true;
    await invoke("start_listen_to_board", { port: board.port, baudRate: 9600 });
  }

  const stopListening = async () => {
    await invoke("stop_listen_to_board");
  }


  const startEventListener = async () => {
    await listen<Payload>("arduino-message", (event) => {
      console.log("Arduino msg: ", event.payload.message);
    });
  }

  return (
    <div>Output:</div>
  );
}
