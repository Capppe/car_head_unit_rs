import { getBluetoothStatus } from "./bluetooth";
import { getNetworkStatus } from "./network"

export const getHwStatus = async () => {
  const networkStatus = await getNetworkStatus();
  const bluetoothStatus = await getBluetoothStatus();

  return { net: networkStatus, bt: bluetoothStatus };
}
