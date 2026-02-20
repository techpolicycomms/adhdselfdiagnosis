import Link from "next/link";

export default function ExtensionInstallPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/donate"
          className="mb-8 inline-flex items-center gap-2 text-stone-600 hover:text-stone-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to donate
        </Link>

        <h1 className="text-3xl font-bold text-stone-900">
          Install the MindFlow extension
        </h1>
        <p className="mt-2 text-stone-600">
          Load the extension in Chrome to donate cookie patterns with one click.
        </p>

        <div className="mt-10 space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-stone-900">Step 1: Open Extensions</h2>
            <p className="mt-1 text-stone-600">
              In Chrome, go to <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">chrome://extensions</code>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-900">Step 2: Enable Developer mode</h2>
            <p className="mt-1 text-stone-600">
              Turn on the &quot;Developer mode&quot; toggle in the top-right corner.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-900">Step 3: Load unpacked</h2>
            <p className="mt-1 text-stone-600">
              Click &quot;Load unpacked&quot; and select the <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">extension</code> folder
              inside this project:
            </p>
            <p className="mt-2 font-mono text-sm text-stone-700">
              adhd-research-dataset/extension
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-900">Step 4: Return to donate</h2>
            <p className="mt-1 text-stone-600">
              Go back to the donate page, complete the questionnaire, then click
              the extension icon and hit &quot;Donate cookie patterns&quot;.
            </p>
          </div>
        </div>

        <Link
          href="/donate"
          className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Continue to donate
        </Link>
      </div>
    </div>
  );
}
