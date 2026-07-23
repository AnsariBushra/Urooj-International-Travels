"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GeometricPatternBackgroundProps {
  /** Hex colors for the line strokes, cycled across the generated stars */
  colors?: number[];
}

/**
 * A field of slowly-rotating 8-pointed star outlines — the classic
 * "khatam" / Islamic geometric star motif seen in mosque tilework and
 * mashrabiya screens — rendered as thin glowing wireframe line loops
 * in Three.js. Chosen deliberately over generic particles/blobs for
 * sections that want a backdrop with an explicit cultural reference
 * to Islamic geometric art, rather than a decorative abstract pattern.
 *
 * Each star is built once as a LineLoop from 16 points (8 outer tips,
 * 8 inner valleys alternating at two radii), then placed at a random
 * depth/position and given its own slow independent rotation speed —
 * cheap to compute, no per-frame geometry rebuilding.
 */
export default function GeometricPatternBackground({
  colors = [0xd9a441, 0xbfe3f0, 0xbfe0cb, 0xdcd2f0],
}: GeometricPatternBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = host.clientWidth;
    let h = host.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(w, h);
    host.appendChild(renderer.domElement);

    // Build one reusable 8-pointed star outline (16-point loop, two
    // alternating radii) as a flat line geometry centred at the origin.
    function buildStarGeometry(outerR: number, innerR: number) {
      const points: THREE.Vector3[] = [];
      const spikes = 8;
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (Math.PI / spikes) * i;
        const r = i % 2 === 0 ? outerR : innerR;
        points.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0));
      }
      points.push(points[0].clone());
      return new THREE.BufferGeometry().setFromPoints(points);
    }

    const starCount = w < 768 ? 5 : 9;
    const stars: { mesh: THREE.LineLoop; spinSpeed: number; floatOffset: number; baseZ: number }[] = [];

    for (let i = 0; i < starCount; i++) {
      const scale = 1.4 + Math.random() * 2.2;
      const geometry = buildStarGeometry(1 * scale, 0.45 * scale);
      const color = colors[i % colors.length];
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.28 });
      const mesh = new THREE.LineLoop(geometry, material);

      mesh.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, -4 - Math.random() * 10);
      mesh.rotation.z = Math.random() * Math.PI;
      scene.add(mesh);

      stars.push({
        mesh,
        spinSpeed: (Math.random() - 0.5) * 0.06,
        floatOffset: Math.random() * Math.PI * 2,
        baseZ: mesh.position.z,
      });
    }

    const handleResize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = reducedMotion ? 0 : clock.getElapsedTime();

      stars.forEach((s) => {
        s.mesh.rotation.z += s.spinSpeed * 0.01;
        s.mesh.position.y += Math.sin(t * 0.2 + s.floatOffset) * 0.002;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      stars.forEach((s) => {
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [colors]);

  return <div ref={hostRef} aria-hidden className="absolute inset-0 z-0" />;
}
