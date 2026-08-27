import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import "./style.css";

type Step = "closed" | "opened" | "memo1" | "memo2";

const paperEase = [0.22, 1, 0.36, 1] as const;

function Memo({
  number,
  step,
  onPull,
  reducedMotion
}: {
  number: 1 | 2;
  step: Step;
  onPull: () => void;
  reducedMotion: boolean;
}) {
  const isFirst = number === 1;
  const available = isFirst ? step === "opened" : step === "memo1";
  const pulled = isFirst ? step === "memo1" || step === "memo2" : step === "memo2";
  const lines = isFirst
    ? ["하늘이", "조금 더", "특별했으면", "좋겠습니다."]
    : ["누군가", "먼저", "인사해 줄지도", "모릅니다."];

  const activate = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (available && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onPull();
    }
  };

  return (
    <motion.button
      className={`v06-envelope-memo v06-envelope-memo--${number} ${pulled ? "is-pulled" : ""}`}
      type="button"
      aria-label={`메모 ${number}을 봉투에서 꺼내기`}
      aria-disabled={!available}
      tabIndex={available ? 0 : -1}
      drag={available && !reducedMotion ? "y" : false}
      dragConstraints={{ top: -150, bottom: 0 }}
      dragElastic={0.14}
      onDragEnd={(_, info) => {
        if (available && (info.offset.y < -55 || info.velocity.y < -350)) onPull();
      }}
      onClick={() => available && onPull()}
      onKeyDown={activate}
      animate={{
        y: pulled ? -235 : available ? -54 : 18,
        rotate: pulled ? (isFirst ? -2.4 : 2.1) : isFirst ? -0.7 : 0.8,
        opacity: pulled || step === "closed" || (!isFirst && !available) ? 0 : 1
      }}
      transition={{ duration: reducedMotion ? 0 : 0.85, ease: paperEase }}
    >
      <span className={`v06-tape v06-tape--${isFirst ? "sand" : "blue"}`} />
      <small>From. 제주</small>
      <strong>{lines.map((line) => <span key={line}>{line}</span>)}</strong>
      <i aria-hidden="true">{isFirst ? ":)" : "〜"}</i>
      {available && <em>{reducedMotion ? "눌러서 꺼내기" : "위로 당겨 꺼내기"}</em>}
    </motion.button>
  );
}

function RevealedMemo({ number }: { number: 1 | 2 }) {
  const lines = number === 1
    ? ["하늘이", "조금 더", "특별했으면", "좋겠습니다."]
    : ["누군가", "먼저", "인사해 줄지도", "모릅니다."];

  return (
    <motion.article
      className={`v06-revealed v06-revealed--${number}`}
      initial={{ opacity: 0, y: 70, rotate: number === 1 ? -5 : 5 }}
      animate={{ opacity: 1, y: 0, rotate: number === 1 ? -1.3 : 1.1 }}
      transition={{ duration: 0.85, ease: paperEase }}
    >
      <span className={`v06-tape v06-tape--${number === 1 ? "sand" : "blue"}`} />
      <small>From. 제주</small>
      <p>{lines.map((line) => <span key={line}>{line}</span>)}</p>
      <i aria-hidden="true">{number === 1 ? ":)" : "〜"}</i>
    </motion.article>
  );
}

