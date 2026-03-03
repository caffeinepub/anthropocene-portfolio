import { Maximize2, Minimize2, Send, X } from "lucide-react";
import {
  AnimatePresence,
  type Easing,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnthropoceneAnchor } from "../components/AnthropoceneAnchor";
import { FacultySubNav } from "../components/FacultySubNav";
import { useCursor } from "../context/CursorContext";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const LECTURES = [
  {
    id: "what-is-a-website",
    title: "What is a Website?",
    prototypeUrl: "https://bounce-radio-93063170.figma.site",
    description:
      "In this 40-minute session, we demystified how websites work by grounding digital concepts in the physical world. I compared online presence to physical retail: just as sellers lease shops or showrooms to display goods, we purchase domains to secure our 'digital real estate.' This analogy helped students understand a website as a cultivated, presentable space for the virtual world.",
    duration: "40 min · Live session",
  },
  {
    id: "what-is-auto-layout",
    title: "What is Auto Layout?",
    prototypeUrl: "https://jasper-casual-34052988.figma.site",
    description:
      "During our web and desktop design course, students consistently struggled with Figma's Auto Layout. To help them work faster and more efficiently, I hosted a focused 40-minute live demonstration session. This hands-on workshop broke down exactly what Auto Layout is and why it's essential, giving students the practical skills to instantly streamline their design workflows.",
    duration: "40 min · Live session",
  },
];

const AI_RESPONSES = [
  "The quarry remembers every extraction. What does the material want to become?",
  "Interaction is never neutral — every affordance carries the weight of its maker's assumptions.",
  "In ecological design, the boundary between system and environment is always provisional.",
  "Post-digital materiality asks: what survives the screen?",
  "Every invisible infrastructure was once a radical proposition.",
];

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
}

function EcologyAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed-0",
      role: "ai",
      text: "The quarry remembers every extraction. What does the material want to become?",
    },
    {
      id: "seed-1",
      role: "user",
      text: "How do we design for what we cannot yet see?",
    },
    {
      id: "seed-2",
      role: "ai",
      text: "In ecological design, the boundary between system and environment is always provisional.",
    },
  ]);
  const [input, setInput] = useState("");
  const responseIndexRef = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextAiResponse =
      AI_RESPONSES[responseIndexRef.current % AI_RESPONSES.length];
    responseIndexRef.current += 1;

    const ts = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: `user-${ts}`, role: "user", text: trimmed },
      { id: `ai-${ts}`, role: "ai", text: nextAiResponse },
    ]);
    setInput("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <>
      <motion.button
        type="button"
        data-ocid="ecology-ai.open_modal_button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 60,
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "rgba(74,74,74,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(229,224,216,0.12)",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={16} color="rgba(229,224,216,0.8)" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#E5E0D8",
                display: "block",
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="ecology-ai.dialog"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: "5rem",
              right: "1.5rem",
              zIndex: 55,
              width: "340px",
              height: "420px",
              background: "rgba(74,74,74,0.15)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(229,224,216,0.08)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem 0.75rem",
                borderBottom: "1px solid rgba(229,224,216,0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(229,224,216,0.5)",
                  margin: 0,
                }}
              >
                Ecology AI
              </p>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color:
                        msg.role === "ai"
                          ? "rgba(229,224,216,0.75)"
                          : "rgba(229,224,216,0.55)",
                      background:
                        msg.role === "user"
                          ? "rgba(229,224,216,0.07)"
                          : "transparent",
                      padding: msg.role === "user" ? "0.4rem 0.75rem" : "0",
                      borderRadius:
                        msg.role === "user" ? "8px 8px 2px 8px" : "0",
                      margin: 0,
                      maxWidth: "85%",
                      fontStyle: msg.role === "ai" ? "italic" : "normal",
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid rgba(229,224,216,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                data-ocid="ecology-ai.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask the ecology..."
                style={{
                  flex: 1,
                  background: "rgba(229,224,216,0.05)",
                  border: "1px solid rgba(229,224,216,0.08)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "12px",
                  color: "rgba(229,224,216,0.8)",
                  outline: "none",
                  cursor: "text",
                }}
              />
              <button
                type="button"
                data-ocid="ecology-ai.submit_button"
                onClick={handleSend}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(229,224,216,0.5)",
                  cursor: "default",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(229,224,216,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(229,224,216,0.5)";
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const containerVariants = {
  rest: { transition: { staggerChildren: 0 } },
  hover: { transition: { staggerChildren: 0.025, delayChildren: 0 } },
};

const wordVariants = {
  rest: { opacity: 0.4 },
  hover: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as Easing },
  },
};

interface LectureData {
  id: string;
  title: string;
  prototypeUrl: string;
  description: string;
  duration: string;
}

