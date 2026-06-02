"use client";

import { useState } from "react";

const sections = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Global Reach", id: "global-reach" },
  { label: "Opportunities", id: "opportunities" },
  { label: "Contact", id: "contact" },
  { label: "Network", id: "network" },
  { label: "Insights", id: "insights" },
];

const priorities = [
  "Global connectivity",
  "Discrete coordination",
  "Cross-border adaptability",
];

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiry", {
      method: "POST",
      body: formData,
    });

    setStatus(response.ok ? "sent" : "error");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <main className="min-h-screen bg-transparent text-ut-cream">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ut-indigo/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ut-glow">Unique Trades</p>
            <p className="text-sm text-white/70">Beyond conventional trade</p>
          </div>
          <nav className="hidden gap-5 text-xs uppercase tracking-[0.2em] text-white/70 md:flex">
            {sections.map((item) => (
              <a key={item.id} className="transition hover:text-white" href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section
        id="home"
        className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center overflow-hidden px-6 py-20"
      >
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-ut-slate/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-ut-blue/10 blur-3xl" />
          <div className="absolute left-0 top-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-ut-slate">
              Global, capable, discreet
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-ut-cream md:text-7xl">
              Unique Trades
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
              Beyond Conventional Trade.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              In a rapidly changing global marketplace, businesses often require more than
              standard solutions. Unique Trades works closely with clients and international
              partners to explore opportunities, identify possibilities, and support unique
              requirements across industries and regions worldwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                className="rounded-full bg-ut-slate px-6 py-3 text-sm font-medium text-ut-indigo transition hover:bg-white"
                href="#contact"
              >
                Start an inquiry
              </a>
              <a
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/5"
                href="#opportunities"
              >
                Explore opportunities
              </a>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-ut-glow">Positioning</p>
            <div className="mt-5 space-y-4">
              <p className="text-xl leading-8 text-white/85">
                Quiet capability for unusual international requirements.
              </p>
              <p className="text-sm leading-7 text-white/60">
                A refined business presence for thoughtful opportunities, selective inquiries, and
                global relationship-building.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">About</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
          Unique Trades is built around relationships, global connectivity, adaptability, and the
          ability to explore opportunities beyond conventional boundaries.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
          We intentionally keep the site selective and understated, so the right visitors feel
          confidence without being overloaded with detail.
        </p>
      </section>

      <section id="global-reach" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">Global Reach</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
          We work through an international network of partners, associates, and industry contacts
          to support unique requirements across different markets and sectors.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {priorities.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/75">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="opportunities" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">Opportunities</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
          Bring us your challenge, your sourcing need, trade requirement, logistics issue, market
          access requirement, or unique opportunity and we will explore solutions globally.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
          Not every opportunity fits inside conventional boundaries.
        </p>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">Contact</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
          Quiet, professional inquiries are welcome. We are best suited to thoughtful, long-term,
          relationship-driven conversations.
        </p>
        <form
          className="mt-8 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              className="rounded-2xl border border-white/10 bg-ut-indigo/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Name"
              required
            />
            <input
              name="email"
              type="email"
              className="rounded-2xl border border-white/10 bg-ut-indigo/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Email"
              required
            />
            <input
              name="subject"
              className="rounded-2xl border border-white/10 bg-ut-indigo/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 md:col-span-2"
              placeholder="Subject"
            />
            <textarea
              name="message"
              className="min-h-32 rounded-2xl border border-white/10 bg-ut-indigo/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 md:col-span-2"
              placeholder="Tell us about the opportunity, need, or challenge."
              required
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              className="rounded-full bg-ut-slate px-6 py-3 text-sm font-medium text-ut-indigo transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send inquiry"}
            </button>
            <p className="text-sm text-white/55">
              {status === "sent"
                ? "Inquiry received. We will refine the provider later."
                : status === "error"
                  ? "Please complete the required fields and try again."
                  : "Direct, discreet initial contact is preferred."}
            </p>
          </div>
        </form>
      </section>

      <section id="network" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">Network</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">
          Reserved for future expansion.
        </p>
      </section>

      <section id="insights" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-ut-slate">Insights</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">
          Reserved for future expansion.
        </p>
      </section>
    </main>
  );
}
