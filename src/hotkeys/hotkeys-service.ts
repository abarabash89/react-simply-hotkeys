import { HandlerList } from "./handler-list";
import { keyCodeMap, keyMap, KeysNames } from "./key-codes";
import { HotKeyListener, IHotKeyHandler, HotKeyEventTypes } from "./types";

const EventSpecialKeysMapping: [(event: KeyboardEvent) => boolean, number][] = [
  [(event: KeyboardEvent): boolean => event.metaKey, keyMap.cmd],
  [(event: KeyboardEvent): boolean => event.ctrlKey, keyMap.ctrl],
  [(event: KeyboardEvent): boolean => event.altKey, keyMap.alt],
  [(event: KeyboardEvent): boolean => event.shiftKey, keyMap.shift]
];

interface IHandlerOptions {
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}
type HotkeysStoreType = Map<string, HandlerList>;
interface IHotkeysPreview {
  [keymap: string]: string;
}

interface IHotkeysServiceConfig {
  ignoredKeyCodes: number[];
  ignoredTagNames: string[];
  keysSeparator: string;
}
const DefaultHotkeysServiceConfig: IHotkeysServiceConfig = {
  ignoredKeyCodes: [keyMap.shift, keyMap.cmd, keyMap.ctrl, keyMap.alt],
  ignoredTagNames: ["INPUT", "TEXTAREA"],
  keysSeparator: "+"
};

export class HotkeysService {
  private config: IHotkeysServiceConfig = DefaultHotkeysServiceConfig;
  private handlerStore: Map<HotKeyEventTypes, HotkeysStoreType> = new Map();
  private currentNamespace = "";

  constructor(userConfig: Partial<IHotkeysServiceConfig> = {}) {
    this.config = {
      ...DefaultHotkeysServiceConfig,
      ...userConfig
    };
    document.addEventListener("keydown", this.checkKeysAndFireListener);
    document.addEventListener("keyup", this.checkKeysAndFireListener);
  }

  private convertToStoreKey(keys: string[] | string): string {
    if (Array.isArray(keys)) {
      return keys.join(this.config.keysSeparator);
    }
    return keys;
  }

  private findHandler(
    eventType: HotKeyEventTypes,
    keys: number[]
  ): IHotKeyHandler | undefined {
    const keysNames = keys.reduce<KeysNames[]>((keysNames, key) => {
      keysNames.push(keyCodeMap[key]);
      return keysNames;
    }, []);
    const handlerStore = this.handlerStore.get(eventType);
    const handlerList = handlerStore?.get(this.convertToStoreKey(keysNames));
    return handlerList?.get(this.currentNamespace);
  }

  private getKeysFromEvent(event: KeyboardEvent): number[] {
    const keys = EventSpecialKeysMapping.reduce<number[]>(
      (keys, [isPressed, key]) => {
        isPressed(event) && keys.push(key);
        return keys;
      },
      []
    );
    keys.push(event.keyCode);
    return keys;
  }

  private checkKeysAndFireListener = (event: KeyboardEvent) => {
    if (this.config.ignoredKeyCodes.includes(event.keyCode)) {
      return;
    }

    const handler = this.findHandler(
      event.type as HotKeyEventTypes,
      this.getKeysFromEvent(event)
    );
    if (!handler) {
      return;
    }

    const ignoreHotKeyAction =
      !handler.ignoreFocusedElements &&
      this.config.ignoredTagNames.includes(
        (event.target as HTMLElement).tagName
      );
    if (ignoreHotKeyAction) {
      return;
    }

    handler.listener(event);
    event.preventDefault();
  };

  setCurrentNamespace(namespace = ""): HotkeysService {
    this.currentNamespace = namespace;
    return this;
  }

  getCurrentNamespace() {
    return this.currentNamespace;
  }

  add(
    hotkeys: string,
    listener: HotKeyListener,
    eventType: HotKeyEventTypes = "keydown",
    options: IHandlerOptions = {}
  ): HotkeysService {
    const key = this.convertToStoreKey(hotkeys);
    if (!this.handlerStore.get(eventType)) {
      this.handlerStore.set(eventType, new Map());
    }
    const handlerStore = this.handlerStore.get(eventType) as HotkeysStoreType;
    if (!handlerStore.get(key)) {
      handlerStore.set(key, new HandlerList());
    }
    const list: HandlerList = handlerStore.get(key) as HandlerList;
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
    const key = this.convertToStoreKey(hotkeys);
    const handlerStore = this.handlerStore.get(eventType);
    if (!handlerStore) {
      return this;
    }
    const list = handlerStore.get(key);
    if (list) {
      list.remove({ listener, namespace });
    }
    return this;
  }

  getHotkeysWithDescriptions(): IHotkeysPreview {
    const result: IHotkeysPreview = {};
    this.handlerStore.forEach(item => {
      if (!item) {
        return;
      }
      item.forEach((list, keyMap) => {
        const handler = list.get(this.currentNamespace);
        if (!handler || !handler.description) {
          return;
        }
        result[keyMap] = handler.description;
      });
    });
    return result;
  }
}
