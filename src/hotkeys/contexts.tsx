import React, { FC, createContext, useMemo } from "react";

import { HotkeysService } from "./hotkeys-service";

export const HotkeysNamespaceContext = createContext("");
export const HotkeysServiceContext = createContext<HotkeysService | null>(null);
export const HotkeysServiceContextProvider: FC = ({ children }) => {
  const hotkeysService = useMemo(() => new HotkeysService(), []);
  return (
    <HotkeysServiceContext.Provider value={hotkeysService}>
      {children}
    </HotkeysServiceContext.Provider>
  );
};
