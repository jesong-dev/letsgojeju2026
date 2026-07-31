import { v04Content } from "./content";
import { sitePath } from "../../core/paths";
import "./style.css";

export function renderV04(root: HTMLElement): void {
  document.body.className = "version-v0-4";
  root.innerHTML = `
    <svg class="v04-plane" aria-hidden="true" width="30" height="30" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 3L3 10.5L11 13.5L14 21L21 3Z"></path>
      <path d="M21 3L11 13.5"></path>
    </svg>
    <main class="v04-wrap">
      <header class="v04-hero">
        <h1>${v04Content.headline}<br><span>${v04Content.accent}</span></h1>
      </header>
      <div class="v04-envelope-stage">
        <figure class="v04-stay-photo">
          <picture>
            <source srcset="${v04Content.image}" type="image/webp">
            <img src="${v04Content.fallbackImage}" alt="${v04Content.imageAlt}"
              width="1402" height="1122" fetchpriority="high" decoding="async">
          </picture>
          <figcaption>${v04Content.dateLabel}</figcaption>
        </figure>
      </div>
      <footer class="v04-foot">
        <span>${v04Content.footer}</span>
        <a href="${sitePath("archive/")}" aria-label="전체 버전 아카이브 보기">ARCHIVE</a>
      </footer>
    </main>
  `;
}
