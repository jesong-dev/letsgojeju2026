export interface HeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function Hero({ eyebrow, title, description }: HeroProps): HTMLElement {
  const hero = document.createElement("header");
  hero.className = "common-hero";

  if (eyebrow) {
    const label = document.createElement("p");
    label.className = "common-hero__eyebrow";
    label.textContent = eyebrow;
    hero.append(label);
  }

  const heading = document.createElement("h1");
  heading.className = "common-hero__title";
  heading.textContent = title;
  hero.append(heading);

  if (description) {
    const copy = document.createElement("p");
    copy.className = "common-hero__description";
    copy.textContent = description;
    hero.append(copy);
  }

  return hero;
}
