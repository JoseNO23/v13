'use client';

import { useState } from 'react';

export default function Loading() {
  const [speed, setSpeed] = useState('0.85s');

  return (
    <div className="loader-stage">
      <div className="loader-card">
        <p className="loader-label">cargando</p>

        <div className="loader4-wrap" role="status" aria-label="Cargando">
          <div className="loader4" style={{ ['--speed' as string]: speed }} />
          <div className="loader4-glitch" aria-hidden="true" />
        </div>

        <p className="loader-hint">no mires atrás</p>

        <div className="loader-controls" aria-hidden="false">
          <button type="button" onClick={() => setSpeed('0.55s')}>
            más rápido
          </button>
          <button type="button" onClick={() => setSpeed('0.85s')}>
            normal
          </button>
          <button type="button" onClick={() => setSpeed('1.25s')}>
            más lento
          </button>
        </div>
      </div>

      <div className="vhs-noise" aria-hidden="true" />
      <div className="vhs-scan" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <style jsx>{`
        :global(:root) {
          color-scheme: dark;
          --bg0: #040406;
          --bg1: #07080c;
          --red: #ff2a2a;
          --red2: #ff4b6a;
          --ink: rgba(255, 255, 255, 0.9);
          --muted: rgba(255, 255, 255, 0.65);
          --glass: rgba(255, 255, 255, 0.04);
          --line: rgba(255, 255, 255, 0.08);
        }

        :global(*) {
          box-sizing: border-box;
        }

        .loader-stage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          position: relative;
          padding: 24px;
          background:
            radial-gradient(1200px 700px at 50% 35%, rgba(255, 42, 42, 0.08), transparent 60%),
            radial-gradient(900px 500px at 50% 55%, rgba(255, 75, 106, 0.05), transparent 70%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
          color: var(--ink);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          overflow: hidden;
        }

        .loader-card {
          width: min(520px, 92vw);
          border: 1px solid var(--line);
          background:
            radial-gradient(500px 240px at 50% 0%, rgba(255, 42, 42, 0.1), transparent 60%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
          border-radius: 18px;
          padding: 26px 22px 22px;
          text-align: center;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
          position: relative;
          overflow: hidden;
        }

        .loader-card::before {
          content: '';
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 50% 30%, rgba(255, 42, 42, 0.1), transparent 55%);
          filter: blur(18px);
          opacity: 0.7;
          pointer-events: none;
        }

        .loader-label {
          margin: 0 0 14px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.78);
          position: relative;
          z-index: 1;
        }

        .loader-hint {
          margin: 14px 0 0;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          opacity: 0.9;
          position: relative;
          z-index: 1;
          animation: hintFlicker 5.5s linear infinite;
        }

        .loader4-wrap {
          width: fit-content;
          margin: 0 auto;
          position: relative;
          padding: 12px;
          z-index: 1;
        }

        .loader4 {
          --size: 56px;
          --thickness: 4px;
          --speed: 0.85s;

          width: var(--size);
          height: var(--size);
          border-radius: 999px;
          display: inline-block;
          position: relative;

          background:
            conic-gradient(
              from 0turn,
              transparent 0turn,
              rgba(255, 255, 255, 0.08) 0.08turn,
              rgba(255, 42, 42, 0.95) 0.18turn,
              rgba(255, 75, 106, 0.85) 0.28turn,
              transparent 0.46turn,
              transparent 1turn
            );

          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--thickness)), #000 0);
          mask: radial-gradient(farthest-side, transparent calc(100% - var(--thickness)), #000 0);

          filter:
            blur(0.15px)
            drop-shadow(0 0 12px rgba(255, 42, 42, 0.35))
            drop-shadow(0 0 2px rgba(255, 255, 255, 0.1));

          animation: spin var(--speed) linear infinite;
        }

        .loader4::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 50% 7%, rgba(255, 255, 255, 0.85) 0 3px, transparent 4px);
          opacity: 0.8;
          filter: blur(0.35px);
          pointer-events: none;
        }

        .loader4::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: inherit;
          -webkit-mask: inherit;
          mask: inherit;
          filter: blur(0.25px);
          opacity: 0.35;
          transform: translateX(1px);
          mix-blend-mode: screen;
          animation: ghost 2.8s steps(8) infinite;
          pointer-events: none;
        }

        .loader4-glitch {
          position: absolute;
          inset: 8px;
          border-radius: 999px;
          pointer-events: none;
          opacity: 0;
          background:
            linear-gradient(0deg, transparent 0 45%, rgba(255, 255, 255, 0.1) 46% 52%, transparent 53% 100%),
            linear-gradient(90deg, rgba(255, 42, 42, 0.1), rgba(0, 255, 255, 0.06));
          filter: blur(0.6px);
          mix-blend-mode: screen;
          animation: glitch 2.9s infinite;
        }

        .loader-controls {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .loader-controls button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.82);
          padding: 8px 10px;
          border-radius: 10px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 11px;
        }

        .loader-controls button:hover {
          background: rgba(255, 42, 42, 0.1);
          border-color: rgba(255, 42, 42, 0.22);
        }

        .vhs-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.07;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 260% 260%;
          mix-blend-mode: overlay;
          animation: noise 1s infinite alternate;
        }

        .vhs-scan {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.16;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.55) 51%);
          background-size: 100% 4px;
          mix-blend-mode: overlay;
          animation: scan 0.22s linear infinite;
        }

        .vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 0%, transparent 62%, rgba(0, 0, 0, 0.92) 100%);
          opacity: 0.75;
        }

        @keyframes spin {
          to {
            transform: rotate(1turn);
          }
        }

        @keyframes ghost {
          0%,
          100% {
            transform: translateX(0px);
            opacity: 0.18;
          }
          35% {
            transform: translateX(-1px);
            opacity: 0.32;
          }
          70% {
            transform: translateX(1px);
            opacity: 0.26;
          }
        }

        @keyframes glitch {
          0%,
          68%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }
          72% {
            opacity: 0.75;
            transform: translateY(-1px);
          }
          74% {
            opacity: 0.35;
            transform: translateY(1px);
          }
          77% {
            opacity: 0.55;
            transform: translateY(0);
          }
          80% {
            opacity: 0;
          }
        }

        @keyframes hintFlicker {
          0% {
            opacity: 0.75;
          }
          12% {
            opacity: 0.45;
          }
          18% {
            opacity: 0.85;
          }
          55% {
            opacity: 0.55;
          }
          62% {
            opacity: 0.92;
          }
          100% {
            opacity: 0.75;
          }
        }

        @keyframes noise {
          0%,
          100% {
            background-position: 0 0;
          }
          20% {
            background-position: -15% 5%;
          }
          40% {
            background-position: 20% 25%;
          }
          60% {
            background-position: 15% 5%;
          }
          80% {
            background-position: -10% 10%;
          }
        }

        @keyframes scan {
          to {
            background-position: 0 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader4,
          .loader4::before,
          .loader4-glitch,
          .vhs-noise,
          .vhs-scan,
          .loader-hint {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
