"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A small, self-contained Three.js scene built specifically for the
 * footer: a deep indigo night sky, a field of twinkling stars, and a
 * glowing gold crescent moon that drifts gently — a direct visual
 * reference to the night prayers and desert skies of Hajj/Umrah,
 * rather than a generic "particles in space" effect.
 *
 * Unlike AmbientBackground (which is fixed/full-page), this canvas is
 * scoped to the footer element itself: absolutely positioned, sized
 * to its parent, and disposed on unmount. It sits behind the footer's
 * content at z-index 0 with the text/links at z-index 10+.
 */
export default function NightSkyBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getSize = () => ({ w: host.clientWidth, h: host.clientHeight });
    let { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(w, h);
    host.appendChild(renderer.domElement);

    // ---- Starfield -------------------------------------------------
    const starCount = w < 640 ? 90 : 180;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const twinklePhase = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 16 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
      twinklePhase[i] = Math.random() * Math.PI * 2;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xfff3d6,
      size: 0.16,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ---- Crescent moon ----------------------------------------------
    // Built from two overlapping circles (a classic crescent technique):
    // a solid gold disc, with a second, slightly offset disc cut out of
    // it using a stencil-less trick — render the "shadow" disc in the
    // background colour on top, offset toward one side.
    const moonGroup = new THREE.Group();

    const moonGlow = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 48),
      new THREE.MeshBasicMaterial({ color: 0xf0c168, transparent: true, opacity: 0.18 })
    );
    moonGroup.add(moonGlow);

    const moonDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 48),
      new THREE.MeshBasicMaterial({ color: 0xf0c168 })
    );
    moonGroup.add(moonDisc);

    const moonShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.3, 48),
      new THREE.MeshBasicMaterial({ color: 0x1c2541 })
    );
    moonShadow.position.set(0.85, 0.35, 0.01);
    moonGroup.add(moonShadow);

    moonGroup.position.set(w > 768 ? 9 : 5.5, 4.5, -2);
    scene.add(moonGroup);

    // ---- Resize ------------------------------------------------------
    const handleResize = () => {
      const size = getSize();
      w = size.w;
      h = size.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      moonGroup.position.x = w > 768 ? 9 : 5.5;
    };
    window.addEventListener("resize", handleResize);

    // ---- Animate -------------------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = reducedMotion ? 0 : clock.getElapsedTime();

      // Twinkle: vary point size via a vertex-free trick — nudge overall
      // material opacity with a fast sine, which reads as shimmer across
      // the whole field without per-star uniforms.
      starMaterial.opacity = 0.7 + Math.sin(t * 1.6) * 0.15;
      stars.rotation.y = t * 0.01;

      // Moon drifts in a slow, large, almost-imperceptible arc — alive,
      // not obviously animating.
      moonGroup.position.y = (w > 768 ? 4.5 : 3.2) + Math.sin(t * 0.12) * 0.3;
      moonGroup.rotation.z = Math.sin(t * 0.08) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      starGeometry.dispose();
      starMaterial.dispose();
      moonGlow.geometry.dispose();
      (moonGlow.material as THREE.Material).dispose();
      moonDisc.geometry.dispose();
      (moonDisc.material as THREE.Material).dispose();
      moonShadow.geometry.dispose();
      (moonShadow.material as THREE.Material).dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0 z-0" />;
}
