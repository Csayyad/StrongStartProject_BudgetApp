import "server-only"

import { cookies } from "next/headers"
import { getPayloadClient } from "@/lib/payload"

const SESSION_COOKIE = "app-session"

export function createAppAuth(appUserCollection: "users") {
  async function setSession(token: string, exp?: number) {
    const cookieStore = await cookies()
    const secondsUntilExpiry = exp
      ? Math.max(0, exp - Math.floor(Date.now() / 1000))
      : 60 * 60 * 2

    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      maxAge: secondsUntilExpiry,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return {
    async currentUser() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })

      if (!user || user.collection !== appUserCollection) return null
      return user
    },

    async login(email: string, password: string) {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection: appUserCollection,
        data: { email, password },
        overrideAccess: false,
      })

      if (!result.token || !result.user) {
        throw new Error("Unable to create an app session.")
      }

      await setSession(result.token, result.exp)
      return result.user
    },

    async signup(name: string, email: string, password: string) {
      const payload = await getPayloadClient()

      await payload.create({
        collection: appUserCollection,
        data: { email, name, password },
        overrideAccess: false,
      })

      return this.login(email, password)
    },

    async logout() {
      ;(await cookies()).delete(SESSION_COOKIE)
    },
  }
}

export const appAuth = createAppAuth("users")
