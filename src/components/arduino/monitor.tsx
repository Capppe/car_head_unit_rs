import React, { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { Board } from "../../screens/arduino_mgr";
import { invoke } from "@tauri-apps/api/tauri";
import { getFormattedTime } from "../../utils/utils";

interface ArduinoMonitorProps {
  board?: Board;
}

type Payload = {
  message: string;
}

export const ArduinoMonitor: React.FC<ArduinoMonitorProps> = ({ board }) => {
  const [boardOutput, setBoardOutput] = useState<string[]>([]);

  const isListening = useRef<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startListening();
    startEventListener();

    return () => {
      console.log("Returning");
      if (isListening.current) {
        console.log("Returning2");
        isListening.current = false;
        stopListening();
      }
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [boardOutput]);

  const startListening = async () => {
    if (!board || isListening.current) return;
    isListening.current = true;
    await invoke("start_listen_to_board", { port: board.port, baudRate: 9600 });
  }

  const stopListening = async () => {
    await invoke("stop_listen_to_board");
  }

  const startEventListener = async () => {
    await listen<Payload>("arduino-message", (event) => {
      const msg = event.payload.message;
      if (msg == "\n") return;
      appendOutput(msg);
    });
  }

  const appendOutput = (msg: string) => {
    setBoardOutput(prevOutput => [...prevOutput, `${getFormattedTime()} - ${msg}`]);
  }

  const renderOutput = () => {
    return (
      <pre className="col">
        {boardOutput.map((msg, index) => (
          <div key={index} className="text_orange">
            {msg}
          </div>
        ))}
      </pre>
    )
  }

  const clearOutput = () => {
    setBoardOutput([]);
  }

  return (
    <div>
      <div className="col center arduino-output" ref={bottomRef}>
        {renderOutput()}
      </div>
      <div>
        <button type="button" onClick={() => clearOutput()}>Clear output</button>
      </div>
    </div>
  );
}
