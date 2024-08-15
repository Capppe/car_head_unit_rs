import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { ArduinoDevice } from "../components/arduino/arduino_dev";
import { ArduinoMonitor } from "../components/arduino/monitor";

type Properties = {
  pid: string,
  serial_number: string,
  vid: string,
}

export type Port = {
  s_type: string,
  name: string,
  label: string,
  properties: Properties,
  protocol: string,
  protocol_label: string,
  hardware_id: string,
}

export type Board = {
  name: string,
  fqbn: string,
  port: Port,
}

export const ArduinoManagerWindow = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showMonitor, setShowMonitor] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(true);
  const [currentBoard, setCurrentBoard] = useState<Board>();

  useEffect(() => {
    getAvailableBoards();
  }, []);

  const getAvailableBoards = async () => {
    setScanning(true);
    const foundBoards = await invoke<Board[]>("get_available_boards");
    setBoards(foundBoards);
    setScanning(false);
    console.log(foundBoards);
  }

  const startMonitor = (board: Board) => {
    setShowMonitor(true);
    setCurrentBoard(board);
  }

  const stopMonitor = () => {
    setShowMonitor(false);
    setCurrentBoard(undefined);
  }

  return (
    <div className="col center">
      {boards.length > 0 ? (
        <div className="col center">

          <div className="text24" style={{ padding: "2px" }}>{scanning ? (
            "Scanning..."
          ) : (
            !showMonitor ? (
              "Select board to listen to:"
            ) : (
              `Listening to '${currentBoard?.name}' on '${currentBoard?.port.label}'`
            )
          )}</div>
          <div className="col">
            {!showMonitor ? (boards && boards.map((b, i) => (
              <ArduinoDevice key={i} name={b.name} fqbn={b.fqbn} port={b.port} onClick={() => { startMonitor(b); }} />
            ))) : (
              <ArduinoMonitor board={currentBoard} />
            )}
          </div>
        </div>
      ) : (
        <div>{!scanning && "No boards found!"}</div>
      )}

      <div>
        {showMonitor ? (
          <button onClick={() => stopMonitor()}>Stop monitoring</button>
        ) : (
          <button onClick={() => getAvailableBoards()}>Rescan</button>
        )}
      </div>

    </div>
  );
}
