"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type WaitlistResult = {
  type: "success" | "error";
  message: string;
  email?: string;
  joinedAt?: string;
};

async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/waitlist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      return {
        type: "error",
        message: data.message ?? "Something went wrong. Please try again.",
      };
    }
    return {
      type: "success",
      message: data.message,
      email: data.email,
      joinedAt: data.joinedAt,
    };
  } catch {
    return {
      type: "error",
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export default function Home() {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroResult, setHeroResult] = useState<WaitlistResult | null>(null);

  function scrollToEmailInput() {
    emailInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    emailInputRef.current?.focus();
  }

  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaResult, setCtaResult] = useState<WaitlistResult | null>(null);

  async function handleHeroSubmit() {
    if (!email || heroLoading) return;
    setHeroLoading(true);
    setHeroResult(null);
    try {
      const result = await joinWaitlist(email);
      setHeroResult(result);
      if (result.type === "success") setEmail("");
    } finally {
      setHeroLoading(false);
    }
  }

  async function handleCtaSubmit() {
    if (!ctaEmail || ctaLoading) return;
    setCtaLoading(true);
    setCtaResult(null);
    try {
      const result = await joinWaitlist(ctaEmail);
      setCtaResult(result);
      if (result.type === "success") setCtaEmail("");
    } finally {
      setCtaLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <Image src="/doju-logo.png" alt="Doju Logo" width={100} height={100} />
        <button
          onClick={scrollToEmailInput}
          className="px-5 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Join Waitlist
        </button>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 items-center gap-16 px-8 py-12 max-w-6xl mx-auto w-full">
        {/* Left column */}
        <div className="flex flex-col gap-7 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start  bg-green-50 rounded-lg px-3 py-1">
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              New
            </span>
            <span className="sm:text-sm text-xs text-gray-600">
              Your centralized health market place
            </span>
          </div>

          {/* Heading */}
          <h1 className="sm:text-5xl text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Your complete medical supply store in one app
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-base leading-relaxed">
            Doju is here to make buying health products and equipment as
            seamless and easy as possible. Join our waitlist to get early access
            to one trusted marketplace for medical essentials.
          </p>

          {/* Email form */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHeroSubmit()}
                disabled={heroLoading}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-60"
              />
              <button
                onClick={handleHeroSubmit}
                disabled={heroLoading || !email}
                className="px-5 py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-32.5 justify-center"
              >
                {heroLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </div>
            {heroResult && (
              <div
                className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${
                  heroResult.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {heroResult.type === "success" ? (
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{heroResult.message}</span>
                  {heroResult.type === "success" && heroResult.email && (
                    <span className="text-xs text-green-600 font-medium">
                      {heroResult.email}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* No spam */}
          <div className="flex items-center gap-2 text-sm text-gray-400 -mt-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Be the first to know when we launch. No spam.</span>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {[
                { bg: "#6366f1", initials: "A" },
                { bg: "#f59e0b", initials: "B" },
                { bg: "#ec4899", initials: "C" },
                { bg: "#14b8a6", initials: "D" },
              ].map((avatar, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: avatar.bg }}
                >
                  {avatar.initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Join <span className="font-bold text-gray-900">2,500+</span>{" "}
              healthcare professionals.
            </p>
          </div>
        </div>

        {/* Right column — hero illustration + feature cards */}
        <div className="flex-1 relative md:flex hidden items-center justify-center">
          <HeroIllustration />

          {/* Card — Trusted supply network */}
          <div className="hidden lg:block absolute top-0 right-0 bg-white rounded-2xl lg:p-5 p-3 shadow-md w-52">
            <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl lg:flex hidden items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Trusted supply network
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Source products from verified sellers and dependable distributors.
            </p>
          </div>

          {/* Card — Faster procurement */}
          <div className="hidden lg:block absolute bottom-0 left-0 bg-white rounded-2xl lg:p-5 p-3 shadow-md w-52">
            <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl lg:flex hidden items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Faster procurement
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Compare options, order quickly, and manage delivery in one place.
            </p>
          </div>
        </div>
      </main>

      {/* Why choose Doju section */}
      <section className="bg-green-50 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-4">
              Why choose Doju?
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
              Everything you need to equip your practice or manage your health,
              seamlessly integrated into one trusted platform.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unified Catalog */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-8">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Unified Catalog
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Stop jumping between different supplier websites. Access
                thousands of health products and medical equipment from a single
                dashboard.
              </p>
            </div>

            {/* Trusted Sellers */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-8">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Trusted Sellers
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Buy with confidence from trusted vendors on Doju, all organized
                to make sourcing medical supplies easier and more reliable.
              </p>
            </div>

            {/* Transparent Pricing */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-8">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Transparent Pricing
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Compare prices, delivery times, and seller ratings effortlessly
                to make the most cost-effective decisions for your practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-gray-50 py-24 px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-24">
          {/* Step 1 — text left, image right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Step 1
              </span>
              <h3 className="text-2xl font-bold text-gray-900">Sign up</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Create your free account in minutes and get ready to access
                trusted medical supplies from one seamless marketplace.
              </p>
            </div>
            <div className="flex-1">
              <SignUpIllustration />
            </div>
          </div>

          {/* Step 2 — image left, text right */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-16">
            <div className="flex-1">
              <BrowseIllustration />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Step 2
              </span>
              <h3 className="text-2xl font-bold text-gray-900">
                Browse &amp; Order
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Search our extensive catalog for the exact equipment or supplies
                you need. Add items from multiple verified vendors into one
                unified and seamless cart.
              </p>
            </div>
          </div>

          {/* Step 3 — text left, image right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Step 3
              </span>
              <h3 className="text-2xl font-bold text-gray-900">
                Receive &amp; Confirm
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Track your orders in real-time. Payments are held securely until
                you receive your products and confirm they meet your exact
                quality expectations.
              </p>
            </div>
            <div className="flex-1">
              <ConfirmIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-900 py-28 px-8 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="sm:text-4xl text-3xl md:text-5xl font-bold text-white leading-tight">
            Ready to transform your procurement?
          </h2>
          <p className="text-gray-400 text-base">
            Join hundreds of healthcare professionals on our waitlist today.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xl mt-2">
            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCtaSubmit()}
                disabled={ctaLoading}
                className="flex-1 px-5 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60"
              />
              <button
                onClick={handleCtaSubmit}
                disabled={ctaLoading || !ctaEmail}
                className="px-6 py-4 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-35 justify-center"
              >
                {ctaLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </div>
            {ctaResult && (
              <div
                className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${
                  ctaResult.type === "success"
                    ? "bg-green-900/40 border border-green-700 text-green-200"
                    : "bg-red-900/40 border border-red-700 text-red-300"
                }`}
              >
                {ctaResult.type === "success" ? (
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{ctaResult.message}</span>
                  {ctaResult.type === "success" && ctaResult.email && (
                    <span className="text-xs text-green-400 font-medium">
                      {ctaResult.email}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Be the first to know when we launch. No spam.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Image
            src="/doju-logo.png"
            alt="Doju Logo"
            width={100}
            height={100}
          />

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Contact Support
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © 2025 Doju. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
    >
      {/* Soft green background blob */}
      <ellipse cx="260" cy="220" rx="230" ry="200" fill="#f0fdf4" />

      {/* Main dashboard card */}
      <rect
        x="60"
        y="40"
        width="400"
        height="300"
        rx="20"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />

      {/* Top bar */}
      <rect x="60" y="40" width="400" height="44" rx="20" fill="#f9fafb" />
      <rect x="60" y="64" width="400" height="20" fill="#f9fafb" />
      <circle cx="90" cy="62" r="7" fill="#f87171" />
      <circle cx="112" cy="62" r="7" fill="#fbbf24" />
      <circle cx="134" cy="62" r="7" fill="#4ade80" />
      {/* URL bar */}
      <rect x="160" y="53" width="200" height="18" rx="9" fill="#e5e7eb" />
      <rect x="170" y="58" width="100" height="8" rx="4" fill="#d1d5db" />

      {/* Sidebar */}
      <rect x="60" y="84" width="90" height="256" rx="0" fill="#f9fafb" />
      <rect x="240" y="84" width="1" height="256" fill="#f9fafb" />
      {/* Sidebar items */}
      <rect x="74" y="104" width="62" height="10" rx="5" fill="#d1fae5" />
      <rect x="74" y="124" width="50" height="8" rx="4" fill="#e5e7eb" />
      <rect x="74" y="142" width="56" height="8" rx="4" fill="#e5e7eb" />
      <rect x="74" y="160" width="44" height="8" rx="4" fill="#e5e7eb" />
      <rect x="74" y="178" width="52" height="8" rx="4" fill="#e5e7eb" />

      {/* Main content area */}
      {/* Stats row */}
      <rect
        x="168"
        y="100"
        width="82"
        height="52"
        rx="10"
        fill="#f0fdf4"
        stroke="#d1fae5"
        strokeWidth="1"
      />
      <rect x="178" y="113" width="40" height="8" rx="4" fill="#bbf7d0" />
      <text
        x="178"
        y="143"
        fill="#22c55e"
        fontSize="14"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        2,340
      </text>

      <rect
        x="262"
        y="100"
        width="82"
        height="52"
        rx="10"
        fill="#eff6ff"
        stroke="#dbeafe"
        strokeWidth="1"
      />
      <rect x="272" y="113" width="40" height="8" rx="4" fill="#bfdbfe" />
      <text
        x="272"
        y="143"
        fill="#3b82f6"
        fontSize="14"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        98%
      </text>

      <rect
        x="356"
        y="100"
        width="82"
        height="52"
        rx="10"
        fill="#fefce8"
        stroke="#fef08a"
        strokeWidth="1"
      />
      <rect x="366" y="113" width="40" height="8" rx="4" fill="#fde68a" />
      <text
        x="366"
        y="143"
        fill="#d97706"
        fontSize="14"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        4.9★
      </text>

      {/* Product list */}
      <rect
        x="168"
        y="166"
        width="270"
        height="36"
        rx="8"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="180" y="178" width="24" height="12" rx="4" fill="#d1fae5" />
      <rect x="214" y="178" width="80" height="8" rx="4" fill="#d1d5db" />
      <rect x="370" y="178" width="52" height="10" rx="4" fill="#22c55e" />

      <rect
        x="168"
        y="210"
        width="270"
        height="36"
        rx="8"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="180" y="222" width="24" height="12" rx="4" fill="#dbeafe" />
      <rect x="214" y="222" width="96" height="8" rx="4" fill="#d1d5db" />
      <rect x="370" y="222" width="52" height="10" rx="4" fill="#22c55e" />

      <rect
        x="168"
        y="254"
        width="270"
        height="36"
        rx="8"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="180" y="266" width="24" height="12" rx="4" fill="#fef3c7" />
      <rect x="214" y="266" width="72" height="8" rx="4" fill="#d1d5db" />
      <rect x="370" y="266" width="52" height="10" rx="4" fill="#22c55e" />

      {/* Floating badge — trusted */}
      <rect
        x="340"
        y="310"
        width="150"
        height="52"
        rx="14"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />
      <circle cx="362" cy="336" r="12" fill="#dcfce7" />
      <path
        d="M356 336 l4 4 6-7"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="382" y="326" width="90" height="8" rx="4" fill="#d1fae5" />
      <rect x="382" y="340" width="68" height="7" rx="3" fill="#e5e7eb" />

      {/* Floating badge — delivery */}
      <rect
        x="30"
        y="300"
        width="150"
        height="52"
        rx="14"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />
      <circle cx="52" cy="326" r="12" fill="#dbeafe" />
      <path d="M46 326 h8 v-4 h4 l4 4 v4 H46v-4z" fill="#3b82f6" />
      <circle cx="50" cy="332" r="2" fill="white" />
      <circle cx="60" cy="332" r="2" fill="white" />
      <rect x="72" y="316" width="90" height="8" rx="4" fill="#bfdbfe" />
      <rect x="72" y="330" width="68" height="7" rx="3" fill="#e5e7eb" />

      {/* Decorative dots */}
      <circle cx="480" cy="80" r="6" fill="#bbf7d0" />
      <circle cx="496" cy="100" r="4" fill="#d1fae5" />
      <circle cx="30" cy="160" r="5" fill="#bbf7d0" />
      <circle cx="16" cy="180" r="3" fill="#d1fae5" />
    </svg>
  );
}

function SignUpIllustration() {
  return (
    <svg
      viewBox="0 0 480 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      {/* Background card */}
      <rect
        x="40"
        y="20"
        width="400"
        height="240"
        rx="20"
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />

      {/* Top bar */}
      <rect x="40" y="20" width="400" height="48" rx="20" fill="#f9fafb" />
      <rect x="40" y="48" width="400" height="20" fill="#f9fafb" />
      <circle cx="72" cy="44" r="8" fill="#f87171" />
      <circle cx="96" cy="44" r="8" fill="#fbbf24" />
      <circle cx="120" cy="44" r="8" fill="#4ade80" />

      {/* Avatar circle */}
      <circle
        cx="240"
        cy="108"
        r="36"
        fill="#dcfce7"
        stroke="#bbf7d0"
        strokeWidth="2"
      />
      <circle cx="240" cy="100" r="14" fill="#4ade80" />
      <ellipse cx="240" cy="130" rx="22" ry="13" fill="#4ade80" />

      {/* Name field */}
      <rect x="120" y="158" width="240" height="20" rx="6" fill="#f3f4f6" />
      <rect x="120" y="158" width="80" height="20" rx="6" fill="#d1fae5" />

      {/* Email field */}
      <rect x="120" y="188" width="240" height="20" rx="6" fill="#f3f4f6" />
      <rect x="120" y="188" width="140" height="20" rx="6" fill="#d1fae5" />

      {/* Button */}
      <rect x="160" y="222" width="160" height="24" rx="8" fill="#22c55e" />
      <text
        x="240"
        y="238"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        Create Account
      </text>
    </svg>
  );
}

function BrowseIllustration() {
  return (
    <svg
      viewBox="0 0 480 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      {/* Background card */}
      <rect
        x="40"
        y="20"
        width="400"
        height="240"
        rx="20"
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />

      {/* Search bar */}
      <rect x="64" y="44" width="320" height="32" rx="10" fill="#f3f4f6" />
      <circle
        cx="88"
        cy="60"
        r="8"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <line
        x1="94"
        y1="66"
        x2="100"
        y2="72"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="108" y="53" width="120" height="14" rx="4" fill="#d1fae5" />
      <rect x="348" y="50" width="24" height="24" rx="6" fill="#22c55e" />

      {/* Product cards row 1 */}
      <rect
        x="64"
        y="94"
        width="100"
        height="72"
        rx="10"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="74" y="104" width="80" height="36" rx="6" fill="#dcfce7" />
      <rect x="74" y="148" width="50" height="8" rx="3" fill="#d1d5db" />
      <rect x="74" y="160" width="30" height="8" rx="3" fill="#22c55e" />

      <rect
        x="178"
        y="94"
        width="100"
        height="72"
        rx="10"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="188" y="104" width="80" height="36" rx="6" fill="#dbeafe" />
      <rect x="188" y="148" width="50" height="8" rx="3" fill="#d1d5db" />
      <rect x="188" y="160" width="30" height="8" rx="3" fill="#22c55e" />

      <rect
        x="292"
        y="94"
        width="100"
        height="72"
        rx="10"
        fill="#f9fafb"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <rect x="302" y="104" width="80" height="36" rx="6" fill="#fef3c7" />
      <rect x="302" y="148" width="50" height="8" rx="3" fill="#d1d5db" />
      <rect x="302" y="160" width="30" height="8" rx="3" fill="#22c55e" />

      {/* Cart bar */}
      <rect
        x="64"
        y="182"
        width="352"
        height="36"
        rx="10"
        fill="#f0fdf4"
        stroke="#bbf7d0"
        strokeWidth="1.5"
      />
      <text
        x="88"
        y="204"
        fill="#22c55e"
        fontSize="11"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        3 items in cart
      </text>
      <rect x="352" y="190" width="52" height="20" rx="6" fill="#22c55e" />
      <text
        x="378"
        y="204"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        Checkout
      </text>
    </svg>
  );
}

function ConfirmIllustration() {
  return (
    <svg
      viewBox="0 0 480 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      {/* Background card */}
      <rect
        x="40"
        y="20"
        width="400"
        height="240"
        rx="20"
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />

      {/* Header */}
      <rect x="40" y="20" width="400" height="44" rx="20" fill="#f9fafb" />
      <rect x="40" y="44" width="400" height="20" fill="#f9fafb" />
      <rect x="64" y="32" width="80" height="12" rx="4" fill="#d1d5db" />

      {/* Order status steps */}
      {/* Step dots + line */}
      <line
        x1="110"
        y1="105"
        x2="370"
        y2="105"
        stroke="#d1fae5"
        strokeWidth="3"
      />
      <circle cx="110" cy="105" r="12" fill="#22c55e" />
      <path
        d="M104 105 L108 109 L116 101"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="240" cy="105" r="12" fill="#22c55e" />
      <path
        d="M234 105 L238 109 L246 101"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="370"
        cy="105"
        r="12"
        fill="#dcfce7"
        stroke="#22c55e"
        strokeWidth="2"
      />
      <circle cx="370" cy="105" r="5" fill="#22c55e" />

      {/* Step labels */}
      <text
        x="110"
        y="128"
        textAnchor="middle"
        fill="#6b7280"
        fontSize="9"
        fontFamily="sans-serif"
      >
        Ordered
      </text>
      <text
        x="240"
        y="128"
        textAnchor="middle"
        fill="#6b7280"
        fontSize="9"
        fontFamily="sans-serif"
      >
        Shipped
      </text>
      <text
        x="370"
        y="128"
        textAnchor="middle"
        fill="#22c55e"
        fontSize="9"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        Arriving
      </text>

      {/* Delivery card */}
      <rect
        x="64"
        y="146"
        width="352"
        height="68"
        rx="12"
        fill="#f0fdf4"
        stroke="#bbf7d0"
        strokeWidth="1.5"
      />
      {/* Truck icon */}
      <rect
        x="80"
        y="162"
        width="36"
        height="24"
        rx="4"
        fill="#22c55e"
        opacity="0.15"
      />
      <path d="M86 174 h16 v-6 h6 l6 6 v4 h-28 v-4z" fill="#22c55e" />
      <circle cx="92" cy="182" r="3" fill="white" />
      <circle cx="110" cy="182" r="3" fill="white" />
      <rect x="128" y="158" width="100" height="10" rx="3" fill="#d1fae5" />
      <rect x="128" y="174" width="70" height="8" rx="3" fill="#dcfce7" />
      {/* Confirm button */}
      <rect x="316" y="160" width="84" height="28" rx="8" fill="#22c55e" />
      <text
        x="358"
        y="178"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        Confirm
      </text>
    </svg>
  );
}
