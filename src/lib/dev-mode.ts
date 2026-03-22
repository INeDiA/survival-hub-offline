export function isLovablePreview() {
  if (typeof window === "undefined") return false;

  const { hostname } = window.location;
  return hostname.endsWith(".lovable.app") && hostname.includes("preview--");
}

export function isDevOrPreview() {
  return import.meta.env.DEV || isLovablePreview();
}
