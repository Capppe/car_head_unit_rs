import React, { useEffect, useRef, useState } from "react";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { Board } from "../../screens/arduino_mgr";
import { invoke } from "@tauri-apps/api/tauri";
import { getFormattedTime } from "../../utils/utils";
import { Dropdown } from "../generic/dropdown";
import { BaudRates } from "../../utils/constants";

interface ArduinoMonitorProps {
  board?: Board;
}

type Payload = {
  message: string;
}

export const ArduinoMonitor: React.FC<ArduinoMonitorProps> = ({ board }) => {
  const [boardOutput, setBoardOutput] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [baudRate, setBaudRate] = useState<number>(9600);

  const isListening = useRef<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<UnlistenFn>();

  useEffect(() => {
    startListening();
    startEventListener();

    return () => {
      console.log("Returning");
      stopListening();
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [boardOutput]);

  const startListening = async (baud?: number) => {
    if (!board || isListening.current) return;
    isListening.current = true;
    await invoke("start_listen_to_board", { port: board.port, baudRate: baud || baudRate })
      .catch((err) => {
        setError(err);
        isListening.current = false;
      });
  }

  const stopListening = async () => {
    await invoke("stop_listen_to_board");
    isListening.current = false;
  }

  const startEventListener = async () => {
    if (listenerRef.current) {
      window.removeEventListener("arduino-message", listenerRef.current);
      listenerRef.current = undefined;
    }
    listenerRef.current = await listen<Payload>("arduino-message", (event) => {
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

  const changeBaudRate = async (baud: number) => {
    console.log("Setting baud rate to: ", baud);
    setBaudRate(baud);
    if (isListening.current) {
      await stopListening();
    }
    await startListening(baud);
  }

  return (
    <div>
      {error.length > 0 ? (
        <div className="col center widest" style={{ backgroundColor: "black", padding: '10px' }}>
          <div className="text20">Failed to connect:</div>
          <pre className="text_red">{error}</pre>
        </div>
      ) : (
        <div>
          <div className="col center arduino-output" ref={bottomRef}>
            {renderOutput()}
          </div>
          <div className="row start margined">
            <button type="button" onClick={() => clearOutput()}>Clear output</button>

            <Dropdown
              options={BaudRates}
              placeholder={baudRate}
              label="Baud rate: "
              onChange={(o: number) => changeBaudRate(o)}
            />

            <div></div>
          </div>
        </div >
      )}
    </div >
  );
}
