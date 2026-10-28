import { redirect } from "next/navigation"
import CurrentCampusApp from "./CurrentCampusApp"
import { appAuth } from "@/lib/app-auth"

export default async function HomePage() {
  const user = await appAuth.currentUser()
  if (!user) redirect("/login")

  return (
    <CurrentCampusApp
      user={{
        email: user.email,
        name: user.name,
      }}
    />
  )
}
