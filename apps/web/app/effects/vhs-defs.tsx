import { VHS_GLOBAL_ID } from './vhs-constants';

export default function VHSDefs() {
  const id = VHS_GLOBAL_ID;

  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id={`vhs-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feOffset in="red" dx="0" dy="0" result="redShift" id={`offR-${id}`} />
        <feOffset in="blue" dx="0" dy="0" result="blueShift" id={`offB-${id}`} />
        <feBlend in="redShift" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueShift" mode="screen" result="rgb" />
        <feTurbulence id={`noise-${id}`} type="fractalNoise" baseFrequency="0.002 0.20" numOctaves="1" seed="2" result="n" />
        <feDisplacementMap id={`disp-${id}`} in="rgb" in2="n" xChannelSelector="R" yChannelSelector="G" scale="0" result="d" />
        <feComposite in="d" in2="SourceAlpha" operator="over" />
      </filter>
    </svg>
  );
}
