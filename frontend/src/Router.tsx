import { useEffect, useMemo, useState } from "react"
import App from "./App"
import Dashboard from "./pages/Dashboard"

function normalizeHash(raw: string) {
  const h = raw || "#/"
  return h.startsWith("#") ? h : `#${h}`
}

export default function Router() {
  const [hash, setHash] = useState(() => normalizeHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setHash(normalizeHash(window.location.hash))
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const route = useMemo(() => {
    if (hash.startsWith("#/dashboard")) return "dashboard"
    return "app"
  }, [hash])

  if (route === "dashboard") return <Dashboard />
  return <App />
}


