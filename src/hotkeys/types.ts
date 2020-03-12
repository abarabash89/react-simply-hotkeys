export type HotKeyListener = (event?: KeyboardEvent) => void;

export type HotKeyEventTypes = "keyup" | "keydown";

export interface IHotKeyHandler {
  listener: HotKeyListener;
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}
