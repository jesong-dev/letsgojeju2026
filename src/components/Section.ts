export function Section(className = ""): HTMLElement {
  const section = document.createElement("section");
  section.className = ["common-section", className].filter(Boolean).join(" ");
  return section;
}
