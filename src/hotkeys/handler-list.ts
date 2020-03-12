import { IHotKeyHandler } from "./types";

export class HandlerList {
  private list: IHotKeyHandler[] = [];

  get(namespace?: string): IHotKeyHandler | undefined {
    if (namespace) {
      const handlers = this.list.filter(
        handler => handler.namespace === namespace || handler.ignoreNamespace
      );
      return handlers[handlers.length - 1];
    }
    return this.list[this.list.length - 1];
  }

  add(handler: IHotKeyHandler): HandlerList {
    this.list.push(handler);
    return this;
  }

  remove(handler: IHotKeyHandler): HandlerList {
    const index = this.list.findIndex(
      h => h.listener === handler.listener && h.namespace === handler.namespace
    );
    if (index > -1) {
      this.list.splice(index, 1);
    }
    return this;
  }

  clear(): HandlerList {
    this.list = [];
    return this;
  }

  isEmpty(): boolean {
    return !this.list.length;
  }
}
