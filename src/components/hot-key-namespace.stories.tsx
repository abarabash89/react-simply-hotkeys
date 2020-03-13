import React from "react";
import { storiesOf } from "@storybook/react";
import { State } from "@sambego/storybook-state";

import { HotKeysNamespace } from "./hot-key-namespace";
import { HotKey } from "./hot-key";
import { HotkeysServiceContextProvider } from "../hotkeys";
import { useHighlighter } from "../utils/use-highlighter";

storiesOf("HotKeysNamespace", module).add("default", () => {
  const {
    store,
    onKeyDown,
    onKeyUp,
    textHighlighterWrapper
  } = useHighlighter();
  return (
    <State store={store}>
      {() => (
        <HotkeysServiceContextProvider>
          <HotKey
            keyMap="cmd+s"
            onKeyDown={onKeyDown("cmd+s")}
            onKeyUp={onKeyUp("cmd+s")}
          >
            {textHighlighterWrapper("cmd+s", "Press cmd+s(do not work)")}
          </HotKey>
          <br />
          <HotKeysNamespace name="namespace">
            <HotKey
              keyMap="cmd+a"
              onKeyDown={onKeyDown("cmd+a")}
              onKeyUp={onKeyUp("cmd+a")}
            >
              {textHighlighterWrapper("cmd+a", "Press cmd+a")}
            </HotKey>
          </HotKeysNamespace>
        </HotkeysServiceContextProvider>
      )}
    </State>
  );
});
