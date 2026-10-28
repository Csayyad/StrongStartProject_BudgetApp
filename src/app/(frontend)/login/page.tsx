import { redirect } from "next/navigation"
import { appAuth } from "@/lib/app-auth"
import { LoginForm } from "./LoginForm"

export default async function LoginPage() {
  const user = await appAuth.currentUser()
  if (user) redirect("/")

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Current Campus introduction">
        <div className="login-orbit orbit-one" />
        <div className="login-orbit orbit-two" />
        <div className="login-story-content">
          <span className="login-kicker">MONEY CLARITY FOR CAMPUS LIFE</span>
          <h2>Less spreadsheet stress. More room for what matters.</h2>
          <p>
            See your full student-money picture, make a plan that fits real
            life, and ask Nova for judgment-free help whenever you need it.
          </p>
          <div className="login-preview-card">
            <div>
              <span>Monthly plan</span>
              <strong>72% on track</strong>
            </div>
            <div className="login-preview-bar">
              <i />
            </div>
            <small>
              Groceries, rent, and savings—together in one calm view.
            </small>
          </div>
        </div>
      </section>
      <div className="login-form-wrap">
        <LoginForm />
      </div>
    </main>
  )
}
