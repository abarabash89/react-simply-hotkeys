export type HotKeyListener = (event?: KeyboardEvent) => void;

export type HotKeyEventTypes = "keyup" | "keydown";

export interface IHotKeyListener {
  listener: HotKeyListener;
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}