function StudioCard({
  lecture,
  index,
}: {
  lecture: LectureData;
  index: number;
}) {
  const { setCursorLabel } = useCursor();
  const [isHoveringPrototype, setIsHoveringPrototype] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, index === 0 ? -40 : -60],
  );

  const words = lecture.description.split(" ");

  return (
    <div ref={cardRef}>
      <motion.div style={{ y: parallaxY }}>
        <motion.div
          data-ocid={`lectures.list.item.${index + 1}`}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: index * 0.15 + 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            background: "#0D0D0D",
            border: "1px solid rgba(229,224,216,0.07)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          {/* Top Row — Title */}
          <div
            style={{
              padding: "2.5rem 3rem 2rem",
              borderBottom: "1px solid rgba(229,224,216,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(229,224,216,0.28)",
                margin: "0 0 0.75rem",
              }}
            >
              Lecture — Interaction Design
            </p>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 800,
                fontSize: "clamp(36px, 5vw, 72px)",
                color: "#E5E0D8",
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              {lecture.title}
            </h2>
          </div>

          {/* Bottom Row — Split View */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "2.5rem",
              padding: "2.5rem 3rem 3rem",
              alignItems: "stretch",
              minHeight: "520px",
            }}
          >
            {/* Left: Prototype Zone — animates between 65% and 100% */}
            <motion.div
              animate={{ width: isExpanded ? "100%" : "65%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                position: "relative",
                flexShrink: 0,
                height: "100%",
                borderRadius: "4px",
                overflow: "hidden",
                background: "#1a1a1a",
                boxShadow:
                  "inset 0 0 40px rgba(0,0,0,0.8), inset 0 0 2px rgba(229,224,216,0.04)",
              }}
              onMouseEnter={() => {
                setIsHoveringPrototype(true);
                setCursorLabel("Interact");
              }}
              onMouseLeave={() => {
                setIsHoveringPrototype(false);
                setCursorLabel("");
              }}
            >
              {/* Subtle top-left label */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1.25rem",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: isHoveringPrototype
                      ? "rgba(229,224,216,0.45)"
                      : "rgba(229,224,216,0.18)",
                    transition: "color 0.3s ease",
                  }}
                >
                  Prototype
                </span>
              </div>

              {/* Expand / Collapse toggle button */}
              <button
                type="button"
                data-ocid={`lectures.list.item.${index + 1}.toggle`}
                onClick={() => setIsExpanded((v) => !v)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 10,
                  background: "rgba(23,23,23,0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: "#E5E0D8",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#8C3A3A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(23,23,23,0.6)";
                }}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <iframe
                src={lecture.prototypeUrl}
                title={`${lecture.title} — Figma Prototype`}
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "480px",
                  border: "none",
                  display: "block",
                  cursor: "default",
                }}
              />
            </motion.div>

            {/* Right: Description Panel — animates between 35% and 0% */}
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={containerVariants}
              animate={{
                width: isExpanded ? "0%" : "35%",
                opacity: isExpanded ? 0 : 1,
              }}
              style={{
                overflow: "hidden",
                flexShrink: 0,
                background: "#8C3A3A",
                borderRadius: "4px",
                padding: isExpanded ? "0" : "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(229,224,216,0.5)",
                    margin: "0 0 1.75rem",
                  }}
                >
                  About this lecture
                </p>
                <p
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                    lineHeight: 1.8,
                    color: "#E5E0D8",
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {words.map((word, i) => (
                    <motion.span
                      // biome-ignore lint/suspicious/noArrayIndexKey: word-by-word kinetic reveal requires stable index keys
                      key={i}
                      variants={wordVariants}
                      style={{
                        display: "inline-block",
                        marginRight: "0.25em",
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </div>

              <div
                style={{
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(229,224,216,0.15)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(229,224,216,0.4)",
                    margin: 0,
                  }}
                >
                  {lecture.duration}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function CursorReset() {
  const { setIsRevealed, setCursorLabel, setSuppressDefaultLabel } =
    useCursor();
  useEffect(() => {
    // On /faculty routes: mark as revealed, clear any label, and suppress
    // the default "Click to enable sound & reveal" text entirely.
    setIsRevealed(true);
    setCursorLabel("");
    setSuppressDefaultLabel(true);
    return () => {
      setCursorLabel("");
      setSuppressDefaultLabel(false);
    };
  }, [setIsRevealed, setCursorLabel, setSuppressDefaultLabel]);
  return null;
}

export function FacultyLectures() {
  return (
    <div
      data-ocid="lectures.page"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#000000",
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Cursor reset — suppresses "Click to enable sound" on this route */}
      <CursorReset />

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          backgroundImage: GRAIN_SVG,
          opacity: 0.038,
        }}
      />

      {/* Anchor */}
      <AnthropoceneAnchor />

      {/* Sub-nav */}
      <FacultySubNav />

      {/* Main content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8rem 2.5rem 10rem",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Module header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingBottom: "4rem" }}
        >
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(229,224,216,0.3)",
              margin: 0,
            }}
          >
            Interaction Design — Lecture Series
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              fontSize: "clamp(28px, 4vw, 56px)",
              color: "#E5E0D8",
              margin: "0.6rem 0 0",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Series: Simple Design Project (WebEcology)
          </h1>
        </motion.div>

        {/* Card list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6rem",
          }}
        >
          {LECTURES.map((lecture, index) => (
            <StudioCard key={lecture.id} lecture={lecture} index={index} />
          ))}
        </div>
      </main>

      {/* Ecology AI floating chat */}
      <EcologyAIChat />

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "rgba(229,224,216,0.18)",
            textAlign: "center",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(229,224,216,0.28)",
              textDecoration: "none",
              pointerEvents: "auto",
              cursor: "default",
            }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
