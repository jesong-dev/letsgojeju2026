export type VersionStatus = "draft" | "published" | "archived";

export interface JejuVersion {
  id: string;
  title: string;
  subtitle: string;
  releasedAt: string;
  description: string;
  path: string;
  status: VersionStatus;
}
