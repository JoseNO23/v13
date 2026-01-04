'use client';

import { VHSFilter, VHSOverlay } from './vhs';
import { VHS_GLOBAL_ID } from './vhs-constants';

export default function VHSGlobal() {
  return (
    <>
      <VHSFilter
        targetSelector=".vhs-surface"
        intensity={0.85}
        filterId={VHS_GLOBAL_ID}
        applyToTargets={false}
        renderFilter={false}
      />
      <VHSOverlay showHud showScanlines showNoise />
    </>
  );
}
