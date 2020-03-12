import { keyCodeMap, keyMap } from "./key-codes";
import { HandlerList } from "./handler-list";
import { HotKeyListener, IHotKeyHandler, HotKeyEventTypes } from "./types";

interface IOptions {
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}
export const SEPARATOR = "+";
type HotkeysStoreType = Map<string, HandlerList>;
interface IHotkeysPreview {
  [keymap: string]: string;
}

const specialKeys = ["cmd", "ctrl", "shift", "alt"];
export const IGNORED_KEY_CODES = [
  keyMap.shift,
  keyMap.cmd,
  keyMap.ctrl,
  keyMap.alt
];
export const IGNORED_TAG_NAMES = ["INPUT", "TEXTAREA"];

export class HotkeysService {
  private namespace = "";
  private store: Map<HotKeyEventTypes, HotkeysStoreType> = new Map();
  private keys: Map<HotKeyEventTypes, Set<number>> = new Map();

  constructor() {
    document.addEventListener("keydown", this.checkKeysAndFireListener);
    document.addEventListener("keyup", this.checkKeysAndFireListener);
  }

  private prepareKey(hotkeys: string[] | string): string {
    const temp: string[] = Array.isArray(hotkeys)
      ? hotkeys
      : (hotkeys as string).toLocaleLowerCase().split(SEPARATOR);
    let result = "";
    specialKeys.forEach((key: string) => {
      const index: number = temp.indexOf(key);
      if (index === -1) {
        return;
      }
      temp.splice(index, 1);
      result += `${result.length ? SEPARATOR : ""}${key}`;
    });
    temp.forEach(
      (key: string): string =>
        (result += `${result.length ? SEPARATOR : ""}${key}`)
    );
    return result;
  }

  private checkKeysAndFireListener = (event: KeyboardEvent): void => {
    if (IGNORED_KEY_CODES.includes(event.keyCode)) {
      return;
    }
    if (!this.keys.get(event.type as HotKeyEventTypes)) {
      this.keys.set(event.type as HotKeyEventTypes, new Set());
    }
    const keys: Set<number> = this.keys.get(
      event.type as HotKeyEventTypes
    ) as Set<number>;
    keys.clear();
    keys[event.metaKey ? "add" : "delete"](keyMap.cmd);
    keys[event.ctrlKey ? "add" : "delete"](keyMap.ctrl);
    keys[event.altKey ? "add" : "delete"](keyMap.alt);
    keys[event.shiftKey ? "add" : "delete"](keyMap.shift);
    keys.add(event.keyCode);
    const handler = this.checkHotKeys(keys, event);
    if (!handler) {
      return;
    }
    if (
      !handler.ignoreFocusedElements &&
      IGNORED_TAG_NAMES.includes((event.target as HTMLElement).tagName)
    ) {
      return;
    }
    handler.listener(event);
    event.preventDefault();
  };

  private checkHotKeys = (
    keys: Set<number>,
    event: KeyboardEvent
  ): IHotKeyHandler | null => {
    const result: string[] = [];
    keys.forEach((value: number) => result.push(keyCodeMap[value]));
    const key: string = this.prepareKey(result);
    const store = this.store.get(event.type as HotKeyEventTypes);
    if (!store) {
      return null;
    }
    const handlerList: HandlerList | undefined = store.get(key);
    if (!handlerList) {
      return null;
    }
    const handler: IHotKeyHandler | undefined = handlerList.get(this.namespace);
    if (!handler) {
      return null;
    }
    return handler;
  };

  setNamespace(namespace = ""): HotkeysService {
    this.namespace = namespace;
    return this;
  }

  getNamespace(): string {
    return this.namespace;
  }

  add(
    hotkeys: string,
    listener: HotKeyListener,
    eventType: HotKeyEventTypes = "keydown",
    options: IOptions = {}
  ): HotkeysService {
    const key: string = this.prepareKey(hotkeys);
    if (!this.store.get(eventType)) {
      this.store.set(eventType, new Map());
    }
    const store = this.store.get(eventType) as HotkeysStoreType;
    if (!store.get(key)) {
      store.set(key, new HandlerList());
    }
    const list: HandlerList = store.get(key) as HandlerList;
    list.add({
      listener,
      ignoreNamespace: options.ignoreNamespace || false,
      ignoreFocusedElements: options.ignoreFocusedElements || false,
      namespace: options.namespace || "",
      description: options.description || ""
    });
    return this;
  }

  remove(
    hotkeys: string,
    listener: HotKeyListener,
    eventType: HotKeyEventTypes = "keydown",
    namespace = ""
  ): HotkeysService {
    const key: string = this.prepareKey(hotkeys);
    const store = this.store.get(eventType);
    if (!store) {
      return this;
    }
    const list: HandlerList | undefined = store.get(key);
    if (list) {
      list.remove({ listener, namespace });
    }
    return this;
  }

  getHotkeysWithDescriptions(): IHotkeysPreview {
    const result: IHotkeysPreview = {};
    this.store.forEach(item => {
      if (!item) {
        return;
      }
      item.forEach((list, keyMap) => {
        const handler = list.get(this.namespace);
        if (!handler || !handler.description) {
          return;
        }
        result[keyMap] = handler.description;
      });
    });
    return result;
  }
}
