import { createContext } from "react";

import { HotkeysService } from "./hotkeys-service";

export const HotkeysServiceContext = createContext<HotkeysService | null>(null);
export const HotkeysNamespaceContext = createContext("");
