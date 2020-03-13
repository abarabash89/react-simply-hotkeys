import { memo, useContext, useEffect } from "react";

import {
  HotkeysNamespaceContext,
  HotkeysServiceContext,
  HotKeyEventListener
} from "../hotkeys";

interface IHotKeyProps {
  keyMap: string;
  description: string;
  onKeyDown?: HotKeyEventListener;
  onKeyUp?: HotKeyEventListener;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}

export const HotKey = memo<IHotKeyProps>(
  ({
    keyMap,
    onKeyDown,
    onKeyUp,
    description,
    ignoreFocusedElements,
    ignoreNamespace
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

    return null;
  }
);
