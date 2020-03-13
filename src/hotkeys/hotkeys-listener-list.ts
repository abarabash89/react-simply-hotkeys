import { IHotKeyListener, HotKeyEventListener } from "./types";

export interface IHotKeyListenerListFilterOptions {
  namespace?: IHotKeyListener["namespace"];
  eventType: IHotKeyListener["eventType"];
}

export class HotKeyListenerList {
  private list: IHotKeyListener[] = [];

  get({
    namespace = "",
    eventType
  }: IHotKeyListenerListFilterOptions): IHotKeyListener | undefined {
    const listeners = this.list.filter(listener => {
      const shouldCheckNamespace = namespace && !listener.ignoreNamespace;
      if (shouldCheckNamespace && namespace !== listener.namespace) {
        return false;
      }
      if (eventType && eventType !== listener.eventType) {
        return false;
      }
      return true;
    });
    return listeners[listeners.length - 1];
  }

  add(handler: IHotKeyListener): HotKeyListenerList {
    this.list.push(handler);
    return this;
  }

  remove(
    listener: HotKeyEventListener,
    { namespace = "", eventType }: IHotKeyListenerListFilterOptions
  ): HotKeyListenerList {
    this.list = this.list.filter(
      l =>
        eventType !== l.eventType ||
        l.listener !== listener ||
        l.namespace !== namespace
    );
    return this;
  }

  getLength(): number {
    return this.list.length;
  }
}