function App() {
  const [step, setStep] = useState<Step>("closed");
  const [flapProgress, setFlapProgress] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;
  const memoAreaRef = useRef<HTMLDivElement>(null);
  const flapDragStart = useRef<number | null>(null);

  useEffect(() => {
    document.body.className = "version-v0-6";
    return () => { document.body.className = ""; };
  }, []);

  const pullMemo = (number: 1 | 2) => {
    setStep(number === 1 ? "memo1" : "memo2");
    if (number === 2) {
      window.setTimeout(
        () => memoAreaRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }),
        reducedMotion ? 0 : 460
      );
    }
  };

  const isOpen = step !== "closed";
  const hasMemo1 = step === "memo1" || step === "memo2";
  const hasMemo2 = step === "memo2";

  const finishOpening = () => {
    setFlapProgress(1);
    setStep("opened");
  };

  const handleFlapPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isOpen) return;
    flapDragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleFlapPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (flapDragStart.current === null || isOpen) return;
    const distance = Math.max(0, flapDragStart.current - event.clientY);
    setFlapProgress(Math.min(1, distance / 110));
  };

  const handleFlapPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (flapDragStart.current === null || isOpen) return;
    const distance = Math.max(0, flapDragStart.current - event.clientY);
    flapDragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (distance >= 55) finishOpening();
    else setFlapProgress(0);
  };

  return (
    <main className="v06-site">
      <header className="v06-header">
        <a href="./" aria-label="Let's Jeju 2026 현재 메모 처음으로">Let&apos;s Jeju<br /><span>2026</span></a>
        <p><span>POST FROM JEJU</span>조금 느리게,<br />우연에게 인사하러.</p>
      </header>

      <section className="v06-arrival" aria-label="제주에서 도착한 작은 우편">
        <div className="v06-sunwash" aria-hidden="true" />
        <div className="v06-travel-props" aria-hidden="true">
          <span className="v06-notebook"><b>things to meet</b><i>01<br />02<br />03</i></span>
          <span className="v06-pencil" />
          <span className="v06-luggage-tag"><small>CJU</small><b>2026</b><i>one way<br />to somewhere</i></span>
          <span className="v06-coffee-ring" />
          <span className="v06-photo"><i>somewhere,<br />in daylight</i></span>
        </div>
        <div className={`v06-envelope ${isOpen ? "is-open" : ""}`}>
          <div className="v06-envelope__back" />
          <Memo number={2} step={step} onPull={() => pullMemo(2)} reducedMotion={reducedMotion} />
          <Memo number={1} step={step} onPull={() => pullMemo(1)} reducedMotion={reducedMotion} />
          <div className="v06-envelope__front" aria-hidden="true" />
          <div
            className="v06-envelope__flap"
            aria-hidden="true"
            style={{ transform: `rotateX(${flapProgress * 180}deg)`, zIndex: isOpen ? 1 : 6 }}
          >
            <span className="v06-stamp">FROM.<strong>JEJU</strong><small>2026</small></span>
          </div>
          {!isOpen && (
            <button
              className="v06-open"
              type="button"
              aria-label="봉투 덮개를 위로 당겨 열기"
              onPointerDown={handleFlapPointerDown}
              onPointerMove={handleFlapPointerMove}
              onPointerUp={handleFlapPointerUp}
              onPointerCancel={() => { flapDragStart.current = null; setFlapProgress(0); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  finishOpening();
                }
              }}
            >
              <span className="v06-open__label">덮개를 위로 당겨보세요.</span>
            </button>
          )}
        </div>

        {step === "memo1" && (
          <motion.p
            className="v06-one-more"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span aria-hidden="true">↑</span> 한 장 더 있습니다.
          </motion.p>
        )}

      </section>

      <section className={`v06-desk ${hasMemo1 ? "is-visible" : ""}`} ref={memoAreaRef} aria-live="polite">
        <span className="v06-route-stub" aria-hidden="true">CJU · OCT · 2026<br /><b>KEEP THIS MOMENT</b></span>
        <span className="v06-flower" aria-hidden="true">❊</span>
        <span className="v06-leaf" aria-hidden="true">⌁</span>
        {hasMemo1 && <RevealedMemo number={1} />}
        {hasMemo2 && <RevealedMemo number={2} />}
        {hasMemo2 && (
          <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 0.7 }}>
            <strong>오늘의 우편은 여기까지.</strong>
            <p>다음 메모는 조금 더 여행이 가까워지면 도착합니다.</p>
            <span aria-hidden="true">→</span>
            <small>LET&apos;S JEJU 2026</small>
          </motion.footer>
        )}
      </section>
    </main>
  );
}

export function mountV06(root: HTMLElement): void {
  createRoot(root).render(<App />);
}
