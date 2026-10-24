"use client";

import Link from "next/link";
import { useEffect } from "react";

/* ================================================================
   Scroll Reveal Hook
   ================================================================ */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    document
      .querySelectorAll(".reveal-on-scroll")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ================================================================
   Inline SVG Icons
   ================================================================ */
function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}

function PinSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.827 3.024Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const features = [
  {
    icon: <MapIcon />,
    title: "Interactive World Map",
    description:
      "Explore thousands of Beatles locations on a beautiful, filterable map. Search by era, album, or band member.",
    iconBg: "bg-accent-light",
    iconColor: "text-accent",
    hoverBorder: "hover:border-accent/20",
    hoverShadow: "hover:shadow-accent/5",
    large: true,
  },
  {
    icon: <BookIcon />,
    title: "Fan Stories & Reviews",
    description:
      "Read firsthand accounts and tips from fans who\u2019ve walked in the Beatles\u2019 footsteps around the world.",
    iconBg: "bg-secondary-light",
    iconColor: "text-secondary",
    hoverBorder: "hover:border-secondary/20",
    hoverShadow: "hover:shadow-secondary/5",
    large: false,
  },
  {
    icon: <BookmarkIcon />,
    title: "Trip Planning",
    description:
      "Save spots to your personal collection, build custom routes, and plan the ultimate Beatles pilgrimage.",
    iconBg: "bg-gold-light",
    iconColor: "text-gold",
    hoverBorder: "hover:border-gold/20",
    hoverShadow: "hover:shadow-gold/5",
    large: false,
  },
  {
    icon: <ShareIcon />,
    title: "Share Your Journey",
    description:
      "Drop a pin, write your story, upload photos \u2014 and inspire the next generation of Beatles fans.",
    iconBg: "bg-accent-light",
    iconColor: "text-accent",
    hoverBorder: "hover:border-accent/20",
    hoverShadow: "hover:shadow-accent/5",
    large: true,
  },
];

/* ================================================================
   Decorative Components
   ================================================================ */
function FloatingPin({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`absolute ${className ?? ""}`} style={style}>
      <PinSvg className="h-5 w-5 opacity-[0.12]" />
    </div>
  );
}

/* ================================================================
   Page
   ================================================================ */
export function WelcomeScreen() {
  useScrollReveal();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ───── HERO ───── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
        {/* Background: dot grid */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

        {/* Background: gradient orbs */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-secondary/[0.05] blur-[100px]" />

        {/* Floating pins */}
        <FloatingPin
          className="animate-float text-accent"
          style={{ top: "15%", left: "10%" }}
        />
        <FloatingPin
          className="animate-float-slow text-secondary"
          style={{ top: "20%", right: "15%" }}
        />
        <FloatingPin
          className="animate-float-reverse text-gold"
          style={{ top: "60%", left: "8%" }}
        />
        <FloatingPin
          className="animate-float text-accent"
          style={{ top: "70%", right: "10%", animationDelay: "2s" }}
        />
        <FloatingPin
          className="animate-float-slow text-secondary"
          style={{ bottom: "25%", left: "20%", animationDelay: "1s" }}
        />

        {/* Hero content */}
        <div className="relative z-10 animate-fade-in-up">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-light px-4 py-2 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Your fan pilgrimage starts here
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto text-center font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Discover the World
            <br />
            <span className="gradient-text md:whitespace-nowrap">Through the Beatles&apos; Eyes</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-8 max-w-lg text-center text-lg leading-relaxed text-muted">
            Pin legendary spots on the map, share your stories, and explore a
            world of fan experiences &mdash; all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/api/auth/signin"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98]"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="rounded-2xl px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-foreground/5 active:scale-[0.98]"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5 text-faint"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      </section>

      {/* ───── FEATURES (Bento Grid) ───── */}
      <section id="features" className="px-6 py-24 bg-surface-alt sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-on-scroll mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Features
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              From discovering hidden gems to planning your next trip &mdash; it
              all starts here.
            </p>
          </div>

          <div className="reveal-on-scroll grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`stagger-child group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${f.hoverBorder} ${f.hoverShadow} ${f.large ? "lg:col-span-2" : ""}`}
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg} ${f.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER CTA ───── */}
      <section className="relative overflow-hidden bg-foreground px-6 py-28 text-center sm:py-36">
        <div className="dot-grid-light pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[100px]" />

        <div className="reveal-on-scroll relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-4xl text-background sm:text-5xl lg:text-6xl">
            Come Together
            <br />
            on Let It Map
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-faint">
            Join the global community of Beatles fans. Share your stories,
            discover new places, and keep the legacy alive.
          </p>
          <Link
            href="/api/auth/signin"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-2xl bg-accent px-10 py-5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/40 active:scale-[0.98]"
          >
            Get Started &mdash; It&apos;s Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
