import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AnthropoceneAnchor } from "../components/AnthropoceneAnchor";
import { FacultySubNav } from "../components/FacultySubNav";
import { useVisibility } from "../context/VisibilityContext";
import { getBackend } from "../utils/getBackend";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

// Cycle of card background colors — same as original design
const CARD_COLORS = [
  "#1C1C1C",
  "#141414",
  "#181818",
  "#111111",
  "#1E1A18",
  "#151210",
  "#121418",
  "#161616",
];

interface StudentWorkDisplay {
  id: string;
  title: string;
  student: string;
  year: string;
  tags: string[];
  color: string;
}

interface WorkCardProps {
  item: StudentWorkDisplay;
  index: number;
}

function StudentCard({ item, index }: WorkCardProps) {
  const { isVisible, toggleVisibility } = useVisibility();
  const visible = isVisible(item.id);

  return (
    <motion.div
      data-ocid={`students.card.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: 4 }}
      transition={{
        duration: 0.6,
        delay: 0.08 * index,
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", stiffness: 120, damping: 18, delay: 0 },
        y: { type: "spring", stiffness: 120, damping: 18, delay: 0 },
      }}
      style={{
        backgroundColor: item.color,
        minHeight: "280px",
        borderRadius: "2px",
        border: "1px solid rgba(229,224,216,0.06)",
        position: "relative",
        overflow: "hidden",
        cursor: "none",
      }}
    >
      {/* Private overlay */}
      {!visible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(229,224,216,0.3)",
            }}
          >
            Private
          </p>
        </div>
      )}

      {/* Eye toggle */}
      <button
        type="button"
        data-ocid={`students.card.toggle.${index + 1}`}
        onClick={() => toggleVisibility(item.id)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
          background: "none",
          border: "none",
          padding: "0",
          cursor: "none",
          color: "rgba(229,224,216,0.4)",
          transition: "color 0.2s ease",
          lineHeight: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "rgba(229,224,216,1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "rgba(229,224,216,0.4)";
        }}
      >
        {visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>

      {/* Card content */}
      <div
        style={{
          padding: "1.75rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "280px",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ marginTop: "auto" }}>
          <p
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(17px, 1.8vw, 22px)",
              color: "#E5E0D8",
              margin: "0 0 0.4rem",
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              color: "rgba(229,224,216,0.4)",
              margin: "0 0 0.75rem",
            }}
          >
            {item.student} — {item.year}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(229,224,216,0.28)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FacultyStudentsWorks() {
  const [works, setWorks] = useState<StudentWorkDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBackend()
      .then((b) => b.listLiveStudentWorks())
      .then((items) => {
        const mapped: StudentWorkDisplay[] = items.map((item, i) => ({
          id: String(item.id),
          title: item.title,
          student: item.student,
          year: item.year,
          tags: item.tags,
          color: CARD_COLORS[i % CARD_COLORS.length],
        }));
        setWorks(mapped);
      })
      .catch(() => {
        setWorks([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      data-ocid="students.page"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#080808",
        cursor: "none",
        position: "relative",
      }}
    >
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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2.5rem 2rem 6rem",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "3.5rem" }}
        >
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(229,224,216,0.3)",
              marginBottom: "0.75rem",
            }}
          >
            Student Projects — Selected Works
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: "clamp(32px, 4.5vw, 64px)",
              color: "#E5E0D8",
              margin: 0,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Students Works
          </h1>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            data-ocid="students.loading_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  height: "280px",
                  background: "rgba(229,224,216,0.03)",
                  borderRadius: "2px",
                  border: "1px solid rgba(229,224,216,0.05)",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && works.length === 0 && (
          <motion.div
            data-ocid="students.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: "6rem 0", textAlign: "center" }}
          >
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(229,224,216,0.2)",
                margin: 0,
              }}
            >
              No student works published yet
            </p>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && works.length > 0 && (
          <div
            data-ocid="students.card.list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {works.map((item, i) => (
              <StudentCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </main>

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
              cursor: "none",
            }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
