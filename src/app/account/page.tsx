"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api/auth";
import { getMe, updateMe } from "@/lib/api/users";
import type { User } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        setFullName(u.fullName);
      })
      .catch(() => router.replace("/login?next=/account"));
  }, [router]);

  if (!user) return <p className="muted">Loading…</p>;

  return (
    <>
      <h1>Account</h1>
      <form
        className="card"
        style={{ maxWidth: 420 }}
        onSubmit={async (e) => {
          e.preventDefault();
          const updated = await updateMe({ fullName });
          setUser(updated);
          setStatus("Saved");
        }}
      >
        <p className="muted">{user.email}</p>
        <label className="field">
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <button className="button" type="submit">
          Save
        </button>
        {status ? <span className="muted" style={{ marginLeft: 12 }}>{status}</span> : null}
      </form>
      <button
        className="button"
        style={{ marginTop: 24 }}
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
      >
        Sign out
      </button>
    </>
  );
}
