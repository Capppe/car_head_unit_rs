import { invoke } from "@tauri-apps/api/tauri"

interface BluetoothStatus {
  address?: string;
  addressType?: string;
  alias?: string;
  class?: string;
  connectedDevices?: number;
  discoverable?: boolean;
  discoverableTimeout?: number;
  discovering?: boolean;
  manufacturer?: string;
  modalias?: string;
  name?: string;
  pairable?: boolean;
  pairableTimeout?: number;
  powered?: boolean;
  powerState?: string;
  roles?: string[];
  uuids?: string[];
  version?: number;
}

export async function getBluetoothStatus(): Promise<BluetoothStatus> {
  const status = await invoke<BluetoothStatus>("get_bluetooth_status");
  return status;
}

export function startDiscovery() {
  invoke("start_discovery", { duration: 10 });
}

export function stopDiscovery() {
  invoke("stop_discovery");
}

export async function connectToDevice(address: string): Promise<string> {
  try {
    await invoke<string>("connect_to_device", { address });
    return "Connected";
  } catch (error) {
    return `Failed&&${error}`;
  }
}

export async function disconnectFromDevice(address: string): Promise<string> {
  const status = await invoke<string>("disconnect_from_device", { address });
  return status;
}

export async function removeDevice(address: string) {
  const status = await invoke("remove_device", {
    address,
  });
  console.log(status);
  return status;
}
