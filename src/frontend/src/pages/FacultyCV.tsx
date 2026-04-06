import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { AnthropoceneAnchor } from "../components/AnthropoceneAnchor";
import { FacultySubNav } from "../components/FacultySubNav";
import { useActor } from "../hooks/useActor";

const STATIC_CV = "/assets/uploads/CV_Abhishek-Tiwari-2-1.pdf";
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export function FacultyCV() {
  const { actor } = useActor();
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getCvPdf()
      .then((data) => {
        console.log("[FacultyCV] PDF URL from backend:", data);
        const src = data?.trim() ? data : STATIC_CV;
        console.log("[FacultyCV] Using PDF src:", src);
        setPdfSrc(src);
      })
      .catch((err: unknown) => {
        console.error("[FacultyCV] Failed to fetch CV PDF:", err);
        setPdfSrc(STATIC_CV);
      })
      .finally(() => setLoading(false));
  }, [actor]);

  // Fallback timeout — show static CV if actor never loads
  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) {
        console.warn("[FacultyCV] Timeout fallback triggered, using static CV");
        setPdfSrc(STATIC_CV);
        setLoading(false);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [loading]);

  const finalSrc = pdfSrc ?? STATIC_CV;
  // Append #view=FitH only for real URLs (blob/http), not local paths
  const iframeSrc = finalSrc.startsWith("http")
    ? `${finalSrc}#view=FitH`
    : finalSrc;

  return (
    <div
      data-ocid="cv.page"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        cursor: "none",
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

      <AnthropoceneAnchor />
      <FacultySubNav />

      {loading ? (
        <div
          data-ocid="cv.loading_state"
          className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]"
          style={{ flex: 1 }}
        >
          <Skeleton className="w-[80vw] h-[85vh] bg-[#1a1a1a]" />
        </div>
      ) : (
        <div style={{ flex: 1, position: "relative", zIndex: 5 }}>
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title="Curriculum Vitae — Abhishek Tiwari"
            data-ocid="cv.canvas_target"
            style={{
              width: "100%",
              height: "calc(100dvh - 120px)",
              border: "none",
              display: "block",
            }}
            allow="fullscreen"
          />

          {/* Floating Download button */}
          <a
            href={finalSrc}
            download
            target="_blank"
            rel="noreferrer"
            data-ocid="cv.download_button"
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#8C3A3A",
              color: "#E5E0D8",
              padding: "0.6rem 1.1rem",
              fontFamily: '"JetBrains Mono", "Geist Mono", monospace',
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "none",
              borderRadius: "0",
              cursor: "default",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#a84545";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#8C3A3A";
            }}
            aria-label="Download CV PDF"
          >
            {/* Download icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CV
          </a>
        </div>
      )}
    </div>
  );
}
