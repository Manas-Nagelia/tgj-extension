import { isProbablyArticle } from "./detectArticle.js";
import { clearBadge, removeBadge, renderLoadingBadge, setBadgeContent } from "./ui.js";

function onUrlChange(callback: () => void) {
  let lastUrl = location.href;
  
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      callback();
    }
  }).observe(document, { subtree: true, childList: true });
}

function runBiasCheck() {
  removeBadge();
  if (isProbablyArticle()) {
    if (!document.getElementById("gj-bias-root")) {
      document.documentElement.style.setProperty("--gj-bg", "#2e2f30");
      renderLoadingBadge();
    }

    chrome.runtime.sendMessage(
      { action: "getBias", url: window.location.href },
      (article) => {
        const data = article.bias_rating;

        if (data?.error || data.explanation === "Not a valid news article") {
          removeBadge();
          return;
        }

        clearBadge();
        const biasRating = Number(data.bias_rating ?? 0);
        const explanation = data.explanation || "No explanation provided.";
        setBadgeContent(biasRating, explanation);
      }
    );
  }
}

// Initial run
runBiasCheck();

// Rerun whenever the URL changes in an SPA
onUrlChange(runBiasCheck);
