import { motion } from "framer-motion";

const paperEase = [0.22, 1, 0.36, 1] as const;

const memoContent = {
  1: { lines: ["하늘이", "조금 더", "특별했으면", "좋겠습니다."], symbol: ":)" },
  2: { lines: ["누군가", "먼저", "인사해 줄지도", "모릅니다."], symbol: "〜" },
  3: { lines: ["오늘은", "조금", "가볍게", "시작합니다."], symbol: "☕" }
} as const;

export function RevealedMemo({
  number,
  symbol: symbolOverride,
  showSymbol = true,
  delay = 0,
  previewDuration
}: {
  number: 1 | 2 | 3;
  symbol?: string;
  showSymbol?: boolean;
  delay?: number;
  previewDuration?: number;
}) {
  const { lines, symbol } = memoContent[number];
  const rotation = number === 1 ? -1.3 : number === 2 ? 1.1 : -0.6;
  const stagedDuration = previewDuration ? previewDuration + 0.85 : 0.85;
  const previewEnd = previewDuration ? previewDuration / stagedDuration : 0;

  return (
    <motion.article
      className={`v06-revealed v06-revealed--${number}`}
      initial={previewDuration
        ? { opacity: 0, y: "88%", rotate: rotation }
        : { opacity: 0, y: 70, rotate: number === 1 ? -5 : 5 }}
      animate={previewDuration
        ? {
            opacity: [0, 1, 1, 1],
            y: ["88%", "82%", "76%", "0%"],
            rotate: rotation
          }
        : { opacity: 1, y: 0, rotate: rotation }}
      transition={previewDuration
        ? { duration: stagedDuration, times: [0, Math.min(.22, previewEnd * .42), previewEnd, 1], ease: paperEase }
        : { duration: 0.85, delay, ease: paperEase }}
    >
      <span className={`v06-tape v06-tape--${number === 1 ? "sand" : "blue"}`} />
      <small>From. 제주</small>
      <p>{lines.map((line) => <span key={line}>{line}</span>)}</p>
      {showSymbol && <i aria-hidden="true">{symbolOverride ?? symbol}</i>}
    </motion.article>
  );
}
