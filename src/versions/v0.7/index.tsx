import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { RevealedMemo } from "../v0.6/RevealedMemo";
import "./style.css";

type Phase = "closed" | "folded" | "map" | "chosen";
type ChoiceId = "walk" | "bus" | "taxi";

const paperEase = [0.22, 1, 0.36, 1] as const;

const choices: Array<{
  id: ChoiceId;
  label: string;
  mood: string;
  color: string;
}> = [
  {
    id: "walk",
    label: "두 발로",
    mood: "천천히",
    color: "#719257"
  },
  {
    id: "bus",
    label: "버스로",
    mood: "창밖을 보며",
    color: "#527ba5"
  },
  {
    id: "taxi",
    label: "택시로",
    mood: "가볍게",
    color: "#c98243"
  }
];

function TransportIcon({ id }: { id: ChoiceId }) {
  if (id === "walk") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="33" cy="10" r="6" />
        <path d="M31 20l-6 14 9 7 5 16M28 29l-12 9M33 22l12 10M27 56l7-15" />
      </svg>
    );
  }

  if (id === "bus") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="13" y="10" width="38" height="42" rx="8" />
        <path d="M18 17h28v17H18zM18 41h.1M46 41h.1M18 52v5M46 52v5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 32l6-15h28l6 15v18H12zM19 32h26M20 43h.1M44 43h.1M20 17l4-7h16l4 7M15 50v6M49 50v6" />
    </svg>
  );
}

function Envelope({ onOpen, reducedMotion }: { onOpen: () => void; reducedMotion: boolean }) {
  return (
    <motion.button
      className="v07-envelope"
      type="button"
      aria-label="제주에서 온 봉투 열기"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 50, scale: .94 }}
      whileHover={reducedMotion ? undefined : { y: -5, rotate: -2.2 }}
      whileTap={reducedMotion ? undefined : { scale: .985 }}
      transition={{ duration: reducedMotion ? 0 : .7, ease: paperEase }}
    >
      <span className="v07-envelope__back" />
      <span className="v07-envelope__front" />
      <span className="v07-envelope__flap">
        <span className="v07-postmark">FROM.<strong>JEJU</strong><small>2026</small></span>
      </span>
      <span className="v07-envelope__hint">봉투를 열어보세요</span>
    </motion.button>
  );
}

function FoldedMap({ onUnfold, reducedMotion }: { onUnfold: () => void; reducedMotion: boolean }) {
  return (
    <motion.div
      className="v07-folded-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="v07-open-envelope" aria-hidden="true">
        <span className="v07-open-envelope__flap" />
        <span className="v07-open-envelope__front" />
      </div>
      <motion.button
        className="v07-folded-map"
        type="button"
        aria-label="접힌 제주 지도 펼치기"
        onClick={onUnfold}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onUnfold();
          }
        }}
        initial={{ y: reducedMotion ? 0 : 150, rotate: 1 }}
        animate={{ y: 0, rotate: -1 }}
        transition={{ duration: reducedMotion ? 0 : 1, ease: paperEase }}
        whileHover={reducedMotion ? undefined : { y: -7, rotate: -1.8 }}
        whileTap={reducedMotion ? undefined : { scale: .985 }}
      >
        <span className="v07-folded-map__panel v07-folded-map__panel--left" />
        <span className="v07-folded-map__panel v07-folded-map__panel--center">
          <i>JEJU</i>
          <small>작은 지도를 펼쳐보세요</small>
        </span>
        <span className="v07-folded-map__panel v07-folded-map__panel--right" />
      </motion.button>
    </motion.div>
  );
}

