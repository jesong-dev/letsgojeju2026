import type { VersionStatus } from "../core/types";

const statusLabels: Record<VersionStatus, string> = {
  draft: "준비 중",
  published: "현재 공개",
  archived: "보관됨"
};

export function VersionBadge(version: string, status: VersionStatus): HTMLElement {
  const badge = document.createElement("span");
  badge.className = `version-badge version-badge--${status}`;
  badge.textContent = `${version} · ${statusLabels[status]}`;
  return badge;
}
