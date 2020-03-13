import { HandlerList } from "./handler-list";
import { IHotKeyHandler } from "./types";

const listener = () => {};
const handler: IHotKeyHandler = {
  listener,
  description: "test",
  namespace: "namespace"
};
const handler2: IHotKeyHandler = {
  listener,
  description: "test",
  namespace: "namespace1"
};

const handler1: IHotKeyHandler = {
  listener: () => {},
  description: "test1"
};

describe("HandlerList", () => {
  let handlerList: HandlerList;
  beforeEach(() => (handlerList = new HandlerList()));

  it("should add handler to the list", () => {
    expect(handlerList.getLength() === 0).toBeTruthy();
    handlerList.add(handler);
    expect(handlerList.getLength() === 0).toBeFalsy();
  });

  it("should return last handler from the list", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    expect(handlerList.get()).toMatchObject(handler1);
  });

  it("should return handler with provided namespace", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    expect(handlerList.get(handler.namespace)).toMatchObject(handler);
  });

  it("should remove handler", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    handlerList.remove(handler1);
    expect(handlerList.get()).toMatchObject(handler);
  });
});
