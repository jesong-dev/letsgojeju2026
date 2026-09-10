import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { sitePath } from "../../core/paths";
import "./style.css";

type Phase = "loading" | "error" | "idle" | "selected" | "dragging" | "placing" | "complete";
const assets = ["desk-backpack.webp", "letter.webp"].map(name => sitePath(`assets/v0.9/${name}`));
const HOME = { x: 40, y: 40 };
const POCKET = { x: 78, y: 57 };

export function App() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [attempt, setAttempt] = useState(0);
  const [hint, setHint] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [position, setPosition] = useState(HOME);
  const [over, setOver] = useState(false);
  const [reduced, setReduced] = useState(false);
  const plane = useRef<HTMLDivElement>(null);
  const letter = useRef<HTMLButtonElement>(null);
  const pocket = useRef<HTMLButtonElement>(null);
  const ending = useRef<HTMLElement>(null);
  const state = useRef(phase);
  state.current = phase;
  const drag = useRef<null | { id: number; x: number; y: number; moved: boolean; origin: typeof HOME }>(null);
  const suppressClick = useRef(false);

  const cancel = () => {
    const current = drag.current;
    drag.current = null;
    if (current && letter.current?.hasPointerCapture(current.id)) letter.current.releasePointerCapture(current.id);
    if (["selected", "dragging"].includes(state.current)) { setPosition(HOME); setPhase("idle"); setOver(false); }
  };

  useEffect(() => {
    let active = true;
    const images = assets.map(src => { const img = new Image(); img.src = src; return img; });
    const timeout = window.setTimeout(() => { if (active) { active = false; setPhase("error"); } }, 12000);
    Promise.all(images.map(img => img.decode())).then(() => {
      if (active) { clearTimeout(timeout); setPhase("idle"); }
    }).catch(() => { if (active) { clearTimeout(timeout); setPhase("error"); } });
    return () => { active = false; clearTimeout(timeout); };
  }, [attempt]);

  useEffect(() => {
    document.body.classList.add("version-v0-9");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => { setHidden(document.hidden); if (document.hidden) cancel(); };
    const resize = () => cancel();
    motion();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", resize);
    return () => {
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("version-v0-9");
    };
  }, []);

  useEffect(() => {
    if (phase !== "idle" || hidden || hint) return;
    const timer = setTimeout(() => setHint(true), 4000);
    return () => clearTimeout(timer);
  }, [phase, hidden, hint]);

  useEffect(() => {
    if (phase === "complete") ending.current?.focus({ preventScroll: true });
    if (phase === "placing" && reduced) setPhase("complete");
  }, [phase, reduced]);

  const place = () => {
    if (!["selected", "dragging"].includes(state.current)) return;
    drag.current = null;
    setOver(false);
    setPosition(POCKET);
    setPhase("placing");
  };
  const select = () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (phase === "selected") { cancel(); return; }
    if (phase !== "idle") return;
    setPhase("selected");
    requestAnimationFrame(() => pocket.current?.focus({ preventScroll: true }));
  };
  const down = (e: PointerEvent<HTMLButtonElement>) => {
    if (!e.isPrimary || e.button !== 0 || !["idle", "selected"].includes(phase)) return;
    suppressClick.current = false;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, origin: position };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    const bounds = plane.current!.getBoundingClientRect();
    const next = { x: d.origin.x + (e.clientX - d.x) / bounds.width * 100, y: d.origin.y + (e.clientY - d.y) / bounds.height * 100 };
    setPosition(next);
    setPhase("dragging");
    const target = pocket.current!.getBoundingClientRect();
    const x = bounds.left + next.x / 100 * bounds.width;
    const y = bounds.top + next.y / 100 * bounds.height;
    setOver(x >= target.left - 20 && x <= target.right + 20 && y >= target.top - 20 && y <= target.bottom + 20);
  };
  const up = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (d.moved) { suppressClick.current = true; if (over) place(); else cancel(); }
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const packed = phase === "placing" || phase === "complete";

  return <main className={`v09-scene ${hidden ? "is-paused" : ""} ${packed ? "is-packed" : ""} ${phase === "complete" ? "is-complete" : ""}`}
    onKeyDown={e => { if (e.key === "Escape") { cancel(); letter.current?.focus(); } }}>
    <div className="v09-ambient" aria-hidden="true" />
    <header className="v09-brand">Let's Jeju<small>2026 · v0.9</small></header>
    <div ref={plane} className="v09-plane" onClick={e => { if (e.target === e.currentTarget) cancel(); }}>
      <img className="v09-background" src={assets[0]} alt="" draggable="false" />
      {phase !== "loading" && phase !== "error" && <>
        <button ref={letter} className={`v09-letter ${phase === "dragging" ? "is-dragging" : ""} ${phase === "selected" ? "is-selected" : ""}`}
          style={{ "--x": `${position.x}%`, "--y": `${position.y}%` } as CSSProperties}
          aria-label="제주에서 온 편지 챙기기" aria-describedby="v09-instructions" disabled={packed}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={() => { if (drag.current?.moved) cancel(); }} onClick={select}
          onAnimationEnd={e => { if (e.animationName === "v09-tuck") setPhase("complete"); }}>
          <span className="v09-paper"><img src={assets[1]} alt="" draggable="false" /><span>From. 제주</span></span>
        </button>
        <div className="v09-pocket-front" aria-hidden="true" />
        <button ref={pocket} className={`v09-pocket ${phase === "selected" || over ? "is-highlighted" : ""}`} aria-label="편지를 가방에 넣기" tabIndex={phase === "selected" ? 0 : -1} disabled={packed} onClick={place}>
          {phase === "selected" && <span>여기에 넣어두세요.</span>}
        </button>
        <p className={`v09-hint ${hint && phase === "idle" ? "is-visible" : ""}`}>편지도 챙겨갈까요?</p>
      </>}
    </div>
    <p id="v09-instructions" className="v09-sr">편지를 가방 주머니로 옮기거나, 편지를 선택한 뒤 주머니를 눌러 넣을 수 있습니다. Escape 키로 선택을 취소합니다.</p>
    {phase === "loading" && <p className="v09-loading" role="status">장면을 준비하고 있어요.</p>}
    {phase === "error" && <div className="v09-error" role="alert"><p>장면을 불러오지 못했어요.</p><button onClick={() => { setPhase("loading"); setAttempt(a => a + 1); }}>다시 불러오기</button></div>}
    {phase === "complete" && <section ref={ending} tabIndex={-1} className="v09-ending" aria-label="아직 출발하지 않았는데, 마음은 조금 먼저 가 있습니다. 이제, 떠날 일만 남았습니다.">
      <p>아직 출발하지 않았는데,<br />마음은 조금 먼저 가 있습니다.</p>
      <small>이제, 떠날 일만 남았습니다.</small>
    </section>}
  </main>;
}
