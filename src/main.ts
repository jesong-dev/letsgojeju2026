import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/common.css";
import "./styles/animations.css";
import { Hero } from "./components/Hero";
import { VersionBadge } from "./components/VersionBadge";
import { getCurrentVersion, getPublishedVersions, getVersion } from "./core/version-registry";
import { resolveRoute } from "./core/router";
import { sitePath } from "./core/paths";

function getRoot(): HTMLElement {
  const element = document.querySelector<HTMLElement>("#app");
  if (!element) throw new Error("#app 요소를 찾을 수 없습니다.");
  return element;
}

const root = getRoot();

function renderArchive(): void {
  document.body.className = "archive-page";
  const current = getCurrentVersion();
  const versions = getPublishedVersions().reverse();
  const shell = document.createElement("main");
  shell.className = "archive-shell";

  const topLine = document.createElement("div");
  topLine.className = "archive-topline";
  topLine.innerHTML = `<span>Jeju Journey · 2026</span><a href="${sitePath("")}">현재 버전</a>`;

  const hero = Hero({
    eyebrow: "VERSION ARCHIVE",
    title: "우리가 만든 여행의 시간들",
    description: "제주로 떠나기 전의 마음과 선택, 디자인의 변화를 공개 당시 모습 그대로 차곡차곡 남깁니다."
  });
  hero.classList.add("reveal");

  const currentCard = document.createElement("section");
  currentCard.className = "archive-current reveal";
  currentCard.append(VersionBadge(current.id, current.status));
  currentCard.insertAdjacentHTML(
    "beforeend",
    `<h2>${current.title}</h2>
     <p>${current.description}</p>
     <a href="${current.path}">현재 브로슈어 보기 →</a>`
  );

  const heading = document.createElement("div");
  heading.className = "archive-heading";
  heading.innerHTML = `<h2>모든 버전</h2><span>${String(versions.length).padStart(2, "0")} RECORDS</span>`;

  const list = document.createElement("ol");
  list.className = "archive-list";
  versions.forEach((version) => {
    const item = document.createElement("li");
    item.className = "archive-entry";
    item.innerHTML = `
      <a href="${version.path}">
        <span class="archive-entry__version">${version.id}</span>
        <div>
          <h3>${version.title}</h3>
          <p>${version.description}</p>
        </div>
        <time datetime="${version.releasedAt}">${version.releasedAt.replaceAll("-", ".")}</time>
      </a>`;
    list.append(item);
  });

  const future = document.createElement("p");
  future.className = "archive-future";
  future.textContent = "여행이 끝난 뒤에는 각 준비 버전과 실제 여행 사진·기록을 연결해, 계획이 추억으로 이어진 과정을 한 흐름으로 보여줄 예정입니다.";

  shell.append(topLine, hero, currentCard, heading, list, future);
  root.replaceChildren(shell);
}

function renderNotFound(versionId: string): void {
  document.body.className = "not-found-page";
  root.innerHTML = `
    <main class="not-found-shell">
      <p>VERSION NOT FOUND</p>
      <h1>${versionId}는 아직 공개되지 않았습니다.</h1>
      <p>전체 버전 아카이브에서 지금 볼 수 있는 여행 기록을 확인해 주세요.</p>
      <a href="${sitePath("archive/")}">아카이브로 돌아가기 →</a>
    </main>`;
}

async function render(): Promise<void> {
  const route = resolveRoute(window.location.pathname);

  if (route.name === "archive") {
    renderArchive();
    return;
  }

  const versionId = route.name === "home" ? getCurrentVersion().id : route.versionId!;
  if (!getVersion(versionId)) {
    renderNotFound(versionId);
    return;
  }

  if (versionId === "v0.4") {
    const { renderV04 } = await import("./versions/v0.4");
    renderV04(root);
    return;
  }

  if (versionId === "v0.5") {
    const { mountV05 } = await import("./versions/v0.5");
    mountV05(root);
    return;
  }

  if (versionId === "v0.6") {
    const { mountV06 } = await import("./versions/v0.6");
    mountV06(root);
  }
}

void render();
