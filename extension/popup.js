document.getElementById("donate-btn").addEventListener("click", donateCookies);
document.getElementById("open-site-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const base = tab?.url ? new URL(tab.url).origin : "http://localhost:3000";
  chrome.tabs.create({ url: `${base}/donate` });
});

updateStepDisplay();

async function updateStepDisplay() {
  const stepInstall = document.getElementById("step-install");
  const stepDonate = document.getElementById("step-donate");
  const btn = document.getElementById("donate-btn");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
      const url = new URL(tab.url);
      const hasId = url.searchParams.get("id");
      const onDonatePage = url.pathname.includes("/donate");

      if (onDonatePage && hasId) {
        stepInstall.classList.add("hidden");
        stepDonate.classList.remove("hidden");
        btn.textContent = "Donate cookie patterns";
        btn.disabled = false;
        return;
      }
    }
  } catch {
    // Fall through to default state
  }

  stepInstall.classList.remove("hidden");
  stepDonate.classList.add("hidden");
  btn.textContent = "Donate cookie patterns";
  btn.disabled = false;
}

async function donateCookies() {
  const btn = document.getElementById("donate-btn");
  const status = document.getElementById("status");
  btn.disabled = true;
  btn.textContent = "Collecting cookies...";
  status.className = "status hidden";
  status.textContent = "";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) {
      showStatus("Please open the research site first.", "warn");
      btn.disabled = false;
      btn.textContent = "Donate cookie patterns";
      return;
    }

    const url = new URL(tab.url);
    const anonymousId = url.searchParams.get("id");
    if (!anonymousId || !url.pathname.includes("/donate")) {
      showStatus(
        'Navigate to the donate page and complete the questionnaire first. The URL should contain your contribution ID (e.g. /donate?step=cookies&id=...).',
        "warn"
      );
      btn.disabled = false;
      btn.textContent = "Donate cookie patterns";
      return;
    }

    const apiOrigin = url.origin;
    const cookies = await chrome.cookies.getAll({});
    const sanitized = cookies.map((c) => ({
      domain: c.domain,
      name: c.name,
    }));

    btn.textContent = `Sending ${sanitized.length} patterns...`;

    const res = await fetch(`${apiOrigin}/api/submit/cookies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonymousId,
        cookieData: { cookies: sanitized, count: sanitized.length },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }

    showStatus(`Done! ${sanitized.length} cookie patterns donated.`, "success");
    btn.textContent = "Donated!";
  } catch (err) {
    showStatus(
      err instanceof Error ? err.message : "Something went wrong. Please try again.",
      "error"
    );
    btn.disabled = false;
    btn.textContent = "Retry donation";
  }
}

function showStatus(text, type) {
  const status = document.getElementById("status");
  status.className = `status ${type}`;
  status.textContent = text;
  status.classList.remove("hidden");
}
