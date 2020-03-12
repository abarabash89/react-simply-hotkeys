import React, { FC, memo, useEffect, useContext, createContext } from "react";

import { HotkeysServiceContext } from "./context";

export const HotkeysNamespaceContext = createContext("");

interface IHotKeysNamespaceProps {
  name: string;
  enableOther?: boolean;
}

export const HotKeysNamespace: FC<IHotKeysNamespaceProps> = memo(
  ({ children, name, enableOther = false }) => {
    const service = useContext(HotkeysServiceContext);
    useEffect(() => {
      if (!service) {
        return;
      }
      const currentNamespace = service.getNamespace();
      service.setNamespace(enableOther ? "" : name);
      return () => {
        service.setNamespace(currentNamespace);
      };
    }, [enableOther, name, service]);
    return (
      <HotkeysNamespaceContext.Provider value={name}>
        {children}
      </HotkeysNamespaceContext.Provider>
    );
  }
);
