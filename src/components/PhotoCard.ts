export interface PhotoCardProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  caption: string;
}

export function PhotoCard({ src, fallbackSrc, alt, caption }: PhotoCardProps): HTMLElement {
  const figure = document.createElement("figure");
  figure.className = "photo-card";

  const picture = document.createElement("picture");
  if (fallbackSrc) {
    const source = document.createElement("source");
    source.srcset = src;
    source.type = "image/webp";
    picture.append(source);
  }

  const image = document.createElement("img");
  image.src = fallbackSrc ?? src;
  image.alt = alt;
  image.decoding = "async";
  picture.append(image);

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = caption;
  figure.append(picture, figcaption);
  return figure;
}
