import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sitePath } from "../../core/paths";
import "./style.css";

const easePaper = [0.22, 1, 0.36, 1] as const;

const moments = [
  { category: "바다", caption: "푸른 바다와 여유로운 시간", tape: "blue", rotate: -2.2, image: "sea-outdoor-table.jpg", alt: "바다를 바라보는 야외 카페 테이블" },
  { category: "올레길", caption: "바람 따라 걷는 올레길", tape: "olive", rotate: 1.8, image: "silver-grass-path.jpg", alt: "가을 하늘 아래 펼쳐진 억새밭" },
  { category: "노을", caption: "하루의 끝을 물들이는 아름다운 노을", tape: "orange", rotate: -1.2, image: "coastal-sunset.jpg", alt: "제주 바다와 검은 바위 위로 지는 노을" },
  { category: "귤", caption: "탐스러운 귤 밭", tape: "beige", rotate: 1.4, image: "tangerine-tree.jpg", alt: "초록 잎 사이로 탐스럽게 익은 제주 감귤" },
  { category: "카페", caption: "바다 앞 카페에서 천천히, 여유", tape: "blue", rotate: -1.6, image: "ocean-view-coffee.jpg", alt: "제주 바다가 보이는 카페의 음료 두 잔" }
] as const;

const progress = [
  ["0.1", "여행 시작"],
  ["0.2", "일정"],
  ["0.3", "함께할 사람"],
  ["0.4", "숙소"],
  ["0.5", "10월의 제주"]
] as const;

function Doodle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`v05-doodle ${className}`} aria-hidden="true">{children}</span>;
}

