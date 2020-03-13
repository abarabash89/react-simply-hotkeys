import { HotKeyListenerList } from "./hotkeys-listener-list";
import { IHotKeyListener } from "./types";

const listener = () => {};

const hotKeyListener: IHotKeyListener = {
  listener,
  description: "test",
  namespace: "namespace"
};
const hotKeyListener1: IHotKeyListener = {
  listener: () => {},
  description: "test1"
};

describe("HotKeyListenerList", () => {
  let handlerList: HotKeyListenerList;
  beforeEach(() => (handlerList = new HotKeyListenerList()));

  it("should add handler to the list", () => {
    expect(handlerList.getLength() === 0).toBeTruthy();
    handlerList.add(hotKeyListener);
    expect(handlerList.getLength() === 0).toBeFalsy();
  });

  it("should return last handler from the list", () => {
    handlerList.add(hotKeyListener);
    handlerList.add(hotKeyListener1);
    expect(handlerList.get()).toMatchObject(hotKeyListener1);
  });

  it("should return handler with provided namespace", () => {
    handlerList.add(hotKeyListener);
    handlerList.add(hotKeyListener1);
    expect(handlerList.get("namespace")).toMatchObject(hotKeyListener);
  });

  it("should remove handler", () => {
    handlerList.add(hotKeyListener);
    handlerList.add(hotKeyListener1);
    handlerList.remove(hotKeyListener1);
    expect(handlerList.get()).toMatchObject(hotKeyListener);
  });
});
