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

export async function connectToDevice(address: string): Promise<string> {
  const status = await invoke<string>("connect_to_device", { address });
  return status;
}

export async function disconnectFromDevice(address: string) {
  const status = await invoke("disconnect_from_device", { address });
  return status;
}
