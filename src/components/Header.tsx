"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, onTokenChange } from "@/lib/session/tokenStore";

export function Header() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(getToken() !== null);
    return onTokenChange((t) => setSignedIn(t !== null));
  }, []);

  return (
    <header style={{ borderBottom: "1px solid #1f2338" }}>
      <nav style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 16px", display: "flex", gap: 16 }}>
        <Link href="/catalog" style={{ fontWeight: 700, marginRight: "auto" }}>
          Orbitly
        </Link>
        <Link href="/catalog">Shop</Link>
        <Link href="/cart">Cart</Link>
        {signedIn ? (
          <>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/account">Account</Link>
          </>
        ) : (
          <>
            <Link href="/login">Sign in</Link>
            <Link href="/signup">Create account</Link>
          </>
        )}
      </nav>
    </header>
  );
}
