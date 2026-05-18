import Link from "next/link";

export function Header() {
  return (
    <header style={{ borderBottom: "1px solid #1f2338" }}>
      <nav style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 16px", display: "flex", gap: 16 }}>
        <Link href="/catalog" style={{ fontWeight: 700, marginRight: "auto" }}>
          Orbitly
        </Link>
        <Link href="/catalog">Shop</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/login">Sign in</Link>
      </nav>
    </header>
  );
}
