export type Route = "home" | "archive" | "version";

export interface RouteMatch {
  name: Route;
  versionId?: string;
}

export function resolveRoute(pathname: string): RouteMatch {
  const baseSegments = import.meta.env.BASE_URL.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);
  const routeSegments = pathSegments.slice(baseSegments.length);
  const normalized = `/${routeSegments.join("/")}/`;

  if (normalized === "/archive/") return { name: "archive" };

  const versionMatch = normalized.match(/^\/(v\d+\.\d+)\/$/);
  if (versionMatch) return { name: "version", versionId: versionMatch[1] };

  return { name: "home" };
}
