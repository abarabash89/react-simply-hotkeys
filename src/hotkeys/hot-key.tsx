import { memo, useContext, useEffect } from "react";

import { ListenerType } from "./config";
import { HotkeysNamespaceContext } from "./hot-key-namespace";
import { HotkeysServiceContext } from "./context";

interface IHotKeyProps {
  keyMap: string;
  description: string;
  onKeyDown?: ListenerType;
  onKeyUp?: ListenerType;
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
      onKeyDown && service.add(keyMap, onKeyDown, "keydown", options);
      onKeyUp && service.add(keyMap, onKeyUp, "keyup", options);
      return () => {
        onKeyDown && service.remove(keyMap, onKeyDown, "keydown", namespace);
        onKeyUp && service.remove(keyMap, onKeyUp, "keyup", namespace);
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
