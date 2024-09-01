export type CustomDropdownOption = {
  label: string;
  value: number;
}

export const BaudRates: CustomDropdownOption[] = [
  { label: "9600", value: 9600 },
  { label: "19200", value: 19200 },
  { label: "28800", value: 28800 },
  { label: "38400", value: 38400 },
  { label: "57600", value: 57600 },
  { label: "76800", value: 76800 },
  { label: "115200", value: 115200 },
]

export const Languages: CustomDropdownOption[] = [
  { label: "English", value: 0 },
  { label: "Swedish", value: 1 },
  { label: "Närpesisk", value: 2 },
]

export type AudioSink = {
  index: number;
  name: string;
  description: string;
}

export type Setting = {
  name: string;
  value: number | string | boolean;
}

export type Colors = {
  background: string;
  text: string;
  topBar: string;
  bottomBar: string;
  icon: string;
}

