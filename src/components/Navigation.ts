import type { JejuVersion } from "../core/types";
import { getVersionNeighbors } from "../core/version-registry";
import { sitePath } from "../core/paths";

function navLink(label: string, version: JejuVersion, direction: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = `version-navigation__link version-navigation__link--${direction}`;
  link.href = version.path;
  link.innerHTML = `<span>${label}</span><strong>${version.id} · ${version.title}</strong>`;
  return link;
}

export function Navigation(versionId: string): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "version-navigation";
  nav.setAttribute("aria-label", "버전 탐색");

  const { previous, next } = getVersionNeighbors(versionId);
  if (previous) nav.append(navLink("← 이전 버전", previous, "previous"));

  const archive = document.createElement("a");
  archive.className = "version-navigation__archive";
  archive.href = sitePath("archive/");
  archive.textContent = "전체 버전";
  nav.append(archive);

  if (next) nav.append(navLink("다음 버전 →", next, "next"));

  return nav;
}
