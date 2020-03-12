export function checkOS(): "windows" | "mac/ios" | "unix" | "linux" {
  if (window.navigator.userAgent.includes("Mac")) return "mac/ios";
  if (window.navigator.userAgent.includes("X11")) return "unix";
  if (window.navigator.userAgent.includes("Linux")) return "linux";
  return "windows";
}
