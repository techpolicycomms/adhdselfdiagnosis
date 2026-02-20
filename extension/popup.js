document.getElementById("donate-btn").addEventListener("click", donateCookies);
document.getElementById("open-site-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const base = tab?.url ? new URL(tab.url).origin : "http://localhost:3006";
  chrome.tabs.create({ url: `${base}/donate` });
});

async function donateCookies() {
  const btn = document.getElementById("donate-btn");
  const status = document.getElementById("status");
  btn.disabled = true;
  status.className = "status hidden";
  status.textContent = "";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) {
      showStatus("Please open the research site first.", "warn");
      btn.disabled = false;
      return;
    }

    const url = new URL(tab.url);
    const anonymousId = url.searchParams.get("id");
    if (!anonymousId || !url.pathname.includes("/donate")) {
      showStatus("Open the donate page and complete the questionnaire first. You should see a URL with your contribution ID.", "warn");
      btn.disabled = false;
      return;
    }

    const apiOrigin = url.origin;
    const cookies = await chrome.cookies.getAll({});
    const sanitized = cookies.map((c) => ({
      domain: c.domain,
      name: c.name,
    }));

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
      throw new Error(err.error || "Failed to send cookies");
    }

    showStatus("✓ Cookie patterns donated successfully.", "success");
    btn.textContent = "Donated!";
  } catch (err) {
    showStatus(err instanceof Error ? err.message : "Something went wrong.", "error");
    btn.disabled = false;
  }
}

function showStatus(text, type) {
  const status = document.getElementById("status");
  status.className = `status ${type}`;
  status.textContent = text;
  status.classList.remove("hidden");
}
