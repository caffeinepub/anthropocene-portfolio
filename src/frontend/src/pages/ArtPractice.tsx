import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AnthropoceneAnchor } from "../components/AnthropoceneAnchor";
import { MeltingPlane } from "../components/MeltingPlane";
import { useCursor } from "../context/CursorContext";

// ─── Artwork image list ──────────────────────────────────────────────────────

const ARTWORKS = [
  "/art-01.jpg",
  "/art-02.jpg",
  "/art-03.jpg",
  "/art-04.jpg",
  "/art-05.jpg",
  "/art-06.jpg",
];

const PLANE_GAP = 4.5;

// ─── Scroll-linked camera ────────────────────────────────────────────────────

function ScrollCamera() {
  const { camera } = useThree();
  const targetY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      targetY.current = -(window.scrollY / window.innerHeight) * PLANE_GAP;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    camera.position.y += (targetY.current - camera.position.y) * 0.08;
  });

  return null;
}

// ─── ArtPractice page ────────────────────────────────────────────────────────

export function ArtPractice() {
  const { setSuppressDefaultLabel } = useCursor();

  // Suppress "Click to enable sound" cursor text on this page
  useEffect(() => {
    setSuppressDefaultLabel(true);
    return () => setSuppressDefaultLabel(false);
  }, [setSuppressDefaultLabel]);

  // Total scroll height so the user can scroll through all planes
  const scrollHeight = `${(ARTWORKS.length - 1) * PLANE_GAP * 100 + 100}vh`;

  return (
    <div
      data-ocid="art.page"
      style={{
        position: "relative",
        background: "#000000",
        cursor: "none",
      }}
    >
      {/* Scroll space driver */}
      <div style={{ height: scrollHeight }} />

      {/* Fixed full-screen WebGL canvas */}
      <Canvas
        style={{ position: "fixed", inset: 0, zIndex: 1 }}
        camera={{ fov: 50, position: [0, 0, 5] }}
        gl={{ alpha: false, antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000000"]} />
        <ScrollCamera />
        {ARTWORKS.map((url, i) => (
          <MeltingPlane
            key={url}
            imageUrl={url}
            index={i}
            baseY={-i * PLANE_GAP}
          />
        ))}
      </Canvas>

      {/* HTML overlay — pointer-events disabled globally except the anchor */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <AnthropoceneAnchor />
        </div>
      </div>

      {/* Footer attribution */}
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
