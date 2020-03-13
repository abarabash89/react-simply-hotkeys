import React, { FC, memo, useEffect, useContext } from "react";

import { HotkeysNamespaceContext, HotkeysServiceContext } from "../hotkeys";

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
      const oldNamespace = service.getCurrentNamespace();
      service.setCurrentNamespace(enableOther ? "" : name);
      return () => {
        service.setCurrentNamespace(oldNamespace);
      };
    }, [enableOther, name, service]);
    return (
      <HotkeysNamespaceContext.Provider value={name}>
        {children}
      </HotkeysNamespaceContext.Provider>
    );
  }
);
