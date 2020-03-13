import { IHotKeyListener, HotKeyEventListener } from "./types";

export class HotKeyListenerList {
  private list: IHotKeyListener[] = [];

  get(namespace?: string): IHotKeyListener | undefined {
    if (!namespace) {
      return this.list[this.list.length - 1];
    }
    const listeners = this.list.filter(
      listener => listener.namespace === namespace || listener.ignoreNamespace
    );
    return listeners[listeners.length - 1];
  }

  add(handler: IHotKeyListener): HotKeyListenerList {
    this.list.push(handler);
    return this;
  }

  remove(listener: HotKeyEventListener, namespace = ""): HotKeyListenerList {
    this.list = this.list.filter(
      l => l.listener !== listener || l.namespace !== namespace
    );
    return this;
  }

  getLength() {
    return this.list.length;
  }
}
