import { shaderMaterial } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useCursor } from "../context/CursorContext";

// ─── GLSL shaders ──────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289v3(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float baseNoise = snoise(vUv * 3.0 + uTime * 0.08) * 0.004;
    float n = snoise(vUv * 4.0 + uTime * 0.3);
    float distortAmt = uHover * 0.045 * n;
    vec2 distortedUV = vUv + vec2(
      snoise(vUv * 5.0 + uTime * 0.2) * distortAmt,
      n * distortAmt
    ) + baseNoise;
    gl_FragColor = texture2D(uTexture, distortedUV);
  }
`;

// ─── Shader material factory ────────────────────────────────────────────────

const MeltMaterial = shaderMaterial(
  { uTexture: new THREE.Texture(), uHover: 0, uTime: 0 },
  vertexShader,
  fragmentShader,
);

extend({ MeltMaterial });

// ─── TypeScript declaration for extended JSX element ────────────────────────

type MeltMaterialType = InstanceType<typeof MeltMaterial>;

declare module "@react-three/fiber" {
  interface ThreeElements {
    meltMaterial: {
      ref?: React.Ref<MeltMaterialType>;
      uTexture?: THREE.Texture;
      uHover?: number;
      uTime?: number;
      attach?: string;
      key?: React.Key;
    };
  }
}

// ─── Inner plane that uses useTexture (must be inside Suspense) ─────────────

interface MeltingPlaneInnerProps {
  imageUrl: string;
  index: number;
  baseY: number;
}

function MeltingPlaneInner({ imageUrl, index, baseY }: MeltingPlaneInnerProps) {
  const texture = useTexture(imageUrl);
  const matRef = useRef<InstanceType<typeof MeltMaterial> | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const targetHover = useRef(0);
  const { setCursorLabel } = useCursor();
  const { gl } = useThree();

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.getElapsedTime();
    matRef.current.uHover +=
      (targetHover.current - matRef.current.uHover) * 0.06;

    if (!meshRef.current) return;
    meshRef.current.position.y =
      baseY + Math.sin(clock.getElapsedTime() * 0.4 + index) * 0.06;
    meshRef.current.rotation.z =
      Math.sin(clock.getElapsedTime() * 0.25 + index * 0.5) * 0.008;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, baseY, 0]}
      onPointerOver={() => {
        targetHover.current = 1;
        setCursorLabel("Interact");
        gl.domElement.style.cursor = "none";
      }}
      onPointerOut={() => {
        targetHover.current = 0;
        setCursorLabel("");
      }}
    >
      <planeGeometry args={[5.5, 3.09375]} />
      <meltMaterial ref={matRef} uTexture={texture} uHover={0} uTime={0} />
    </mesh>
  );
}

// ─── Fallback placeholder plane for failed textures ─────────────────────────

function FallbackPlane({ baseY }: { baseY: number }) {
  return (
    <mesh position={[0, baseY, 0]}>
      <planeGeometry args={[5.5, 3.09375]} />
      <meshBasicMaterial color="#111111" />
    </mesh>
  );
}

// ─── Error boundary component ────────────────────────────────────────────────

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── Public export ───────────────────────────────────────────────────────────

export interface MeltingPlaneProps {
  imageUrl: string;
  index: number;
  baseY: number;
}

import { Suspense } from "react";

export function MeltingPlane({ imageUrl, index, baseY }: MeltingPlaneProps) {
  return (
    <TextureErrorBoundary fallback={<FallbackPlane baseY={baseY} />}>
      <Suspense fallback={<FallbackPlane baseY={baseY} />}>
        <MeltingPlaneInner imageUrl={imageUrl} index={index} baseY={baseY} />
      </Suspense>
    </TextureErrorBoundary>
  );
}
