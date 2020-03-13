import React, { ReactNode } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { State, Store } from "@sambego/storybook-state";

import { HotKey } from "./hot-key";
import { HotkeysServiceContextProvider } from "../hotkeys";

const useTextHighlighter = () => {
  const store = new Store<{ textIsHighlight: boolean }>({
    textIsHighlight: false
  });
  return {
    store,
    showHighlighting: () => store.set({ textIsHighlight: true }),
    hideHighlighting: () => store.set({ textIsHighlight: false }),
    textHighlighterWrapper: (text: string): ReactNode => {
      if (store.get("textIsHighlight")) {
        return <span style={{ color: "red" }}>{text}</span>;
      }
      return text;
    }
  };
};

storiesOf("HotKey", module).add("cmd+a", () => {
  const {
    store,
    showHighlighting,
    hideHighlighting,
    textHighlighterWrapper
  } = useTextHighlighter();
  const keyDownAction = action("onKeyDown: cmd+a");
  const keyUpAction = action("onKeyUp: cmd+a");
  return (
    <HotkeysServiceContextProvider>
      <State store={store}>
        {state => (
          <>
            <HotKey
              keyMap="cmd+a"
              onKeyDown={event => {
                keyDownAction(event);
                showHighlighting();
              }}
              onKeyUp={event => {
                keyUpAction(event);
                hideHighlighting();
              }}
            />
            {textHighlighterWrapper("Press cmd+a")}
          </>
        )}
      </State>
    </HotkeysServiceContextProvider>
  );
});
