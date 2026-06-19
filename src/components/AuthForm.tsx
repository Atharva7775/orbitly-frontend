"use client";

import { useState, type FormEvent } from "react";

export interface AuthFormValues {
  email: string;
  password: string;
  fullName?: string;
}

interface Props {
  mode: "login" | "signup";
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: Props) {
  const [values, setValues] = useState<AuthFormValues>({ email: "", password: "", fullName: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  const set = (key: keyof AuthFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 420 }}>
      {mode === "signup" ? (
        <label className="field">
          Full name
          <input required autoComplete="name" value={values.fullName} onChange={set("fullName")} />
        </label>
      ) : null}
      <label className="field">
        Email
        <input required type="email" autoComplete="email" value={values.email} onChange={set("email")} />
      </label>
      <label className="field">
        Password
        <input
          required
          type="password"
          minLength={mode === "signup" ? 10 : 1}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={values.password}
          onChange={set("password")}
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
