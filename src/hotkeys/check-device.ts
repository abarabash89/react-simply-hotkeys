import { detect } from "detect-browser";

const browser = detect();

export const IS_FIREFOX = "firefox" === browser?.name;
export const IS_WINDOWS = [
  "Windows 3.11",
  "Windows 95",
  "Windows 98",
  "Windows 2000",
  "Windows XP",
  "Windows Server 2003",
  "Windows Vista",
  "Windows 7",
  "Windows 8",
  "Windows 8.1",
  "Windows 10",
  "Windows ME"
].includes(browser?.os || "");
