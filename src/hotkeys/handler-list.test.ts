import { HandlerList, IHandler } from "./handler-list";

const listener = () => {};
const handler: IHandler = {
  listener,
  description: "test",
  namespace: "namespace"
};
const handler2: IHandler = {
  listener,
  description: "test",
  namespace: "namespace1"
};

const handler1: IHandler = {
  listener: () => {},
  description: "test1"
};

describe("HandlerList", () => {
  let handlerList: HandlerList;
  beforeEach(() => (handlerList = new HandlerList()));

  it("add method should add handler to the handler list", () => {
    expect(handlerList.isEmpty()).toBeTruthy();
    handlerList.add(handler);
    expect(handlerList.isEmpty()).toBeFalsy();
  });

  it("get should return last item in the list", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    expect(handlerList.get()).toMatchObject(handler1);
  });

  it("get should return item with namespace", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    expect(handlerList.get(handler.namespace)).toMatchObject(handler);
  });

  it("clear method should clear HandlerList", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    handlerList.clear();
    expect(handlerList.isEmpty()).toBeTruthy();
  });

  it("remove method should remove listener", () => {
    handlerList.add(handler);
    handlerList.add(handler1);
    handlerList.remove(handler1);
    expect(handlerList.get()).toMatchObject(handler);
  });

  it("remove method should remove listener with namespace", () => {
    handlerList.add(handler2);
    handlerList.add(handler);
    handlerList.remove(handler2);
    expect(handlerList.get()).toMatchObject(handler);
  });

  it("replace method should replace on listener to another", () => {
    handlerList.add(handler2);
    handlerList.add(handler);
    const newHandler = { ...handler, listener: () => {} };
    handlerList.replace(handler, newHandler);
    expect(handlerList.get()).toMatchObject(newHandler);
  });
});
