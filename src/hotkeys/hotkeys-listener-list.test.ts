import { HotKeyListenerList } from "./hotkeys-listener-list";
import { IHotKeyListener } from "./types";

const hotKeyListener1: IHotKeyListener = {
  listener: () => {},
  description: "test",
  namespace: "namespace",
  eventType: "keydown",
  ignoreNamespace: false,
  ignoreFocusedElements: false
};
const hotKeyListener2: IHotKeyListener = {
  listener: () => {},
  description: "test1",
  namespace: "",
  eventType: "keyup",
  ignoreNamespace: false,
  ignoreFocusedElements: false
};

describe("HotKeyListenerList", () => {
  let hkListenerList: HotKeyListenerList;
  beforeEach(() => (hkListenerList = new HotKeyListenerList()));

  it("should add listener to the list", () => {
    expect(hkListenerList.getLength() === 0).toBeTruthy();
    hkListenerList.add(hotKeyListener1);
    expect(hkListenerList.getLength() === 0).toBeFalsy();
  });

  it("should return hotKeyListener2", () => {
    hkListenerList.add(hotKeyListener1);
    hkListenerList.add(hotKeyListener2);
    expect(hkListenerList.get({ eventType: "keyup" })).toMatchObject(
      hotKeyListener2
    );
  });

  it("should return hotKeyListener", () => {
    hkListenerList.add(hotKeyListener1);
    hkListenerList.add(hotKeyListener2);
    expect(
      hkListenerList.get({ namespace: "namespace", eventType: "keydown" })
    ).toMatchObject(hotKeyListener1);
  });

  it("should remove listener", () => {
    hkListenerList.add(hotKeyListener1);
    hkListenerList.add(hotKeyListener2);

    hkListenerList.remove(hotKeyListener2.listener, {
      eventType: "keyup"
    });

    expect(hkListenerList.get({ eventType: "keyup" })).toEqual(undefined);
    expect(hkListenerList.getLength() === 1).toBeTruthy();
  });

  it("should remove listener if eventType is not correct", () => {
    hkListenerList.add(hotKeyListener1);
    hkListenerList.add(hotKeyListener2);
    hkListenerList.remove(hotKeyListener2.listener, {
      namespace: "namespace",
      eventType: "keyup"
    });
    expect(hkListenerList.getLength() === 2).toBeTruthy();
  });
});
