import React from "react";
import { storiesOf } from "@storybook/react";
import { State } from "@sambego/storybook-state";

import { DisableAllHotKeys } from "./disable-all-hot-keys";
import { HotKey } from "./hot-key";
import { HotkeysServiceContextProvider } from "../hotkeys";
import { useHighlighter } from "../utils/use-highlighter";

storiesOf("DisableAllHotKeys", module).add("default", () => {
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
          <DisableAllHotKeys />
          <HotKey
            keyMap="cmd+s"
            onKeyDown={onKeyDown("cmd+s")}
            onKeyUp={onKeyUp("cmd+s")}
          >
            {textHighlighterWrapper("cmd+s", "Press cmd+s(do not work)")}
          </HotKey>
        </HotkeysServiceContextProvider>
      )}
    </State>
  );
});
