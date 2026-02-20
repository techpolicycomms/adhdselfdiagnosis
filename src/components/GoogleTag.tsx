"use client";

import Script from "next/script";

/**
 * Loads Google tag (gtag.js) for conversion tracking.
 * Set NEXT_PUBLIC_GOOGLE_ADS_ID (e.g. AW-123456789) in .env.local
 */
export function GoogleTag() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
