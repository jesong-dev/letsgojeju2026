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
    status: "archived"
  },
  {
    id: "v0.5",
    title: "10월의 제주",
    subtitle: "제주에서 편지가 왔습니다",
    releasedAt: "2026-07-31",
    description: "봉투를 열며 시작되는, 10월 제주의 장면과 마음을 담은 인터랙티브 디지털 브로슈어.",
    path: sitePath("v0.5/"),
    status: "archived"
  },
  {
    id: "v0.6",
    title: "제주에서 작은 메모가 도착했습니다",
    subtitle: "무슨 뜻일까?",
    releasedAt: "2026-08-28",
    description: "봉투에서 두 장의 메모를 차례로 직접 꺼내며 제주를 상상하는 작은 우편 경험.",
    path: sitePath("v0.6/"),
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
