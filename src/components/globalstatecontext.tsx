import React, { createContext, useContext, useState } from "react";
import { Colors } from "../utils/constants";

export interface ColorState {
  colors: Colors;
}

interface ColorStateContextType {
  colorState: ColorState;
  setColorState: React.Dispatch<React.SetStateAction<ColorState>>;
}

const defaultColorState: ColorState = {
  colors: {
    background: "#2f2f2f",
    text: "#f6f6f6",
    topBar: "black",
    bottomBar: "black",
    icon: "#ffffff",
  }
}

const ColorStateContext = createContext<ColorStateContextType | undefined>(undefined);

interface ColorStateProviderProps {
  children: React.ReactNode;
}

export const ColorStateProvider = ({ children }: ColorStateProviderProps) => {
  const [colorState, setColorState] = useState<ColorState>(defaultColorState);

  return (
    <ColorStateContext.Provider value={{ colorState, setColorState }}>
      {children}
    </ColorStateContext.Provider>
  );
}

export const useColorState = (): ColorStateContextType => {
  const context = useContext(ColorStateContext);
  if (!context) {
    throw new Error("useColorState must be used within a ColorStateProvider");
  }

  return context;
}
