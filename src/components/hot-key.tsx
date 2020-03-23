import React, { FC, memo, useContext, useEffect } from "react";

import {
  HotkeysNamespaceContext,
  HotkeysServiceContext,
  HotKeyEventListener
} from "../hotkeys";

interface IHotKeyProps {
  keyMap: string;
  onKeyDown?: HotKeyEventListener;
  onKeyUp?: HotKeyEventListener;
  description?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}

export const HotKey: FC<IHotKeyProps> = memo(
  ({
    keyMap,
    onKeyDown,
    onKeyUp,
    description = "",
    ignoreNamespace = false,
    ignoreFocusedElements = false,
    children
  }) => {
    const service = useContext(HotkeysServiceContext);
    const namespace = useContext(HotkeysNamespaceContext);

    useEffect(() => {
      if (!service) {
        return;
      }
      const options = {
        description,
        namespace,
        ignoreNamespace,
        ignoreFocusedElements
      };
      onKeyDown &&
        service.add(keyMap, onKeyDown, {
          ...options,
          eventType: "keydown"
        });
      onKeyUp &&
        service.add(keyMap, onKeyUp, {
          ...options,
          eventType: "keyup"
        });
      return () => {
        onKeyDown &&
          service.remove(keyMap, onKeyDown, {
            eventType: "keydown",
            namespace
          });
        onKeyUp &&
          service.remove(keyMap, onKeyUp, {
            eventType: "keyup",
            namespace
          });
      };
    }, [
      description,
      ignoreFocusedElements,
      ignoreNamespace,
      keyMap,
      namespace,
      onKeyDown,
      onKeyUp,
      service
    ]);

    return <>{children}</>;
  }
);
