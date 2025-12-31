chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBias") {
    fetch("https://tgj-api.vercel.app/v1/ai/analyze-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: request.url })
    })
      .then((res) => res.json()) // parse JSON instead of .text()
      .then((data) => sendResponse(data))
      .catch(() => sendResponse({ error: "Failed" }));

    return true;
  }
});