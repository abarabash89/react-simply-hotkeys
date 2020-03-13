import { HotKeyListenerList } from "./hotkeys-listener-list";
import { keyCodeMap, keyMap, KeysNames } from "./key-codes";
import { HotKeyListener, IHotKeyListener, HotKeyEventTypes } from "./types";

const EventSpecialKeysMapping: [(event: KeyboardEvent) => boolean, number][] = [
  [(event: KeyboardEvent): boolean => event.metaKey, keyMap.cmd],
  [(event: KeyboardEvent): boolean => event.ctrlKey, keyMap.ctrl],
  [(event: KeyboardEvent): boolean => event.altKey, keyMap.alt],
  [(event: KeyboardEvent): boolean => event.shiftKey, keyMap.shift]
];

type ListenersStoreType = Map<string, HotKeyListenerList>;
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
  private config: IHotkeysServiceConfig;
  private listenersStore: Map<HotKeyEventTypes, ListenersStoreType> = new Map();
  private currentNamespace = "";

  constructor(userConfig: Partial<IHotkeysServiceConfig> = {}) {
    this.config = {
      ...DefaultHotkeysServiceConfig,
      ...userConfig
    };
    document.addEventListener("keydown", this.keyboardEventListener);
    document.addEventListener("keyup", this.keyboardEventListener);
  }

  private convertKeysToStoreKey(keys: string[] | string): string {
    if (Array.isArray(keys)) {
      return keys.join(this.config.keysSeparator);
    }
    return keys;
  }

  private findHotKeyListener(
    eventType: HotKeyEventTypes,
    keys: number[]
  ): IHotKeyListener | undefined {
    const keysNames = keys.reduce<KeysNames[]>((keysNames, key) => {
      keysNames.push(keyCodeMap[key]);
      return keysNames;
    }, []);
    const listenersStore = this.listenersStore.get(eventType);
    const listenerList = listenersStore?.get(
      this.convertKeysToStoreKey(keysNames)
    );
    return listenerList?.get(this.currentNamespace);
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

  private keyboardEventListener = (event: KeyboardEvent) => {
    if (this.config.ignoredKeyCodes.includes(event.keyCode)) {
      return;
    }

    const hotKeyListener = this.findHotKeyListener(
      event.type as HotKeyEventTypes,
      this.getKeysFromEvent(event)
    );
    if (!hotKeyListener) {
      return;
    }

    const ignoreHotKeyAction =
      !hotKeyListener.ignoreFocusedElements &&
      this.config.ignoredTagNames.includes(
        (event.target as HTMLElement).tagName
      );
    if (ignoreHotKeyAction) {
      return;
    }

    hotKeyListener.listener(event);
    event.preventDefault();
  };

  setCurrentNamespace(namespace = ""): HotkeysService {
    this.currentNamespace = namespace;
    return this;
  }
  getCurrentNamespace(): string {
    return this.currentNamespace;
  }

  add(
    hotkeys: string,
    listener: HotKeyListener,
    eventType: HotKeyEventTypes = "keydown",
    options: Partial<Omit<IHotKeyListener, "listener">> = {}
  ): HotkeysService {
    const storeKey = this.convertKeysToStoreKey(hotkeys);

    const listenersStore: ListenersStoreType =
      this.listenersStore.get(eventType) || new Map();
    const listenerList =
      listenersStore.get(storeKey) || new HotKeyListenerList();

    listenerList.add({
      listener,
      ignoreNamespace: options.ignoreNamespace || false,
      ignoreFocusedElements: options.ignoreFocusedElements || false,
      namespace: options.namespace || "",
      description: options.description || ""
    });

    this.listenersStore.set(
      eventType,
      listenersStore.set(storeKey, listenerList)
    );
    return this;
  }

  remove(
    hotkeys: string,
    listener: HotKeyListener,
    eventType: HotKeyEventTypes = "keydown",
    namespace = ""
  ): HotkeysService {
    const storeKey = this.convertKeysToStoreKey(hotkeys);

    const listenersStore = this.listenersStore.get(eventType);
    if (!listenersStore) {
      return this;
    }

    const listenerList = listenersStore.get(storeKey);
    if (listenerList) {
      listenerList.remove({ listener, namespace });
    }

    return this;
  }

  getRegisteredListeners() {
    return this.listenersStore;
  }

  // TODO: move this method to the hotkeys popup
  getHotkeysWithDescriptions(): IHotkeysPreview {
    return Array.from(this.listenersStore).reduce<IHotkeysPreview>(
      (hotkeysWithDescriptions, [, store]) => {
        const hotKeyList = Object.fromEntries(
          Array.from(store).filter(
            ([, listenerList]) =>
              listenerList.get(this.currentNamespace)?.description
          )
        );
        return Object.assign(hotkeysWithDescriptions, hotKeyList);
      },
      {}
    );
  }
}
