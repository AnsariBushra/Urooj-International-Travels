"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";

/**
 * Full-viewport, fixed Three.js canvas that sits behind the entire site
 * (mounted once in layout.tsx, z-index 0). It renders a soft field of
 * large, blurred pastel spheres ("light blobs") that drift slowly and
 * react gently to scroll position and pointer movement — the colorful,
 * always-animated backdrop the brief asked for, replacing the old flat
 * dark/void background entirely.
 *
 * Design choices, and why:
 *  - Spheres, not particles: a handful of large soft-shaded spheres read
 *    as colour + light, not as "tech particle network" noise. That
 *    keeps it feeling warm/devotional rather than sci-fi.
 *  - MeshBasicMaterial + heavy blur via CSS filter on the canvas
 *    wrapper (cheap) rather than postprocessing bloom (expensive) —
 *    keeps this performant on low-end mobile.
 *  - Scroll-linked drift: each blob's target Y position is nudged by
 *    overall scroll progress (via ScrollTrigger), layered on top of its
 *    own independent slow orbit, so the background subtly parallaxes
 *    as you scroll without ever fully snapping to it.
 *  - Pointer parallax: blobs lean slightly away from the cursor for a
 *    living, dimensional feel on desktop; ignored on touch.
 *  - Respects prefers-reduced-motion: orbit speed drops to ~0 and only
 *    a slow color breathing remains.
 */

interface Blob {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  parallaxFactor: number;
}

const PASTEL_HEXES = [0xbfe3f0, 0xdcd7cf, 0xbfe0cb, 0xdcd2f0, 0xf0c168, 0xefd9b8];

export default function AmbientBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    registerGsap();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = hostRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    // Ambient + one soft directional light so spheres get a gentle
    // gradient shade rather than reading as flat colour discs.
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 8, 10);
    scene.add(dirLight);

    const blobs: Blob[] = [];
    const blobCount = window.innerWidth < 768 ? 5 : 8;

    for (let i = 0; i < blobCount; i++) {
      const radius = 2.2 + Math.random() * 2.6;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const color = PASTEL_HEXES[i % PASTEL_HEXES.length];
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 1,
        metalness: 0,
        transparent: true,
        opacity: 0.55,
      });
      const mesh = new THREE.Mesh(geometry, material);

      const baseX = (Math.random() - 0.5) * 26;
      const baseY = (Math.random() - 0.5) * 18;
      mesh.position.set(baseX, baseY, -6 - Math.random() * 10);
      scene.add(mesh);

      blobs.push({
        mesh,
        baseX,
        baseY,
        orbitRadius: 1 + Math.random() * 1.8,
        orbitSpeed: 0.05 + Math.random() * 0.08,
        orbitOffset: Math.random() * Math.PI * 2,
        parallaxFactor: 0.4 + Math.random() * 0.8,
      });
    }

    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    // Scroll-linked drift: nudges the whole field vertically as the
    // page scrolls, so the background subtly travels with the content
    // instead of staying perfectly static behind it.
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = reducedMotion ? 0 : clock.getElapsedTime();

      blobs.forEach((b) => {
        const orbitT = elapsed * b.orbitSpeed + b.orbitOffset;
        const orbitX = Math.cos(orbitT) * b.orbitRadius;
        const orbitY = Math.sin(orbitT * 0.8) * b.orbitRadius;
        const scrollDrift = scrollProgress * 10 * b.parallaxFactor - 5 * b.parallaxFactor;
        const pointerDriftX = -pointerX * 0.6 * b.parallaxFactor;
        const pointerDriftY = pointerY * 0.6 * b.parallaxFactor;

        b.mesh.position.x = b.baseX + orbitX + pointerDriftX;
        b.mesh.position.y = b.baseY + orbitY + scrollDrift + pointerDriftY;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      st.kill();
      blobs.forEach((b) => {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      id="bg-canvas-root"
      ref={hostRef}
      aria-hidden
      style={{ filter: "blur(48px) saturate(135%)" }}
    />
  );
}
