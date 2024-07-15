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
