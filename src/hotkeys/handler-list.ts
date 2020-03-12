import { Listener } from "./types";

export interface IHandler {
  listener: Listener;
  description?: string;
  namespace?: string;
  ignoreNamespace?: boolean;
  ignoreFocusedElements?: boolean;
}

export class HandlerList {
  private list: IHandler[] = [];

  /**
   * Get last Handler
   * @param {string} namespace
   * @returns {IHandler|undefined}
   */
  get(namespace?: string): IHandler | undefined {
    if (namespace) {
      const handlers: IHandler[] = this.list.filter(
        (handler: IHandler) =>
          handler.namespace === namespace || handler.ignoreNamespace
      );
      return handlers[handlers.length - 1];
    }
    return this.list[this.list.length - 1];
  }

  /**
   * Add data to list
   * @param {IHandler} handler that contains in the list
   * @returns {HandlerList}
   */
  add(handler: IHandler): HandlerList {
    this.list.push(handler);
    return this;
  }

  /**
   * Replace handler to new
   * @param {IHandler} oldHandler that will be replaced
   * @param {IHandler} newHandler
   * @returns {HandlerList}
   */
  replace(oldHandler: IHandler, newHandler: IHandler): HandlerList {
    const index: number = this.list.findIndex(
      (h: IHandler) =>
        h.listener === oldHandler.listener &&
        h.namespace === oldHandler.namespace
    );
    if (index > -1) {
      this.list[index] = newHandler;
    }
    return this;
  }

  /**
   * Remove data from list
   * @param {IHandler} handler that contains in the list
   * @returns {HandlerList}
   */
  remove(handler: IHandler): HandlerList {
    const index: number = this.list.findIndex(
      (h: IHandler) =>
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
