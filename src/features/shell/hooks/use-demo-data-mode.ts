"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getDemoDataMode,
  setDemoDataMode,
  subscribeDemoDataMode,
  type DemoDataMode,
} from "@/features/shell/lib/demo-data-mode";

/**
 * Live First time / Populated selection for the header slider.
 */
export function useDemoDataMode(): {
  mode: DemoDataMode;
  setMode: (next: DemoDataMode) => void;
} {
  const mode = useSyncExternalStore(subscribeDemoDataMode, getDemoDataMode, getDemoDataMode);
  const setMode = useCallback((next: DemoDataMode) => {
    setDemoDataMode(next);
  }, []);

  return { mode, setMode };
}
