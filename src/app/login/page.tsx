"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { login } from "@/lib/api/auth";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/catalog";

  return (
    <>
      <h1>Sign in</h1>
      <AuthForm
        mode="login"
        onSubmit={async ({ email, password }) => {
          await login({ email, password });
          // Only allow same-origin relative redirects.
          router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/catalog");
        }}
      />
      <p className="muted">
        New to Orbitly? <Link href="/signup">Create an account</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
