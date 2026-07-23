"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Magnetic from "@/components/animation/Magnetic";
import { brand } from "@/data/brand";

/**
 * Footer: deep ink canvas with a field of slowly drifting gold dust
 * particles + a subtle grid of geometric lines (like Islamic tile work).
 * No chunky 3-D shapes. Clean, editorial, atmospheric.
 */
export default function Footer() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || 520;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x1a1710, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -W / 2,
      W / 2,
      H / 2,
      -H / 2,
      0.1,
      100,
    );
    camera.position.z = 10;

    // ── Gold dust particles ──────────────────────────────────────────────
    const COUNT = 260;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 2); // vx, vy
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * W;
      positions[i * 3 + 1] = (Math.random() - 0.5) * H;
      positions[i * 3 + 2] = 0;
      velocities[i * 2] = (Math.random() - 0.5) * 0.18;
      velocities[i * 2 + 1] = 0.12 + Math.random() * 0.22; // drift upward
      sizes[i] = 1.2 + Math.random() * 2.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Round sprite texture
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 32;
    const ctx = spriteCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(217,164,65,1)");
    grad.addColorStop(0.4, "rgba(217,164,65,0.6)");
    grad.addColorStop(1, "rgba(217,164,65,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      map: spriteTex,
      size: 3,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      vertexColors: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Geometric grid lines (Islamic tile-work feel) ────────────────────
    // A sparse diagonal grid of very faint gold lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc49a35,
      transparent: true,
      opacity: 0.06,
    });

    const SPACING = 80;
    const diag = Math.sqrt(W * W + H * H);
    const lineGroup = new THREE.Group();

    for (let x = -diag / 2; x < diag / 2; x += SPACING) {
      // 45° diagonal lines
      const pts = [
        new THREE.Vector3(x, -diag / 2, 0),
        new THREE.Vector3(x + diag, diag / 2, 0),
      ];
      lineGroup.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat),
      );
    }
    for (let x = -diag / 2; x < diag / 2; x += SPACING) {
      // -45° diagonal lines
      const pts = [
        new THREE.Vector3(x, diag / 2, 0),
        new THREE.Vector3(x + diag, -diag / 2, 0),
      ];
      lineGroup.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat),
      );
    }
    scene.add(lineGroup);

    // ── Horizontal glow line near bottom (like a horizon) ────────────────
    const glowLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-W / 2, -H / 2 + 80, 0),
      new THREE.Vector3(W / 2, -H / 2 + 80, 0),
    ]);
    const glowLineMat = new THREE.LineBasicMaterial({
      color: 0xd9a441,
      transparent: true,
      opacity: 0.18,
    });
    scene.add(new THREE.Line(glowLineGeo, glowLineMat));

    // ── Mouse parallax on grid ───────────────────────────────────────────
    let mx = 0,
      my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 12;
      my = (e.clientY / window.innerHeight - 0.5) * -6;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Animate ──────────────────────────────────────────────────────────
    let raf: number;
    const pos = geo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      for (let i = 0; i < COUNT; i++) {
        let px = pos.array[i * 3] as number;
        let py = pos.array[i * 3 + 1] as number;

        px += velocities[i * 2];
        py += velocities[i * 2 + 1];

        // wrap
        if (py > H / 2 + 10) {
          py = -H / 2 - 10;
          px = (Math.random() - 0.5) * W;
        }
        if (px > W / 2 + 10) px = -W / 2 - 10;
        if (px < -W / 2 - 10) px = W / 2 + 10;

        (pos.array as Float32Array)[i * 3] = px;
        (pos.array as Float32Array)[i * 3 + 1] = py;
      }
      pos.needsUpdate = true;

      // Gentle grid parallax
      lineGroup.position.x += (mx - lineGroup.position.x) * 0.05;
      lineGroup.position.y += (my - lineGroup.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#1a1710", minHeight: "520px" }}
    >
      {/* Three.js canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        aria-hidden
        style={{ minHeight: "520px" }}
      />

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, rgba(196,154,53,0.12) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-[520px] flex-col justify-between px-6 pb-10 pt-16 md:px-10">
        {/* Big centred headline */}
        <div className="text-center">
          <p
            className="font-display text-[clamp(2rem,5vw,3.8rem)] font-normal leading-snug"
            style={{
              color: "rgba(248,246,243,0.92)",
              textShadow: "0 2px 32px rgba(196,154,53,0.3)",
            }}
          >
            Every journey begins
            <br />
            with <span style={{ color: "#d9a441" }}>intention.</span>
          </p>
          <p
            className="mt-4 text-xs tracking-[0.28em] uppercase"
            style={{ color: "rgba(248,246,243,0.35)" }}
          >
            Hajj · Umrah · Ziyaratein
          </p>

          {/* Gold divider */}
          <div
            className="mx-auto mt-8 flex items-center gap-4"
            style={{ maxWidth: "280px" }}
          >
            <div
              className="h-px flex-1"
              style={{ background: "rgba(196,154,53,0.3)" }}
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon
                points="8,1 9.4,5.8 14.5,5.8 10.5,8.7 11.9,13.5 8,10.6 4.1,13.5 5.5,8.7 1.5,5.8 6.6,5.8"
                fill="#c49a35"
                opacity="0.7"
              />
            </svg>
            <div
              className="h-px flex-1"
              style={{ background: "rgba(196,154,53,0.3)" }}
            />
          </div>
        </div>

        {/* Links */}
        <div>
          <div
            className="grid grid-cols-1 gap-10 border-t pt-10 md:grid-cols-12"
            style={{ borderColor: "rgba(248,246,243,0.08)" }}
          >
            {/* Brand */}
            <div className="text-center md:text-left md:col-span-4">
              <span
                className="font-display text-xl"
                style={{ color: "rgba(248,246,243,0.88)" }}
              >
                {brand.name}
              </span>
              <p
                className="mx-auto mt-3 max-w-xs text-sm leading-relaxed md:mx-0"
                style={{ color: "rgba(248,246,243,0.4)" }}
              >
                {brand.tagline}
              </p>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left md:col-span-3 md:col-start-6">
              <span
                className="label-eyebrow mb-3 block"
                style={{ color: "rgba(248,246,243,0.4)" }}
              >
                Reach us
              </span>
              <Magnetic
                as="a"
                href={`mailto:${brand.email}`}
                data-cursor="link"
                className="block text-sm underline-offset-4 hover:underline transition-opacity hover:opacity-100"
                style={{ color: "rgba(248,246,243,0.75)" }}
              >
                {brand.email}
              </Magnetic>
              <Magnetic
                as="a"
                href={`tel:${brand.phone}`}
                data-cursor="link"
                className="mt-1.5 block text-sm underline-offset-4 hover:underline"
                style={{ color: "rgba(248,246,243,0.5)" }}
              >
                {brand.phone}
              </Magnetic>
              <p
                className="mt-1.5 text-sm"
                style={{ color: "rgba(248,246,243,0.35)" }}
              >
                {brand.address}
              </p>
            </div>

            {/* Socials */}
            <div className="text-center md:text-left md:col-span-3 md:col-start-10">
              <span
                className="label-eyebrow mb-3 block"
                style={{ color: "rgba(248,246,243,0.4)" }}
              >
                Follow
              </span>
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {brand.socials.map((s) => (
                  <Magnetic
                    key={s.label}
                    as="a"
                    href={s.href}
                    data-cursor="link"
                    className="block text-sm underline-offset-4 hover:underline"
                    style={{ color: "rgba(248,246,243,0.75)" }}
                  >
                    {s.label}
                  </Magnetic>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="mt-20 flex flex-col items-center gap-2  text-center text-xs md:flex-row md:justify-between md:items-center md:text-left"
            style={{ color: "rgba(248,246,243,0.25)" }}
          >
            <span>
              © {new Date().getFullYear()} {brand.name}. All rights reserved.
            </span>
            <span style={{ color: "rgba(196,154,53,0.5)" }}>
              ✦ May Allah accept your worship
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
