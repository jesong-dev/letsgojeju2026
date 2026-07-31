const basePath = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function sitePath(path: string): string {
  return `${basePath}${path.replace(/^\/+/, "")}`;
}
