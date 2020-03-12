import { IHotKeyHandler } from "./types";

export class HandlerList {
  private list: IHotKeyHandler[] = [];

  /**
   * Get last Handler
   * @param {string} namespace
   * @returns {IHotKeyHandler|undefined}
   */
  get(namespace?: string): IHotKeyHandler | undefined {
    if (namespace) {
      const handlers: IHotKeyHandler[] = this.list.filter(
        (handler: IHotKeyHandler) =>
          handler.namespace === namespace || handler.ignoreNamespace
      );
      return handlers[handlers.length - 1];
    }
    return this.list[this.list.length - 1];
  }

  /**
   * Add data to list
   * @param {IHotKeyHandler} handler that contains in the list
   * @returns {HandlerList}
   */
  add(handler: IHotKeyHandler): HandlerList {
    this.list.push(handler);
    return this;
  }

  /**
   * Remove data from list
   * @param {IHotKeyHandler} handler that contains in the list
   * @returns {HandlerList}
   */
  remove(handler: IHotKeyHandler): HandlerList {
    const index: number = this.list.findIndex(
      (h: IHotKeyHandler) =>
        h.listener === handler.listener && h.namespace === handler.namespace
    );
    if (index > -1) {
      this.list.splice(index, 1);
    }
    return this;
  }

  /**
   * Clear list
   * @returns {HandlerList}
   */
  clear(): HandlerList {
    this.list = [];
    return this;
  }

  /**
   * Check is empty list
   */
  isEmpty(): boolean {
    return !this.list.length;
  }
}
