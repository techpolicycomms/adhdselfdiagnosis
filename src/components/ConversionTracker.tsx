"use client";

import { useEffect } from "react";

/**
 * Fires Google Ads conversion when user completes a donation.
 * Set NEXT_PUBLIC_GOOGLE_ADS_ID (e.g. AW-123456789) and
 * NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL in .env.local
 */
export function ConversionTracker() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
    if (!id || !label || typeof window === "undefined") return;

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag("event", "conversion", {
        send_to: `${id}/${label}`,
        value: 1,
        currency: "USD",
      });
    }
  }, []);

  return null;
}
