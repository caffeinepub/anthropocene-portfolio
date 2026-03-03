import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  FrameIcon,
  GalleryHorizontalEnd,
  ImageIcon,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCursor } from "../context/CursorContext";

function CursorReset() {
  const { setIsRevealed, setCursorLabel, setSuppressDefaultLabel } =
    useCursor();
  useEffect(() => {
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

type NavSection = "lectures" | "students-works" | "art-portfolio";

const navItems: {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}[] = [
  {
    id: "lectures",
    label: "Manage Lectures",
    icon: <BookOpen size={13} strokeWidth={1.5} />,
    ocid: "admin.lectures.link",
  },
  {
    id: "students-works",
    label: "Manage Students Works",
    icon: <GalleryHorizontalEnd size={13} strokeWidth={1.5} />,
    ocid: "admin.students_works.link",
  },
  {
    id: "art-portfolio",
    label: "Manage Art Portfolio",
    icon: <ImageIcon size={13} strokeWidth={1.5} />,
    ocid: "admin.art_portfolio.link",
  },
];

interface EntryData {
  id: string;
  title: string;
  status: "Live" | "Draft";
  type: string;
}

interface SectionData {
  title: string;
  description: string;
  entries: EntryData[];
}

const SECTION_CONTENT: Record<NavSection, SectionData> = {
  lectures: {
    title: "Lectures",
    description:
      "Manage lecture cards and embedded Figma prototypes for the WebEcology series.",
    entries: [
      {
        id: "lec-01",
        title: "What is a Website?",
        status: "Live",
        type: "Lecture",
      },
      {
        id: "lec-02",
        title: "What is Auto Layout?",
        status: "Live",
        type: "Lecture",
      },
    ],
  },
  "students-works": {
    title: "Students Works",
    description:
      "Manage and moderate student portfolio submissions from the design faculty.",
    entries: [
      { id: "sw-01", title: "Student Work 01", status: "Live", type: "Work" },
      { id: "sw-02", title: "Student Work 02", status: "Live", type: "Work" },
      { id: "sw-03", title: "Student Work 03", status: "Draft", type: "Work" },
      { id: "sw-04", title: "Student Work 04", status: "Live", type: "Work" },
      { id: "sw-05", title: "Student Work 05", status: "Live", type: "Work" },
      { id: "sw-06", title: "Student Work 06", status: "Draft", type: "Work" },
      { id: "sw-07", title: "Student Work 07", status: "Live", type: "Work" },
    ],
  },
  "art-portfolio": {
    title: "Art Portfolio",
    description:
      "Manage art practice entries and gallery images for the WebGL gallery.",
    entries: [
      {
        id: "ap-01",
        title: "Quarry Painting 01",
        status: "Live",
        type: "Image",
      },
      {
        id: "ap-02",
        title: "Quarry Painting 02",
        status: "Live",
        type: "Image",
      },
      {
        id: "ap-03",
        title: "Quarry Painting 03",
        status: "Draft",
        type: "Image",
      },
      {
        id: "ap-04",
        title: "Quarry Painting 04",
        status: "Live",
        type: "Image",
      },
      {
        id: "ap-05",
        title: "Quarry Painting 05",
        status: "Live",
        type: "Image",
      },
      {
        id: "ap-06",
        title: "Quarry Painting 06",
        status: "Draft",
        type: "Image",
      },
    ],
  },
};

function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const active = isActive || isHovering;

  return (
    <button
      type="button"
      data-ocid={item.ocid}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.7rem 1.25rem 0.7rem 1.5rem",
        background: "transparent",
        border: "none",
        borderLeft: isActive ? "3px solid #8C3A3A" : "3px solid transparent",
        cursor: "default",
        transition:
          "border-color 0.2s ease, opacity 0.2s ease, padding 0.2s ease",
        opacity: active ? 1 : 0.45,
        paddingLeft: isActive ? "1.25rem" : "1.5rem",
        textAlign: "left",
      }}
    >
      <span
        style={{
          color: isActive ? "#8C3A3A" : "rgba(229,224,216,0.6)",
          transition: "color 0.2s ease",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#E5E0D8",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

function EntryRow({
  entry,
  rowIndex,
}: {
  entry: EntryData;
  rowIndex: number;
}) {
  return (
    <motion.div
      data-ocid={`admin.entries.row.${rowIndex}`}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: (rowIndex - 1) * 0.06,
        ease: "easeOut",
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 80px 100px",
        padding: "1rem",
        borderBottom: "1px solid rgba(229,224,216,0.05)",
        alignItems: "center",
        transition: "background 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(229,224,216,0.025)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      {/* Title */}
      <span
        style={{
          fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
          fontSize: "11px",
          color: "rgba(229,224,216,0.65)",
          letterSpacing: "0.02em",
        }}
      >
        {entry.title}
      </span>

      {/* Status */}
      <span
        style={{
          fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
          fontSize: "8px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:
            entry.status === "Draft" ? "rgba(229,224,216,0.25)" : "#8C3A3A",
          opacity: entry.status === "Draft" ? 1 : 0.85,
        }}
      >
        {entry.status}
      </span>

      {/* Type */}
      <span
        style={{
          fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
          fontSize: "8px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(229,224,216,0.2)",
        }}
      >
        {entry.type}
      </span>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          data-ocid={`admin.entries.edit_button.${rowIndex}`}
          style={{
            background: "none",
            border: "1px solid rgba(229,224,216,0.12)",
            padding: "0.25rem 0.6rem",
            fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
            fontSize: "7px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(229,224,216,0.5)",
            cursor: "default",
            borderRadius: "0",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "rgba(229,224,216,0.4)";
            el.style.color = "rgba(229,224,216,0.9)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "rgba(229,224,216,0.12)";
            el.style.color = "rgba(229,224,216,0.5)";
          }}
        >
          Edit
        </button>
        <button
          type="button"
          data-ocid={`admin.entries.delete_button.${rowIndex}`}
          style={{
            background: "none",
            border: "1px solid rgba(140,58,58,0.18)",
            padding: "0.25rem 0.6rem",
            fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
            fontSize: "7px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(140,58,58,0.55)",
            cursor: "default",
            borderRadius: "0",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "#8C3A3A";
            el.style.color = "#8C3A3A";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "rgba(140,58,58,0.18)";
            el.style.color = "rgba(140,58,58,0.55)";
          }}
        >
          Del
        </button>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<NavSection>("lectures");
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);

  const currentSection = SECTION_CONTENT[activeSection];

  return (
    <div
      data-ocid="admin.dashboard.panel"
      style={{
        display: "flex",
        height: "100dvh",
        backgroundColor: "#000000",
        overflow: "hidden",
        cursor: "default",
        position: "relative",
      }}
    >
      <CursorReset />

      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "220px",
          flexShrink: 0,
          backgroundColor: "#1a1a1a",
          borderRight: "1px solid rgba(229,224,216,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sidebar top: brand label + back link */}
        <div
          style={{
            padding: "1.75rem 1.5rem 1.25rem",
            borderBottom: "1px solid rgba(229,224,216,0.06)",
          }}
        >
          {/* System label */}
          <p
            style={{
              fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(229,224,216,0.3)",
              margin: "0 0 0.35rem",
            }}
          >
            Content Management
          </p>
          <p
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.04em",
              color: "#E5E0D8",
              margin: 0,
            }}
          >
            Anthropocene
          </p>
        </div>

        {/* Nav items */}
        <nav
          aria-label="Admin navigation"
          style={{
            flex: 1,
            paddingTop: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
          }}
        >
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </nav>

        {/* Sidebar bottom: back to site */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderTop: "1px solid rgba(229,224,216,0.06)",
          }}
        >
          <button
            type="button"
            data-ocid="admin.back.link"
            onClick={() => navigate({ to: "/" })}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "default",
              opacity: 0.35,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.35";
            }}
          >
            <FrameIcon size={11} color="#E5E0D8" strokeWidth={1.5} />
            <span
              style={{
                fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E5E0D8",
              }}
            >
              Back to site
            </span>
          </button>

          <p
            style={{
              fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
              fontSize: "7px",
              letterSpacing: "0.15em",
              color: "rgba(229,224,216,0.15)",
              margin: "1rem 0 0",
            }}
          >
            v0.1-alpha · No Auth
          </p>
        </div>
      </motion.aside>

      {/* ── Main content ── */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        style={{
          flex: 1,
          backgroundColor: "#000000",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "1.5rem 3rem",
            borderBottom: "1px solid rgba(229,224,216,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(229,224,216,0.25)",
                margin: "0 0 0.3rem",
              }}
            >
              Visual Interface — v0.1 (No Auth)
            </p>
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 800,
                fontSize: "clamp(20px, 2.5vw, 28px)",
                color: "#E5E0D8",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Anthropocene Control Panel
            </h1>
          </div>

          {/* Add New Entry button */}
          <button
            type="button"
            data-ocid="admin.add_entry.primary_button"
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => setIsHoveringAdd(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#8C3A3A",
              border: "none",
              borderRadius: "0",
              padding: "0.75rem 1.5rem",
              fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#E5E0D8",
              cursor: "default",
              transition: "background 0.2s ease",
              opacity: isHoveringAdd ? 1 : 0.9,
              flexShrink: 0,
            }}
          >
            <Plus size={12} strokeWidth={2} />
            Add New Entry
          </button>
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            padding: "2.5rem 3rem",
            overflowY: "auto",
          }}
        >
          {/* Section header */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2.2vw, 30px)",
                  color: "#E5E0D8",
                  margin: 0,
                  letterSpacing: "-0.015em",
                }}
              >
                {currentSection.title}
              </h2>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "rgba(229,224,216,0.3)",
                }}
              >
                {currentSection.entries.length} entries
              </span>
            </div>

            <p
              style={{
                fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                fontSize: "10px",
                letterSpacing: "0.08em",
                color: "rgba(229,224,216,0.38)",
                marginBottom: "2.5rem",
                maxWidth: "480px",
                lineHeight: 1.7,
              }}
            >
              {currentSection.description}
            </p>

            {/* Placeholder rows — design skeleton */}
            <div
              data-ocid="admin.entries.list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 80px 100px",
                  padding: "0.6rem 1rem",
                  borderBottom: "1px solid rgba(229,224,216,0.08)",
                  marginBottom: "0",
                }}
              >
                {["Title", "Status", "Type", "Actions"].map((col) => (
                  <span
                    key={col}
                    style={{
                      fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                      fontSize: "8px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(229,224,216,0.25)",
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {/* Entry rows — keyed by stable ID */}
              {currentSection.entries.map((entry, i) => (
                <EntryRow key={entry.id} entry={entry} rowIndex={i + 1} />
              ))}
            </div>

            {/* Empty state hint */}
            <p
              style={{
                fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(229,224,216,0.12)",
                marginTop: "2rem",
                textAlign: "right",
              }}
            >
              Authentication & database not yet connected
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
