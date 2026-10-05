"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClientErrors, trackPageView, trackScrollDepth, trackWebVitals } from "@/lib/nexTracking";

export function NexPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackWebVitals();
    trackClientErrors();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
    return trackScrollDepth();
  }, [pathname]);

  return null;
}
