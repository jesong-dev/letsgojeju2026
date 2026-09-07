import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import "./style.css";

const DURATION = 10_000;

function Hourglass({ progress }: { progress: number }) {
  // The physical timer is still exactly 10 seconds. The eased visual fill keeps
  // the first few seconds from feeling as if the sand disappears too quickly.
  const visualProgress = Math.pow(progress, 1.35);
  const upperScale = Math.max(0, 1 - visualProgress);
  const lowerScale = Math.min(1, visualProgress);

  return (
    <div className="v08-hourglass" aria-hidden="true">
      <span className="v08-hourglass__cap v08-hourglass__cap--top" />
      <span className="v08-hourglass__post v08-hourglass__post--left" />
      <span className="v08-hourglass__post v08-hourglass__post--right" />
      <span className="v08-hourglass__glass">
        <i className="v08-hourglass__shine" />
        <i className="v08-sand v08-sand--upper" style={{ transform: `scaleY(${upperScale})` }} />
        <i className="v08-sand-stream" style={{ opacity: progress < 0.985 ? 1 : 0 }} />
        <i className="v08-sand v08-sand--lower" style={{ transform: `scaleY(${lowerScale})` }} />
      </span>
      <span className="v08-hourglass__cap v08-hourglass__cap--bottom" />
    </div>
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.className = "version-v0-8";
    let frame = 0;

    const tick = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const next = Math.min((time - startRef.current) / DURATION, 1);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
      else setFinished(true);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.className = "";
    };
  }, []);

  return (
    <main className={`v08-scene ${finished ? "is-finished" : ""}`}>
      <div className="v08-room" aria-hidden="true" />
      <div className="v08-window-motion" aria-hidden="true">
        <span className="v08-wave v08-wave--one" />
        <span className="v08-wave v08-wave--two" />
        <span className="v08-wave v08-wave--three" />
        <span className="v08-glint" />
      </div>
      <span className="v08-curtain-event" aria-hidden="true" />

      <header className="v08-mark" aria-label="Let's Jeju 2026">
        <span>Let&apos;s Jeju</span>
        <small>2026 · v0.8</small>
      </header>

      <section className="v08-timepiece" aria-label={finished ? "10초가 지났습니다" : "모래가 흐르고 있습니다"}>
        <Hourglass progress={progress} />
      </section>

      <div className="v08-sr-status" role="status" aria-live="polite">
        {finished ? "벌써 10초가 지났습니다. 오늘의 여행은 여기까지입니다." : ""}
      </div>

      <section className="v08-ending" aria-hidden={!finished}>
        <p className="v08-ending__primary">벌써 10초가 지났습니다.</p>
        <div className="v08-ending__rule" />
        <p className="v08-ending__last">오늘의 여행은 여기까지입니다.</p>
      </section>
    </main>
  );
}

export function mountV08(root: HTMLElement): void {
  createRoot(root).render(<App />);
}
