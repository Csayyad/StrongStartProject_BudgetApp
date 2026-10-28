"use client"

import { useActionState, useState } from "react"
import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "./actions"

const initialState: AuthActionState = {}

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    initialState,
  )
  const [signupState, signupFormAction, signupPending] = useActionState(
    signupAction,
    initialState,
  )
  const state = mode === "login" ? loginState : signupState
  const pending = mode === "login" ? loginPending : signupPending

  return (
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-brand">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <strong>Current</strong>
        <em>Campus</em>
      </div>

      <span className="login-eyebrow">
        {mode === "login" ? "WELCOME BACK" : "START YOUR MONEY RESET"}
      </span>
      <h1 id="login-title">
        {mode === "login"
          ? "Your money, right where you left it."
          : "Build calmer money habits."}
      </h1>
      <p className="login-copy">
        {mode === "login"
          ? "Sign in to check your budget, goals, and latest activity."
          : "Create your private student account in less than a minute."}
      </p>

      <div className="login-tabs" role="tablist" aria-label="Account access">
        <button
          aria-selected={mode === "login"}
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
          role="tab"
          suppressHydrationWarning
          type="button"
        >
          Sign in
        </button>
        <button
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
          role="tab"
          suppressHydrationWarning
          type="button"
        >
          Create account
        </button>
      </div>

      <form action={mode === "login" ? loginFormAction : signupFormAction}>
        {mode === "signup" && (
          <label>
            Your name
            <input
              autoComplete="name"
              name="name"
              placeholder="Maya Allen"
              required
              suppressHydrationWarning
            />
          </label>
        )}
        <label>
          Email address
          <input
            autoComplete="email"
            name="email"
            placeholder="you@college.edu"
            required
            suppressHydrationWarning
            type="email"
          />
        </label>
        <label>
          Password
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            name="password"
            placeholder="At least 8 characters"
            required
            suppressHydrationWarning
            type="password"
          />
        </label>
        {mode === "signup" && (
          <label>
            Confirm password
            <input
              autoComplete="new-password"
              minLength={8}
              name="confirmPassword"
              placeholder="Type it one more time"
              required
              suppressHydrationWarning
              type="password"
            />
          </label>
        )}

        {state.error && (
          <div className="login-error" role="alert">
            {state.error}
          </div>
        )}

        <button
          className="login-submit"
          disabled={pending}
          suppressHydrationWarning
          type="submit"
        >
          {pending
            ? "One moment..."
            : mode === "login"
              ? "Sign in to Current Campus"
              : "Create my account"}
        </button>
      </form>

      <div className="login-trust">
        <span aria-hidden="true">✓</span>
        <p>
          Your account session is private and secure. The financial information
          inside this demo stays in your current browser session.
        </p>
      </div>
    </section>
  )
}
