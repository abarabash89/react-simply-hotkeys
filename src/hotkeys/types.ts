export type HotKeyEventListener = (event?: KeyboardEvent) => void;

export type HotKeyEventTypes = "keyup" | "keydown";

export interface IHotKeyListener {
  listener: HotKeyEventListener;
  description: string;
  namespace: string;
  ignoreNamespace: boolean;
  ignoreFocusedElements: boolean;
  eventType: HotKeyEventTypes;
}