function Envelope({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <motion.button
      className="v05-envelope"
      type="button"
      onClick={onOpen}
      aria-label="제주에서 온 편지 열기"
      whileHover={opened ? undefined : { y: -6, rotate: -0.4 }}
      whileTap={opened ? undefined : { scale: 0.985 }}
    >
      <motion.div
        className="v05-envelope__letter"
        animate={opened ? { y: "-72%", rotate: -1, opacity: 1 } : { y: "5%", opacity: 0.86 }}
        transition={{ duration: 1.05, delay: opened ? 0.48 : 0, ease: easePaper }}
      >
        <small>LET&apos;S JEJU 2026 · v0.5</small>
        <strong>10월의 제주를<br />상상하다</strong>
        <span>당신에게 먼저 보여주고 싶은 장면들이 있어요.</span>
      </motion.div>
      <div className="v05-envelope__back" />
      <motion.div
        className="v05-envelope__flap"
        animate={opened ? { rotateX: 178, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
        transition={{ duration: 0.9, ease: easePaper }}
      />
      <div className="v05-envelope__front">
        <p>제주에서<br /><strong>편지가 왔습니다.</strong></p>
        <span className="v05-postmark">JEJU<br />OCT 2026</span>
      </div>
      <motion.span
        className="v05-wax"
        animate={opened ? { scale: 0.72, opacity: 0, y: 18 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.38 }}
      >
        귤
      </motion.span>
    </motion.button>
  );
}

function Opening({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <section className="v05-opening" aria-label="제주에서 온 편지">
      <div className="v05-opening__grain" />
      <Doodle className="v05-opening__leaf">⌁</Doodle>
      <Doodle className="v05-opening__flower">✻</Doodle>
      <motion.p
        className="v05-opening__eyebrow"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        a little letter from the island
      </motion.p>
      <Envelope opened={opened} onOpen={onOpen} />
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.p
            key="closed"
            className="v05-opening__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            봉투를 살며시 눌러 보세요 <span>↓</span>
          </motion.p>
        ) : (
          <motion.p
            key="opened"
            className="v05-opening__hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            편지를 따라 천천히 내려가요 <span>↓</span>
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}

function IntroLetter() {
  return (
    <motion.section
      className="v05-letter v05-paper"
      initial={{ opacity: 0, y: 60, rotate: 0.7 }}
      whileInView={{ opacity: 1, y: 0, rotate: -0.35 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: easePaper }}
    >
      <span className="v05-tape v05-tape--top" />
      <p className="v05-kicker">Dear. 우리 함께 떠날 사람들에게</p>
      <h1>10월의 제주를<br /><em>상상해 봅니다.</em></h1>
      <div className="v05-letter__copy">
        <p>서두르지 않아도 좋은 계절, 바람의 결이 조금 부드러워지는 섬.</p>
        <p>이미 정해진 여행보다 함께 채워 갈 여백이 더 많은 여행이면 좋겠습니다.</p>
        <p>이 편지에는 그때 우리가 만나게 될 작은 장면들을 먼저 담아 두었어요.</p>
      </div>
      <p className="v05-sign">제주를 기다리며, 2026 여름</p>
      <Doodle className="v05-letter__orange">●<i>⌁</i></Doodle>
    </motion.section>
  );
}

function October() {
  const notes = [
    ["16—23°C", "가볍게 걸을 수 있는 온도", "♨"],
    ["선선한 바람", "기분 좋은 옷깃의 계절", "≋"],
    ["맑은 볕", "조금 길어진 금빛 오후", "☼"],
    ["억새와 귤", "가을빛으로 익어 가는 섬", "♧"]
  ];

  return (
    <section className="v05-october">
      <div className="v05-section-title">
        <span>01 · OCTOBER NOTE</span>
        <h2>10월의 제주는<br />이런 계절이에요.</h2>
      </div>
      <div className="v05-october__sheet v05-paper">
        <span className="v05-stamp">AIR MAIL<br />JEJU</span>
        {notes.map(([title, copy, icon], index) => (
          <motion.article
            key={title}
            className="v05-weather-note"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.11, duration: 0.65, ease: easePaper }}
          >
            <i>{icon}</i>
            <strong>{title}</strong>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const toggleMoment = (index: number) => {
    setSelectedMoment((current) => current === index ? null : index);
  };

  return (
    <section className="v05-gallery">
      <div className="v05-section-title v05-section-title--center">
        <span>02 · FOUND MOMENTS</span>
        <h2>이런 풍경을<br />만날 수 있어요.</h2>
        <p><span className="v05-gallery-hint--desktop">사진 위에 손을 올려 보세요.</span><span className="v05-gallery-hint--mobile">사진을 눌러 보세요.</span></p>
      </div>
      <div className="v05-polaroids">
        {moments.map((moment, index) => (
          <motion.figure
            key={moment.caption}
            className={`v05-polaroid ${selectedMoment === index ? "is-selected" : ""}`}
            style={{ rotate: `${moment.rotate}deg` }}
            initial={{ opacity: 0, y: 50, rotate: moment.rotate * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: moment.rotate }}
            whileHover={{ y: -10, rotate: 0, zIndex: 5 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.09, type: "spring", stiffness: 85, damping: 15 }}
          >
            <span className={`v05-tape v05-tape--${moment.tape}`} />
            <motion.button
              type="button"
              className="v05-polaroid__photo"
              aria-pressed={selectedMoment === index}
              aria-label={`${moment.category} 사진: ${moment.caption}`}
              onClick={() => toggleMoment(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleMoment(index);
                }
              }}
              whileTap={{ scale: 0.975 }}
            >
              <img src={sitePath(`assets/images/october-jeju/${moment.image}`)} alt={moment.alt} />
            </motion.button>
            <figcaption>{moment.caption}<small>{moment.category} · jeju</small></figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Keywords() {
  const words = [
    ["걷고", "발끝으로 섬의 속도를 느끼기", "⌁"],
    ["바라보고", "수평선 앞에서 오래 머물기", "◎"],
    ["쉬고", "아무 계획 없는 오후 보내기", "♨"],
    ["맛보고", "제주의 가을을 한입에 담기", "♧"]
  ];

  return (
    <section className="v05-keywords v05-paper">
      <span className="v05-ticket-hole v05-ticket-hole--left" />
      <span className="v05-ticket-hole v05-ticket-hole--right" />
      <div className="v05-section-title">
        <span>03 · JOURNEY TICKET</span>
        <h2>이번 여행의<br />네 가지 동사</h2>
      </div>
      <div className="v05-keywords__list">
        {words.map(([title, copy, icon], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.55 }}
          >
            <i>{icon}</i>
            <strong>{title}</strong>
            <span>{copy}</span>
          </motion.div>
        ))}
      </div>
      <p className="v05-ticket-code">CJU · OCT · 2026 / SEAT TOGETHER</p>
    </section>
  );
}

function JourneyProgress() {
  return (
    <section className="v05-progress">
      <div className="v05-section-title v05-section-title--center">
        <span>04 · OUR JOURNEY</span>
        <h2>우리의 여행,<br />여기까지 왔어요.</h2>
      </div>
      <div className="v05-progress__path">
        <motion.div
          className="v05-progress__line"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.8, ease: easePaper }}
        />
        <div className="v05-progress__steps">
          {progress.map(([number, label], index) => (
            <motion.div
              key={number}
              className={number === "0.5" ? "is-current" : ""}
              initial={{ opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + index * 0.15, type: "spring" }}
            >
              <span>{number}</span>
              <small>{label}</small>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="v05-progress__now">지금 우리는 <strong>10월의 제주</strong>를 상상하는 중</p>
    </section>
  );
}

function SecretEnvelope() {
  const [tried, setTried] = useState(false);

  return (
    <section className="v05-secret">
      <p className="v05-secret__eyebrow">ONE MORE LETTER?</p>
      <motion.button
        type="button"
        className="v05-secret__envelope"
        onClick={() => setTried(true)}
        animate={tried ? { rotate: [0, -2, 2, -1, 1, 0], x: [0, -3, 3, -2, 2, 0] } : {}}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.58 }}
        aria-describedby="secret-message"
      >
        <span className="v05-secret__flap" />
        <span className="v05-secret__lock">⌾</span>
        <small>next chapter</small>
      </motion.button>
      <AnimatePresence>
        {tried && (
          <motion.p
            id="secret-message"
            className="v05-secret__message"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            조금만 기다려 주세요 :)
          </motion.p>
        )}
      </AnimatePresence>
      <p className="v05-secret__foot">편지는 아직 여기까지예요.<br />다음 이야기는 제주로 가는 길에 다시 만나요.</p>
      <div className="v05-secret__mark">LET&apos;S JEJU <span>●</span> 2026</div>
    </section>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = "version-v0-5";
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  const openLetter = () => {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 1550);
  };

  return (
    <main className="v05-site">
      <Opening opened={opened} onOpen={openLetter} />
      <motion.div
        ref={contentRef}
        className="v05-scrapbook"
        aria-hidden={!opened}
        initial={false}
        animate={opened ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
      >
        <IntroLetter />
        <October />
        <Gallery />
        <Keywords />
        <JourneyProgress />
        <SecretEnvelope />
      </motion.div>
    </main>
  );
}

export function mountV05(root: HTMLElement): void {
  createRoot(root).render(<App />);
}
