import { HotKeyListenerList } from "./hotkeys-listener-list";
import { IHotKeyListener } from "./types";

const listener = () => {};

const hotKeyListener: IHotKeyListener = {
  listener,
  description: "test",
  namespace: "namespace",
  ignoreNamespace: false,
  ignoreFocusedElements: false
};
const hotKeyListener1: IHotKeyListener = {
  listener: () => {},
  description: "test1",
  namespace: "",
  ignoreNamespace: false,
  ignoreFocusedElements: false
};

describe("HotKeyListenerList", () => {
  let hkListenerList: HotKeyListenerList;
  beforeEach(() => (hkListenerList = new HotKeyListenerList()));

  it("should add listener to the list", () => {
    expect(hkListenerList.getLength() === 0).toBeTruthy();
    hkListenerList.add(hotKeyListener);
    expect(hkListenerList.getLength() === 0).toBeFalsy();
  });

  it("should return last listener from the list", () => {
    hkListenerList.add(hotKeyListener);
    hkListenerList.add(hotKeyListener1);
    expect(hkListenerList.get()).toMatchObject(hotKeyListener1);
  });

  it("should return listener with provided namespace", () => {
    hkListenerList.add(hotKeyListener);
    hkListenerList.add(hotKeyListener1);
    expect(hkListenerList.get("namespace")).toMatchObject(hotKeyListener);
  });

  it("should remove listener", () => {
    hkListenerList.add(hotKeyListener);
    hkListenerList.add(hotKeyListener1);
    hkListenerList.remove(hotKeyListener1.listener, hotKeyListener1.namespace);
    expect(hkListenerList.get()).toMatchObject(hotKeyListener);
    expect(hkListenerList.getLength() === 1).toBeTruthy();
  });
});
