import { keyCodeMap, keyMap, specialKeys } from "./key-codes";
import { ListenerType, IGNORED_KEY_CODES, IGNORED_TAG_NAMES } from "./config";
import { HandlerList, IHandler } from "./handler-list";

interface IOptions {
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}
export const SEPARATOR = "+";
type EventType = "keyup" | "keydown";
type HotkeysStoreType = Map<string, HandlerList>;
interface IHotkeysPreview {
  [keymap: string]: string;
}

export class HotkeysService {
  private namespace = "";
  private store: Map<EventType, HotkeysStoreType> = new Map();
  private keys: Map<EventType, Set<number>> = new Map();

  constructor() {
    document.addEventListener("keydown", this.checkKeysAndFireListener);
    document.addEventListener("keyup", this.checkKeysAndFireListener);
  }

  /**
   * Prepare hotkeys string
   * @param {string[]|string} hotkeys
   * @returns {string}
   */
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

  /**
   * Checks event.keyCode and fires listener
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  private checkKeysAndFireListener = (event: KeyboardEvent): void => {
    if (IGNORED_KEY_CODES.includes(event.keyCode)) {
      return;
    }
    if (!this.keys.get(event.type as EventType)) {
      this.keys.set(event.type as EventType, new Set());
    }
    const keys: Set<number> = this.keys.get(event.type as EventType) as Set<
      number
    >;
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
  ): IHandler | null => {
    const result: string[] = [];
    keys.forEach((value: number) => result.push(keyCodeMap[value]));
    const key: string = this.prepareKey(result);
    const store = this.store.get(event.type as EventType);
    if (!store) {
      return null;
    }
    const handlerList: HandlerList | undefined = store.get(key);
    if (!handlerList) {
      return null;
    }
    const handler: IHandler | undefined = handlerList.get(this.namespace);
    if (!handler) {
      return null;
    }
    return handler;
  };

  /**
   * Set current namespace
   * @param {string|undefined} namespace
   * @returns {HotkeysService}
   */
  setNamespace(namespace = ""): HotkeysService {
    this.namespace = namespace;
    return this;
  }

  /**
   * Get current namespace
   * @returns {string}
   */
  getNamespace(): string {
    return this.namespace;
  }

  /**
   * Add hotkey listener to the store
   * @param {string} hotkeys
   * @param {ListenerType} listener
   * @param {EventType} eventType keydown or keyup
   * @param {IOptions} options contains description namespace and ignore namespace property
   * @returns {HotkeysService}
   */
  add(
    hotkeys: string,
    listener: ListenerType,
    eventType: EventType = "keydown",
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

  /**
   * Replace hotkey listener to the store
   * @param {string} hotkeys
   * @param {ListenerType} oldListener
   * @param {ListenerType} listener
   * @param {EventType} eventType keydown or keyup
   * @param {string|undefined} namespace
   * @returns {HotkeysService}
   */
  replaceListener(
    hotkeys: string,
    oldListener: ListenerType,
    listener: ListenerType,
    eventType: EventType = "keydown",
    namespace = ""
  ): HotkeysService {
    const key: string = this.prepareKey(hotkeys);
    const store = this.store.get(eventType) as HotkeysStoreType;
    if (!store) {
      return this;
    }
    if (!store.get(key)) {
      return this;
    }
    const list: HandlerList = store.get(key) as HandlerList;
    list.replace({ listener: oldListener, namespace }, { listener, namespace });
    return this;
  }

  /**
   * Removes listener from store
   * @param {string} hotkeys
   * @param {ListenerType} listener
   * @param {EventType} eventType keydown or keyup
   * @param {string} namespace
   * @returns {HotkeysService}
   */
  remove(
    hotkeys: string,
    listener: ListenerType,
    eventType: EventType = "keydown",
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

  /**
   * Returns list of hotkeys with description
   * @returns {IHotkeysPreview}
   */
  getHotkeysWithDescriptions(): IHotkeysPreview {
    const result: IHotkeysPreview = {};
    this.store.forEach((item: HotkeysStoreType) => {
      if (!item) {
        return;
      }
      item.forEach((list: HandlerList, keyMap: string) => {
        const handler: IHandler | undefined = list.get(this.namespace);
        if (!handler || !handler.description) {
          return;
        }
        result[keyMap] = handler.description;
      });
    });
    return result;
  }
}
