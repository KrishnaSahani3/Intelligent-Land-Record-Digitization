"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  LogIn,
  LifeBuoy,
  ChevronRight,
  Mail,
  MessageCircle,
  ArrowRight,
  Building2,
  ShieldCheck,
  Landmark,
  UserRound,
} from "lucide-react"

const navLinks = [
  { label: "Officer Dashboard", href: "/login?role=officer" },
  { label: "Digitize Land Record", href: "/login?role=officer" },
  { label: "Report Land Dispute", href: "/login?role=citizen" },
  { label: "Track Complaint Status", href: "/login?role=citizen" },
  { label: "GIS Map (Bhunaksha)", href: "/bhunaksha" },
]

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা", "मराठी"]

const heroStats = [
  { value: "15 min", label: "Average verification time" },
  { value: "97.8%", label: "AI extraction accuracy" },
  { value: "11,962", label: "Records validated" },
]

const workspaces = [
  {
    name: "Revenue Department",
    description: "Digitize and manage official land records.",
    icon: Landmark,
    href: "/login?role=officer",
  },
  {
    name: "Verification Officer",
    description: "Review, cross-check and approve records.",
    icon: ShieldCheck,
    href: "/login?role=officer",
  },
  {
    name: "Registrar Office",
    description: "Oversee property transfers and transactions.",
    icon: Building2,
    href: "/login?role=officer",
  },
  {
    name: "Citizen / Owner",
    description: "Verify a property before you transact.",
    icon: UserRound,
    href: "/login?role=citizen",
  },
  {
    name: "Public Access (Bhunaksha)",
    description: "View land coordinates and GIS maps instantly.",
    icon: Globe,
    href: "/bhunaksha",
  },
]

const workflow = [
  "Old Record",
  "AI Digitization",
  "Confidence Check",
  "Human Verification",
  "Cross Verification",
  "GIS Validation",
  "Transaction Safety",
]

const trustIndicators = [
  {
    title: "AI-assisted verification",
    description: "Automated OCR and structured extraction from scanned land records.",
  },
  {
    title: "Multi-source cross-checking",
    description: "Records reconciled against registry, mutation and cadastral sources.",
  },
  {
    title: "GIS boundary validation",
    description: "Parcel boundaries verified against cadastral maps for area conflicts.",
  },
  {
    title: "Transaction risk detection",
    description: "Inconsistencies surfaced before a property transfer takes place.",
  },
]

function useDismiss<T extends HTMLElement>(onDismiss: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss()
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [onDismiss])
  return ref
}

export default function Page() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState("English")
  const [signInOpen, setSignInOpen] = useState(false)

  useEffect(() => {
    // Default to light mode, do not auto-switch based on OS
    // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    // setDark(prefersDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  const menuRef = useDismiss<HTMLDivElement>(() => setMenuOpen(false))
  const langRef = useDismiss<HTMLDivElement>(() => setLangOpen(false))

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Three-line navigation */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label="Open navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              {menuOpen && (
                <nav className="absolute left-0 top-11 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-sm font-bold text-white dark:bg-[#3b6fd4]"
                aria-hidden="true"
              >
                A
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#0f2c5c] dark:text-slate-100">AXIOM</span>

            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Multilingual */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-label="Select language"
                className="flex h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:inline">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-11 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {languages.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLang(l)
                        setLangOpen(false)
                      }}
                      className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        l === lang
                          ? "font-semibold text-[#1f8a4c] dark:text-[#4ade80]"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setDark((v) => !v)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Sign in */}
            <button
              type="button"
              onClick={() => setSignInOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#0f2c5c] px-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#3b6fd4]"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,44,92,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,44,92,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          {/* Hero section with text and image */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left: Hero copy */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Intelligent Land Record Digitization
              </p>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#0f2c5c] sm:text-5xl lg:text-5xl dark:text-white">
                Digitize. Verify. <span className="text-[#1f8a4c] dark:text-[#4ade80]">Validate.</span> Before You Transfer.
              </h1>
              <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                AI-powered land record validation and pre-transaction risk detection for a more trusted property journey.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/digitize"
                  className="inline-flex items-center gap-2 rounded-md bg-[#0f2c5c] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#3b6fd4]"
                >
                  Upload land record
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/bhunaksha"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-[#0f2c5c] px-5 py-2.5 text-sm font-semibold text-[#0f2c5c] transition-colors hover:bg-slate-50 dark:border-[#3b6fd4] dark:text-[#7fa8ec] dark:hover:bg-slate-900"
                >
                  Public GIS Map
                </a>
                <a
                  href="/dispute"
                  className="text-sm font-semibold text-[#0f2c5c] transition-colors hover:text-[#1f8a4c] dark:text-[#7fa8ec] dark:hover:text-[#4ade80]"
                >
                  Report Land Dispute
                </a>
              </div>
            </div>

            {/* Right: Provided image */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
              <Image
                src="/axiom-record-intelligence.png"
                alt="AXIOM Record Intelligence interface showing a scanned Record of Rights being digitized with AI extraction and a 97.8% match confidence result."
                width={1456}
                height={1092}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-xl bg-[#0f2c5c] sm:grid-cols-3 dark:bg-[#12213f]">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-8 py-7 ${i > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}
              >
                <div className="text-3xl font-bold tracking-tight text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="how-it-works" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            How it works
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {workflow.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {step}
                </span>
                {i < workflow.length - 1 && (
                  <span className="text-slate-400" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section id="capabilities" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustIndicators.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-slate-200 p-5 transition-colors dark:border-slate-800"
            >
              <div className="h-1 w-10 rounded-full bg-[#1f8a4c]" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-[#0f2c5c] dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Help & Support */}
      <section
        id="support"
        className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf3ff] text-[#0f2c5c] dark:bg-slate-800 dark:text-[#7fa8ec]">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0f2c5c] dark:text-white">Help &amp; Support</h2>
                <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-300">
                  Questions about verification, record uploads or transaction safety? Our team is here to help.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@axiom.gov"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md bg-[#0f2c5c] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#3b6fd4]"
              >
                <MessageCircle className="h-4 w-4" />
                Live chat
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center dark:text-slate-400">
          <span>AXIOM &mdash; Intelligent Land Record Digitization &amp; Validation System</span>
          <a href="#support" className="font-medium text-[#0f2c5c] hover:underline dark:text-[#7fa8ec]">
            Help &amp; Support
          </a>
        </div>
      </footer>

      {/* Sign in — Choose your workspace */}
      {signInOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workspace-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSignInOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="workspace-title" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">
                  Choose your workspace
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Select a workspace to sign in and continue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignInOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {workspaces.map((ws) => {
                const Icon = ws.icon
                return (
                  <button
                    key={ws.name}
                    onClick={() => {
                      setSignInOpen(false);
                      window.location.href = ws.href;
                    }}
                    className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-[#0f2c5c] hover:bg-slate-50 dark:border-slate-800 dark:hover:border-[#3b6fd4] dark:hover:bg-slate-800"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf3ff] text-[#0f2c5c] dark:bg-slate-800 dark:text-[#7fa8ec]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0f2c5c] dark:text-white">{ws.name}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {ws.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
