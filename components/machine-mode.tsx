// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type MachineModeContextValue = {
  machine: boolean;
  setMachine: (on: boolean) => void;
};

const MachineModeContext = createContext<MachineModeContextValue>({
  machine: false,
  setMachine: () => {},
});

export function useMachineMode() {
  return useContext(MachineModeContext);
}

export function MachineModeProvider({ children }: { children: ReactNode }) {
  const [machine, setMachineState] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (machine) {
      root.classList.add("machine");
    } else {
      root.classList.remove("machine");
    }
  }, [machine]);

  return (
    <MachineModeContext value={{ machine, setMachine: setMachineState }}>
      {children}
    </MachineModeContext>
  );
}
