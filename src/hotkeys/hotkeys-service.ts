import {
  HotKeyListenerList,
  IHotKeyListenerListFilterOptions
} from "./hotkeys-listener-list";
import { keyCodeMap, keyMap, KeysNames } from "./key-codes";
import {
  HotKeyEventListener,
  IHotKeyListener,
  HotKeyEventTypes
} from "./types";

const EventSpecialKeysMapping: [(event: KeyboardEvent) => boolean, number][] = [
  [(event: KeyboardEvent): boolean => event.metaKey, keyMap.cmd],
  [(event: KeyboardEvent): boolean => event.ctrlKey, keyMap.ctrl],
  [(event: KeyboardEvent): boolean => event.altKey, keyMap.alt],
  [(event: KeyboardEvent): boolean => event.shiftKey, keyMap.shift]
];

type ListenersStoreType = Map<string, HotKeyListenerList>;

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
  private listenersStore: ListenersStoreType = new Map();
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
    keys: number[],
    eventType: HotKeyEventTypes
  ): IHotKeyListener | undefined {
    const keysNames = keys.reduce<KeysNames[]>((keysNames, key) => {
      keysNames.push(keyCodeMap[key]);
      return keysNames;
    }, []);
    const listenerList = this.listenersStore.get(
      this.convertKeysToStoreKey(keysNames)
    );
    return listenerList?.get({ eventType, namespace: this.currentNamespace });
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
      this.getKeysFromEvent(event),
      event.type as HotKeyEventTypes
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
    listener: HotKeyEventListener,
    {
      eventType = "keydown",
      ignoreNamespace = false,
      ignoreFocusedElements = false,
      namespace = "",
      description = ""
    }: Partial<Omit<IHotKeyListener, "listener">> = {}
  ): HotkeysService {
    const storeKey = this.convertKeysToStoreKey(hotkeys);

    const hotKeyListenerList =
      this.listenersStore.get(storeKey) || new HotKeyListenerList();
    this.listenersStore.set(
      storeKey,
      hotKeyListenerList.add({
        listener,
        eventType,
        ignoreNamespace,
        ignoreFocusedElements,
        namespace,
        description
      })
    );

    return this;
  }

  remove(
    hotkeys: string,
    listener: HotKeyEventListener,
    options: IHotKeyListenerListFilterOptions
  ): HotkeysService {
    const storeKey = this.convertKeysToStoreKey(hotkeys);

    const hotKeyListenerList = this.listenersStore.get(storeKey);
    if (!hotKeyListenerList) {
      return this;
    }

    this.listenersStore.set(
      storeKey,
      hotKeyListenerList.remove(listener, options)
    );

    return this;
  }

  getRegisteredListeners() {
    return this.listenersStore;
  }
}
