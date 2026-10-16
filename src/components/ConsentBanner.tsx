"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "orbitly.consent.v1";

/**
 * Required for the EU storefront: no analytics or marketing storage until the
 * visitor opts in. Strictly necessary storage (the session token) is exempt.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const decide = (value: "all" | "necessary") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* storage blocked: banner will show again next visit */
    }
    setVisible(false);
  };

  return (
    <aside className="card" role="dialog" aria-label="Cookie consent" style={{ position: "fixed", bottom: 16, left: 16, right: 16 }}>
      <p>We use strictly necessary storage to keep you signed in. With your consent we also measure site usage.</p>
      <button className="button" onClick={() => decide("all")}>Accept all</button>{" "}
      <button className="button" onClick={() => decide("necessary")}>Necessary only</button>
    </aside>
  );
}
