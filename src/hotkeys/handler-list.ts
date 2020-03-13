import { IHotKeyHandler } from "./types";

export class HandlerList {
  private list: IHotKeyHandler[] = [];

  get(namespace?: string): IHotKeyHandler | undefined {
    if (!namespace) {
      return this.list[this.list.length - 1];
    }
    const handlers = this.list.filter(
      handler => handler.namespace === namespace || handler.ignoreNamespace
    );
    return handlers[handlers.length - 1];
  }

  add(handler: IHotKeyHandler): HandlerList {
    this.list.push(handler);
    return this;
  }

  remove({ listener, namespace }: IHotKeyHandler): HandlerList {
    const index = this.list.findIndex(
      handler =>
        handler.listener === listener && handler.namespace === namespace
    );
    if (index > -1) {
      this.list.splice(index, 1);
    }
    return this;
  }

  getLength() {
    return this.list.length;
  }
}
