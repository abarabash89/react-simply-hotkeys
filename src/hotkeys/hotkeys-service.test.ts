import { HotkeysService } from "./hotkeys-service";

describe("HotkeysService", () => {
  let hkService: HotkeysService;
  beforeEach(() => (hkService = new HotkeysService()));

  it("should add listener", () => {
    const listener = () => {};
    hkService.add("cmd+a", listener);
    expect(
      hkService
        .getRegisteredListeners()
        .get("cmd+a")!
        .getLength()
    ).toEqual(1);
  });

  it("should remove listener", () => {
    const listener = () => {};

    hkService.add("cmd+a", listener, { eventType: "keyup" });
    expect(hkService.getRegisteredListeners().size).toEqual(1);

    hkService.remove("cmd+a", listener, { eventType: "keyup" });
    expect(
      hkService
        .getRegisteredListeners()
        .get("cmd+a")!
        .getLength()
    ).toEqual(0);
  });

  it("should not remove listener", () => {
    const listener = () => {};

    hkService.add("cmd+a", listener, { eventType: "keyup" });
    expect(hkService.getRegisteredListeners().size).toEqual(1);

    hkService.remove("cmd+a", listener, { eventType: "keydown" });
    expect(
      hkService
        .getRegisteredListeners()
        .get("cmd+a")!
        .getLength()
    ).toEqual(1);
  });
});
