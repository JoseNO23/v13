'use client';

import { useEffect, useId, useRef, useState } from 'react';

// ============================================================================
// VHS Filter Effect - Distorsion VHS con RGB split y displacement
// ============================================================================
export function VHSFilter({
  targetSelector = 'body',
  intensity = 0.8,
  enabled = true,
  filterId,
  applyToTargets = true,
  renderFilter = true,
}: {
  targetSelector?: string | string[];
  intensity?: number;
  enabled?: boolean;
  filterId?: string;
  applyToTargets?: boolean;
  renderFilter?: boolean;
}) {
  const id = (filterId ?? useId()).replace(/:/g, '');

  useEffect(() => {
    if (!enabled) return;

    const selectorList = Array.isArray(targetSelector) ? targetSelector : [targetSelector];
    const targets: HTMLElement[] = [];

    selectorList.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el instanceof HTMLElement) {
          targets.push(el);
          if (el.tagName === 'BODY' || el.tagName === 'HTML') {
            el.style.overflowX = 'hidden';
            el.style.maxWidth = '100vw';
          }
        }
      });
    });

    const offR = document.getElementById(`offR-${id}`) as SVGFEOffsetElement | null;
    const offB = document.getElementById(`offB-${id}`) as SVGFEOffsetElement | null;
    const noise = document.getElementById(`noise-${id}`) as SVGFETurbulenceElement | null;
    const disp = document.getElementById(`disp-${id}`) as SVGFEDisplacementMapElement | null;

    if (applyToTargets) {
      targets.forEach((el) => (el.style.filter = `url(#vhs-${id})`));
    }

    let timeout: number;
    let lastBurst = 0;
    let rafId = 0;
    const rateTuning = { boost: 1, meanWait: 2200 };

    const tuneByRefreshRate = () => {
      let samples = 0;
      let acc = 0;
      let last = performance.now();

      const measure = (t: number) => {
        if (samples > 0) {
          acc += t - last;
        }
        last = t;
        samples += 1;

        if (samples < 60) {
          rafId = window.requestAnimationFrame(measure);
          return;
        }

        const avg = acc / Math.max(1, samples - 1);
        const fps = 1000 / avg;
        if (fps >= 90) {
          rateTuning.boost = 1.35;
          rateTuning.meanWait = 1700;
        }
      };

      rafId = window.requestAnimationFrame(measure);
    };

    tuneByRefreshRate();

    const burst = () => {
      const now = Date.now();
      if (now - lastBurst < 100) return;
      lastBurst = now;

      const boost = rateTuning.boost;
      const dx = Math.min(5, (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 3.2) * intensity * boost);
      offR?.setAttribute('dx', `${dx}`);
      offB?.setAttribute('dx', `${-dx}`);

      noise?.setAttribute('seed', String(Math.floor(Math.random() * 9999)));

      const bf1 = (0.003 * (0.7 + Math.random() * 0.8) * intensity * boost).toFixed(4);
      const bf2 = (0.28 * (0.7 + Math.random() * 0.8) * intensity * boost).toFixed(3);
      noise?.setAttribute('baseFrequency', `${bf1} ${bf2}`);

      const scale = Math.min(35, 10 * intensity * boost + Math.random() * 20 * intensity * boost);
      disp?.setAttribute('scale', `${scale.toFixed(1)}`);

      const duration = 90 + Math.random() * 200 * boost;
      window.setTimeout(() => {
        offR?.setAttribute('dx', '0');
        offB?.setAttribute('dx', '0');
        disp?.setAttribute('scale', Math.random() < 0.2 ? '3' : '0');
      }, duration);
    };

    const expWait = (mean: number) => Math.max(100, -Math.log(1 - Math.random()) * mean);

    const loop = () => {
      timeout = window.setTimeout(() => {
        burst();
        loop();
      }, expWait(rateTuning.meanWait));
    };

    loop();

    return () => {
      clearTimeout(timeout);
      window.cancelAnimationFrame(rafId);
      if (applyToTargets) {
        targets.forEach((el) => {
          el.style.filter = '';
          if (el.tagName === 'BODY' || el.tagName === 'HTML') {
            el.style.overflowX = '';
            el.style.maxWidth = '';
          }
        });
      }
    };
  }, [id, targetSelector, intensity, enabled, applyToTargets]);

  if (!enabled || !renderFilter) return null;

  return (
    <svg
      width="0"
      height="0"
      className="fixed pointer-events-none"
      style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <filter
        id={`vhs-${id}`}
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        filterUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

        <feOffset in="red" dx="0" dy="0" result="redShift" id={`offR-${id}`} />
        <feOffset in="blue" dx="0" dy="0" result="blueShift" id={`offB-${id}`} />

        <feBlend in="redShift" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueShift" mode="screen" result="rgb" />

        <feTurbulence id={`noise-${id}`} type="fractalNoise" baseFrequency="0.003 0.25" numOctaves="2" seed="2" result="n" />
        <feDisplacementMap id={`disp-${id}`} in="rgb" in2="n" xChannelSelector="R" yChannelSelector="G" scale="0" result="d" />
        <feComposite in="d" in2="SourceAlpha" operator="over" />
      </filter>
    </svg>
  );
}

