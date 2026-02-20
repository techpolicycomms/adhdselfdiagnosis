import Link from "next/link";
import { PrivacyBadge } from "@/components/PrivacyBadge";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <PrivacyBadge />

          <h1 className="mt-8 font-heading text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            Help science understand{" "}
            <span className="text-emerald-700">ADHD</span> better
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
            By donating a few minutes of your time—and optionally your browsing
            patterns—you can help researchers build a dataset that could one day
            enable faster, more accessible ADHD screening through machine
            learning.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.98]"
            >
              Start contributing
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-8 py-4 text-lg font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              Learn more
            </Link>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-stone-200 bg-white/80 py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-stone-600">
            Your contribution takes about 5 minutes and is completely anonymous.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">
                Answer screening questions
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Complete our 18-question ADHD self-assessment. Your responses help research.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">
                Optionally donate cookies
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Export your browser cookies (we strip all sensitive values) to
                help researchers study attention-related browsing patterns.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">
                That&apos;s it
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Your data is stored with a random ID. No email, no name, no way
                to trace it back to you.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="font-semibold text-emerald-900">
              Why browsing patterns?
            </h3>
            <p className="mt-2 text-emerald-800/90">
              Research suggests that attention and focus manifest in how we
              navigate the web—tab switching, session length, revisits. By
              combining screening responses with anonymized browsing data, we
              hope to build models that could eventually support clinicians in
              faster triage. This is exploratory research; no diagnosis is made
              here.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="border-t border-stone-200 bg-white/50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            ADHD resources
          </h2>
          <p className="mt-2 text-stone-600">
            Podcasts and channels to learn more about ADHD.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <a
              href="https://www.youtube.com/@ADHD_Chatter_Podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <h3 className="font-semibold text-stone-900">ADHD Chatter</h3>
              <p className="mt-1 text-sm text-stone-500">YouTube channel</p>
            </a>
            <a
              href="https://www.youtube.com/@HowtoADHD"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <h3 className="font-semibold text-stone-900">How to ADHD</h3>
              <p className="mt-1 text-sm text-stone-500">YouTube channel</p>
            </a>
            <a
              href="https://www.understood.org/en/articles/adhd-explained-a-28-minute-primer"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <h3 className="font-semibold text-stone-900">ADHD Explained (Understood)</h3>
              <p className="mt-1 text-sm text-stone-500">28-min primer video</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-stone-900">
            Ready to contribute?
          </h2>
          <p className="mt-2 text-stone-600">
            Every submission helps move research forward.
          </p>
          <Link
            href="/donate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Start now
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-stone-500">
          <p>
            This tool is for self-assessment only. It does not provide a medical
            diagnosis. See a qualified professional for assessment.
          </p>
        </div>
      </footer>
    </div>
  );
}
