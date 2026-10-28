"use server"

import { redirect } from "next/navigation"
import { appAuth } from "@/lib/app-auth"

export type AuthActionState = {
  error?: string
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = value(formData, "email").toLowerCase()
  const password = value(formData, "password")

  if (!email || !password) {
    return { error: "Enter both your email and password." }
  }

  try {
    await appAuth.login(email, password)
  } catch {
    return { error: "That email and password combination didn’t work." }
  }

  redirect("/")
}

export async function signupAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = value(formData, "name")
  const email = value(formData, "email").toLowerCase()
  const password = value(formData, "password")
  const confirmation = value(formData, "confirmPassword")

  if (name.length < 2) {
    return { error: "Enter the name you’d like us to use." }
  }
  if (!email.includes("@")) {
    return { error: "Enter a valid email address." }
  }
  if (password.length < 8) {
    return { error: "Use at least 8 characters for your password." }
  }
  if (password !== confirmation) {
    return { error: "Those passwords don’t match yet." }
  }

  try {
    await appAuth.signup(name, email, password)
  } catch {
    return {
      error:
        "We couldn’t create that account. Try signing in if you already registered.",
    }
  }

  redirect("/")
}

export async function logoutAction() {
  await appAuth.logout()
  redirect("/login")
}