function MapExperience({
  selected,
  onChoose,
  reducedMotion
}: {
  selected: ChoiceId | null;
  onChoose: (id: ChoiceId) => void;
  reducedMotion: boolean;
}) {
  const selectedChoice = choices.find((choice) => choice.id === selected);

  return (
    <motion.section
      className={`v07-map ${selected ? "is-chosen" : ""}`}
      aria-label="제주공항에서 여행을 시작하는 방법 선택"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.05, ease: paperEase }}
    >
      <span className="v07-map__tape" aria-hidden="true" />
      <span className="v07-fold v07-fold--one" aria-hidden="true" />
      <span className="v07-fold v07-fold--two" aria-hidden="true" />

      <div className="v07-map__drawing" aria-hidden="true">
        <svg viewBox="0 0 800 450" preserveAspectRatio="none">
          <path className="v07-island" d="M74 241C115 161 206 102 315 83c111-20 258-16 361 35 69 34 89 95 43 145-54 58-175 91-317 97-137 6-263-10-316-53-22-18-25-42-12-66Z" />
          <path className="v07-whisper-road" d="M170 274c73-51 122-77 208-91M448 160c84 24 136 62 190 111M278 325c91-44 174-61 275-50" />
          {selected && (
            <path
              className={`v07-route v07-route--${selected}`}
              d={selected === "walk" ? "M400 54C356 105 250 177 148 226" : selected === "bus" ? "M400 54C400 112 400 170 400 226" : "M400 54C444 105 550 177 652 226"}
            />
          )}
        </svg>
      </div>

      <div className="v07-airport">
        <span className="v07-plane" aria-hidden="true">✈</span>
        <strong>제주공항</strong>
      </div>

      <div className="v07-first-stamp" aria-hidden="true">여행의 첫 점</div>

      <AnimatePresence>
        {!selected && (
          <motion.div className="v07-question" exit={{ opacity: 0, y: 8 }}>
            <h1>여행을 어떻게 시작할까요?</h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="v07-choices" role="group" aria-label="여행 시작 방법">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className={`v07-choice v07-choice--${choice.id} ${selected === choice.id ? "is-selected" : ""}`}
            style={{ "--choice-color": choice.color } as React.CSSProperties}
            type="button"
            aria-pressed={selected === choice.id}
            aria-disabled="false"
            onClick={() => onChoose(choice.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onChoose(choice.id);
              }
            }}
          >
            <span><TransportIcon id={choice.id} /></span>
            <strong>{choice.label}</strong>
            <small>{choice.mood}</small>
          </button>
        ))}
      </div>

      {selectedChoice && (
          <div
            key={selectedChoice.id}
            className={`v07-result v07-result--${selectedChoice.id}`}
            role="status"
            aria-label="이전에 받은 제주 메모"
          >
            <RevealedMemo
              number={selectedChoice.id === "walk" ? 1 : selectedChoice.id === "bus" ? 2 : 3}
              showSymbol={false}
              previewDuration={selectedChoice.id === "walk" ? 1.25 : selectedChoice.id === "bus" ? 0.85 : 0.55}
            />
          </div>
      )}
    </motion.section>
  );
}

function App() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [selected, setSelected] = useState<ChoiceId | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    document.body.className = "version-v0-7";
    return () => { document.body.className = ""; };
  }, []);

  const choose = (id: ChoiceId) => {
    setSelected(id);
    setPhase("chosen");
  };

  return (
    <main className={`v07-site phase-${phase}`}>
      <header className="v07-header">
        <a href="./" aria-label="Let's Jeju 2026 v0.7 처음으로">Let&apos;s Jeju <span>2026</span></a>
        <p>여행 준비도<br />여행입니다.</p>
      </header>

      <div className="v07-desk" aria-hidden="true">
        <span className="v07-pass"><i>CJU</i><b>ONE SMALL START</b><small>OCT · 2026</small></span>
        <span className="v07-pencil" />
        <span className="v07-coffee" />
      </div>

      <div className="v07-stage">
        <AnimatePresence mode="wait">
          {phase === "closed" && <Envelope key="envelope" onOpen={() => setPhase("folded")} reducedMotion={reducedMotion} />}
          {phase === "folded" && <FoldedMap key="folded" onUnfold={() => setPhase("map")} reducedMotion={reducedMotion} />}
          {(phase === "map" || phase === "chosen") && <MapExperience key="map" selected={selected} onChoose={choose} reducedMotion={reducedMotion} />}
        </AnimatePresence>
      </div>

      <footer className="v07-footer"><span>v0.7</span><small>LET&apos;S JEJU 2026</small></footer>
    </main>
  );
}

export function mountV07(root: HTMLElement): void {
  createRoot(root).render(<App />);
}
