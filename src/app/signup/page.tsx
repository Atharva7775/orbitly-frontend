"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { signup } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();
  return (
    <>
      <h1>Create your account</h1>
      <AuthForm
        mode="signup"
        onSubmit={async ({ email, password, fullName }) => {
          await signup({ email, password, fullName: fullName ?? "" });
          router.push("/catalog");
        }}
      />
      <p className="muted">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
