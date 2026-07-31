import type { JejuVersion, VersionNeighbors } from "./types";
import { sitePath } from "./paths";

export const jejuVersions: readonly JejuVersion[] = [
  {
    id: "v0.4",
    title: "축! 숙소 결정",
    subtitle: "놀멍, 쉬멍 · 우리 함께",
    releasedAt: "2026-07-09",
    description: "여행 날짜와 제주 숙소가 정해진 순간을 담은 첫 공개 브로슈어.",
    path: sitePath("v0.4/"),
    status: "published"
  }
] as const;

export function getPublishedVersions(): JejuVersion[] {
  return jejuVersions
    .filter((version) => version.status !== "draft")
    .sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
}

export function getCurrentVersion(): JejuVersion {
  const current = [...jejuVersions]
    .filter((version) => version.status === "published")
    .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt))[0];

  if (!current) {
    throw new Error("공개된 제주 여행 버전이 없습니다.");
  }

  return current;
}

export function getVersion(id: string): JejuVersion | undefined {
  return jejuVersions.find((version) => version.id === id);
}

export function getVersionNeighbors(id: string): VersionNeighbors {
  const versions = getPublishedVersions();
  const index = versions.findIndex((version) => version.id === id);

  if (index < 0) return {};

  return {
    previous: versions[index - 1],
    next: versions[index + 1]
  };
}
