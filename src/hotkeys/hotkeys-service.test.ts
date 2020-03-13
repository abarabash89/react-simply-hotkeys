import { HotkeysService } from "./hotkeys-service";

describe("HotkeysService", () => {
  let hkService: HotkeysService;
  beforeEach(() => (hkService = new HotkeysService()));

  it("should add listener", () => {
    const listener = () => {};
    hkService.add("cmd+a", listener);
    expect(hkService.getRegisteredListeners().size).toEqual(1);
  });

  it("should remove listener", () => {
    const listener = () => {};
    hkService.add("cmd+a", listener);
    expect(hkService.getRegisteredListeners().size).toEqual(1);
    hkService.remove("cmd+a", listener);
    expect(
      hkService
        .getRegisteredListeners()
        ?.get("keydown")
        ?.get("cmd+a")
        ?.getLength() || 0
    ).toEqual(0);
  });
});
