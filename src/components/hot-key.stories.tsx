import React from "react";
import { storiesOf } from "@storybook/react";
import { State } from "@sambego/storybook-state";

import { HotKey } from "./hot-key";
import { HotkeysServiceContextProvider } from "../hotkeys";
import { useHighlighter } from "../utils/use-highlighter";

storiesOf("HotKey", module).add("default", () => {
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
            keyMap="cmd+a"
            onKeyDown={onKeyDown("cmd+a")}
            onKeyUp={onKeyUp("cmd+a")}
          >
            {textHighlighterWrapper("cmd+a", "Press cmd+a")}
          </HotKey>
          <br />
          <HotKey
            keyMap="cmd+s"
            onKeyDown={onKeyDown("cmd+s")}
            onKeyUp={onKeyUp("cmd+s")}
          >
            {textHighlighterWrapper("cmd+s", "Press cmd+s")}
          </HotKey>
        </HotkeysServiceContextProvider>
      )}
    </State>
  );
});
