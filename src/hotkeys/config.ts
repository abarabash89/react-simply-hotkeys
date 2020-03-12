import { keyMap } from "./key-codes";

export type ListenerType = (event: KeyboardEvent) => void;
export const IGNORED_KEY_CODES: number[] = [
  keyMap.shift,
  keyMap.cmd,
  keyMap.ctrl,
  keyMap.alt
];
export const IGNORED_TAG_NAMES: string[] = ["INPUT", "TEXTAREA"];
