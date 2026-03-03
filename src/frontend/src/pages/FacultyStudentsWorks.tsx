import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { AnthropoceneAnchor } from "../components/AnthropoceneAnchor";
import { FacultySubNav } from "../components/FacultySubNav";
import { useVisibility } from "../context/VisibilityContext";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const STUDENTS_WORKS = [
  {
    id: "mw-1",
    title: "Threshold Interfaces",
    student: "Priya Nair",
    year: "2024",
    tags: ["Interaction", "Spatial"],
    color: "#1C1C1C",
  },
  {
    id: "mw-2",
    title: "Soil Memory Archive",
    student: "Arjun Menon",
    year: "2024",
    tags: ["Research", "Material"],
    color: "#141414",
  },
  {
    id: "mw-3",
    title: "Haptic Landscapes",
    student: "Devika Pillai",
    year: "2023",
    tags: ["Tactile", "UX"],
    color: "#181818",
  },
  {
    id: "mw-4",
    title: "Invisible Cartographies",
    student: "Rohan Das",
    year: "2023",
    tags: ["Systems", "Visual"],
    color: "#111111",
  },
  {
    id: "mw-5",
    title: "The Weight of Light",
    student: "Meera Krishnan",
    year: "2024",
    tags: ["Spatial", "Light"],
    color: "#1E1A18",
  },
  {
    id: "mw-6",
    title: "Fermentation as Interface",
    student: "Kiran Varma",
    year: "2022",
    tags: ["Bio", "Interaction"],
    color: "#151210",
  },
  {
    id: "mw-7",
    title: "Drift Protocols",
    student: "Ananya Iyer",
    year: "2023",
    tags: ["Motion", "Systems"],
    color: "#121418",
  },
  {
    id: "mw-8",
    title: "Latent Terrains",
    student: "Vikram Nambiar",
    year: "2022",
    tags: ["Generative", "Spatial"],
    color: "#161616",
  },
];

interface WorkCardProps {
  item: (typeof STUDENTS_WORKS)[0];
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

        {/* Grid */}
        <div
          data-ocid="students.card.list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {STUDENTS_WORKS.map((item, i) => (
            <StudentCard key={item.id} item={item} index={i} />
          ))}
        </div>
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