// ============================================================================
// VHS Overlay - HUD + scanlines + noise + viñeta
// ============================================================================
const MONTHS_OSD = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatVHSOSD(date: Date) {
  const hours = date.getHours();
  const isPM = hours >= 12;
  const hh = String(hours % 12 || 12).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  const mon = MONTHS_OSD[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return {
    time: `${hh}:${mm}:${ss}`,
    meridiem: isPM ? 'PM' : 'AM',
    date: `${mon}. ${day} ${year}`,
  };
}

export function VHSOverlay({
  showHud = true,
  showScanlines = true,
  showNoise = true,
  showRec = false,
  className = '',
}: {
  showHud?: boolean;
  showScanlines?: boolean;
  showNoise?: boolean;
  showRec?: boolean;
  className?: string;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [tracking, setTracking] = useState(0);
  const [sequence] = useState('001');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showScanlines) return;

    let alive = true;
    const tick = () => {
      if (!alive) return;
      setTracking(Math.random() * 2 - 1);
      setTimeout(tick, 100 + Math.random() * 200);
    };

    tick();
    return () => {
      alive = false;
    };
  }, [showScanlines]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    let timeout = 0;

    const randomize = () => {
      const jitterX = (Math.random() * 4 - 2).toFixed(2);
      const jitterY = (Math.random() * 3 - 1.5).toFixed(2);
      const skew = (Math.random() * 10 - 5).toFixed(2);
      const blur = (0.35 + Math.random() * 0.8).toFixed(2);
      const clipTop = Math.floor(Math.random() * 45);
      const clipBottom = Math.floor(Math.random() * 55);
      const glitchSpeed = (2.6 + Math.random() * 2.2).toFixed(2);
      const tearSpeed = (5.2 + Math.random() * 3.2).toFixed(2);

      el.style.setProperty('--vhs-jitter-x', `${jitterX}px`);
      el.style.setProperty('--vhs-jitter-y', `${jitterY}px`);
      el.style.setProperty('--vhs-skew', `${skew}deg`);
      el.style.setProperty('--vhs-blur', `${blur}px`);
      el.style.setProperty('--vhs-clip-top', `${clipTop}%`);
      el.style.setProperty('--vhs-clip-bottom', `${clipBottom}%`);
      el.style.setProperty('--vhs-glitch-speed', `${glitchSpeed}s`);
      el.style.setProperty('--vhs-tear-speed', `${tearSpeed}s`);

      const delay = 140 + Math.random() * 280;
      timeout = window.setTimeout(randomize, delay);
    };

    randomize();
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  const { time, date, meridiem } = formatVHSOSD(now);

  return (
    <div
      ref={overlayRef}
      className={`pointer-events-none fixed inset-0 z-[9999] ${className}`}
      aria-hidden="true"
    >
      {showScanlines && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.32) 2px, rgba(0,0,0,0.32) 4px)',
            transform: `translateY(${tracking}px)`,
            transition: 'transform 0.1s linear',
            willChange: 'transform',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {showScanlines && (
        <div
          className="absolute inset-0 opacity-45"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 68%, rgba(0,0,0,0.7) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {showScanlines && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px)',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {showNoise && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300% 300%',
            animation: 'vhs-noise 0.2s steps(10) infinite',
            willChange: 'background-position',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {showHud && (
        <>
          <div className="vhs-corners" aria-hidden="true">
            <span className="corner tl vhs-corner-fx" />
            <span className="corner tr vhs-corner-fx" />
            <span className="corner bl vhs-corner-fx" />
            <span className="corner br vhs-corner-fx" />
          </div>

          <div
            className="absolute vhs-hud-text vhs-hud-all-fx"
            style={{
              color: '#fff',
              mixBlendMode: 'screen',
              left: 'calc(var(--vhs-hud-left, 12px) + var(--vhs-hud-inset, 10px))',
              top: 'calc(var(--vhs-hud-top, 8px) + var(--vhs-hud-inset, 8px))',
            }}
          >
            PLAY ▶
            {showRec && <span style={{ marginLeft: '12px', animation: 'rec-blink 1.5s infinite' }}>REC</span>}
          </div>

          <div
            className="absolute vhs-hud-text vhs-hud-all-fx text-right"
            style={{
              color: '#fff',
              mixBlendMode: 'screen',
              right: 'calc(var(--vhs-hud-right, 12px) + var(--vhs-hud-inset, 10px))',
              top: 'calc(var(--vhs-hud-top, 8px) + var(--vhs-hud-inset, 8px))',
            }}
          >
            <div>{date}</div>
            <div>
              {meridiem} {time}
            </div>
          </div>

          <div
            className="absolute vhs-hud-text vhs-hud-all-fx"
            style={{
              color: '#fff',
              mixBlendMode: 'screen',
              left: 'calc(var(--vhs-hud-left, 12px) + var(--vhs-hud-inset, 10px))',
              bottom: 'calc(var(--vhs-hud-bottom, 12px) + var(--vhs-hud-inset, 8px))',
            }}
          >
            <span className="vhs-hud-seq">{sequence}</span>
          </div>
        </>
      )}

      <style jsx>{`
        @font-face {
          font-family: 'VCR OSD Mono';
          src: local('VCR OSD Mono'), local('VCR_OSD_MONO'), url('/fonts/VCR_OSD_MONO_1.001.woff2') format('woff2');
          font-display: swap;
        }

        .vhs-hud-text {
          user-select: none;
          font-family: 'VCR OSD Mono', 'Courier New', monospace;
          font-size: var(--hud-size, 18px);
          line-height: 1.05;
          letter-spacing: 0.06em;
          -webkit-font-smoothing: none;
          -moz-osx-font-smoothing: grayscale;
          font-smooth: never;
          text-rendering: optimizeSpeed;
          font-variant-ligatures: none;
          font-feature-settings: 'liga' 0, 'kern' 0;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.85);
          filter: blur(var(--vhs-blur, 0.45px));
        }

        .vhs-hud-seq {
          display: inline-block;
        }

        .vhs-hud-all-fx {
          animation: vhs-glitch var(--vhs-glitch-speed, 3.8s) steps(1) infinite,
            vhs-rgb-split 5.2s steps(1) infinite;
          will-change: transform, filter;
        }

        .vhs-corner-fx {
          animation: vhs-glitch var(--vhs-glitch-speed, 3.6s) steps(1) infinite,
            vhs-rgb-split 6.1s steps(1) infinite;
          will-change: transform, filter;
          filter: blur(calc(var(--vhs-blur, 0.45px) + 0.35px));
        }

        .vhs-corners {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 26px;
          height: 26px;
        }

        .corner::before,
        .corner::after {
          content: '';
          position: absolute;
          background: rgba(255, 255, 255, 0.85);
        }

        .corner::before {
          width: 22px;
          height: 2px;
          top: 0;
          left: 0;
        }

        .corner::after {
          width: 2px;
          height: 22px;
          top: 0;
          left: 0;
        }

        .corner.tl {
          top: var(--vhs-hud-top, 8px);
          left: var(--vhs-hud-left, 12px);
        }

        .corner.tr {
          top: var(--vhs-hud-top, 8px);
          right: var(--vhs-hud-right, 12px);
        }

        .corner.tr::before,
        .corner.tr::after {
          left: auto;
          right: 0;
        }

        .corner.bl {
          bottom: var(--vhs-hud-bottom, 12px);
          left: var(--vhs-hud-left, 12px);
        }

        .corner.bl::before,
        .corner.bl::after {
          top: auto;
          bottom: 0;
        }

        .corner.br {
          bottom: var(--vhs-hud-bottom, 12px);
          right: var(--vhs-hud-right, 12px);
        }

        .corner.br::before,
        .corner.br::after {
          top: auto;
          bottom: 0;
          left: auto;
          right: 0;
        }

        @keyframes vhs-noise {
          0%,
          100% {
            background-position: 0% 0%;
          }
          10% {
            background-position: 10% 5%;
          }
          20% {
            background-position: 20% 15%;
          }
          30% {
            background-position: 5% 25%;
          }
          40% {
            background-position: 30% 10%;
          }
          50% {
            background-position: 15% 30%;
          }
          60% {
            background-position: 35% 20%;
          }
          70% {
            background-position: 25% 40%;
          }
          80% {
            background-position: 40% 25%;
          }
          90% {
            background-position: 20% 35%;
          }
        }

        @keyframes rec-blink {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes vhs-glitch {
          0%,
          84%,
          100% {
            transform: translate(var(--vhs-jitter-x, 0px), var(--vhs-jitter-y, 0px))
              skewX(var(--vhs-skew, 0deg));
            text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.85);
          }
          86% {
            transform: translate(-2px, 0) skewX(-6deg);
            text-shadow: -2px 0 0 rgba(255, 0, 90, 0.6), 2px 0 0 rgba(0, 210, 255, 0.6);
          }
          88% {
            transform: translate(2px, -1px) skewX(6deg);
            text-shadow: 2px 0 0 rgba(255, 0, 90, 0.6), -2px 0 0 rgba(0, 210, 255, 0.6);
          }
          90% {
            transform: translate(0, 1px) skewX(-3deg);
            text-shadow: 1px 0 0 rgba(255, 0, 90, 0.5), -1px 0 0 rgba(0, 210, 255, 0.5);
          }
        }

        @keyframes vhs-rgb-split {
          0%,
          100% {
            filter: blur(var(--vhs-blur, 0.45px)) drop-shadow(0 0 0 rgba(255, 0, 90, 0.6))
              drop-shadow(0 0 0 rgba(0, 210, 255, 0.6));
          }
          60% {
            filter: blur(var(--vhs-blur, 0.45px)) drop-shadow(1px 0 0 rgba(255, 0, 90, 0.6))
              drop-shadow(-1px 0 0 rgba(0, 210, 255, 0.6));
          }
          70% {
            filter: blur(var(--vhs-blur, 0.45px)) drop-shadow(-1px 0 0 rgba(255, 0, 90, 0.6))
              drop-shadow(1px 0 0 rgba(0, 210, 255, 0.6));
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// VHS Complete - Efecto VHS completo
// ============================================================================
export default function VHSComplete({
  targetSelector = 'body',
  intensity = 0.8,
  showHud = true,
  showScanlines = true,
  showNoise = true,
  enabled = true,
}: {
  targetSelector?: string | string[];
  intensity?: number;
  showHud?: boolean;
  showScanlines?: boolean;
  showNoise?: boolean;
  enabled?: boolean;
}) {
  return (
    <>
      <VHSFilter targetSelector={targetSelector} intensity={intensity} enabled={enabled} />
      <VHSOverlay showHud={showHud} showScanlines={showScanlines} showNoise={showNoise} />
    </>
  );
}
