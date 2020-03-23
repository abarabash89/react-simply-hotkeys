import { HotKeyEventListener as HotKeyEventListenerType } from "./types";

export type HotKeyEventListener = HotKeyEventListenerType;

export { HotkeysService } from "./hotkeys-service";
export {
  HotkeysServiceContext,
  HotkeysNamespaceContext,
  HotkeysServiceContextProvider
} from "./contexts";
