import React, { ReactNode } from "react";
import { action } from "@storybook/addon-actions";
import { Store } from "@sambego/storybook-state";

export const useHighlighter = () => {
  const store = new Store<{ highlightedHotKey: string | undefined }>({
    highlightedHotKey: undefined
  });

  const onKeyDown = (hotkey: string) => (event?: KeyboardEvent) => {
    action(`onKeyDown: ${hotkey}`)(event);
    store.set({ highlightedHotKey: hotkey });
  };

  const onKeyUp = (hotkey: string) => (event?: KeyboardEvent) => {
    action(`onKeyUp: ${hotkey}`)(event);
    store.set({ highlightedHotKey: undefined });
  };

  const textHighlighterWrapper = (hotkey: string, text: string): ReactNode => {
    if (hotkey === store.get("highlightedHotKey")) {
      return <span style={{ color: "red" }}>{text}</span>;
    }
    return text;
  };

  return { store, onKeyDown, onKeyUp, textHighlighterWrapper };
};
