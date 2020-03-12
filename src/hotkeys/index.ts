import { HotKeyListener as HotKeyListenerType } from "./types";
import { IS_FIREFOX, IS_WINDOWS } from "./check-device";

export const DEVICE = { IS_FIREFOX, IS_WINDOWS };

export type HotKeyListener = HotKeyListenerType;

export { HotkeysService } from "./hotkeys-service";
export { HotkeysServiceContext, HotkeysNamespaceContext } from "./context";
