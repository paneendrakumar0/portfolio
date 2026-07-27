import { useEffect, useState } from 'react';

type NavigatorWithPerformanceHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function canUseEnhancedEffects() {
  const navigatorWithHints = navigator as NavigatorWithPerformanceHints;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCompactViewport = window.matchMedia('(max-width: 767px)').matches;
  const savesData = navigatorWithHints.connection?.saveData === true;
  const hasLimitedMemory =
    typeof navigatorWithHints.deviceMemory === 'number' &&
    navigatorWithHints.deviceMemory <= 4;

  return !prefersReducedMotion && !hasCompactViewport && !savesData && !hasLimitedMemory;
}

export function useEnhancedEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const viewportQuery = window.matchMedia('(max-width: 767px)');
    const updatePreference = () => setEnabled(canUseEnhancedEffects());

    updatePreference();
    motionQuery.addEventListener('change', updatePreference);
    viewportQuery.addEventListener('change', updatePreference);

    return () => {
      motionQuery.removeEventListener('change', updatePreference);
      viewportQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  return enabled;
}
