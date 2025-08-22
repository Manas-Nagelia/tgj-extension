import { isProbablyArticle } from "./detectArticle.js";
import { clearBadge, removeBadge, renderLoadingBadge, setBadgeContent } from "./ui.js";

if (isProbablyArticle()) {
  // Avoid duplicates if the script re-runs
  if (!document.getElementById("gj-bias-root")) {
    renderLoadingBadge();
  }

  chrome.runtime.sendMessage(
    { action: "getBias", url: window.location.href },
    (article) => {
    const data = article.bias_rating;
    
      if (data?.error || data.explanation == "Not a valid news article") {
        removeBadge();
        return;
      };

      clearBadge();

      const biasRating = Number(data.bias_rating ?? 0);
      const explanation = data.explanation || "No explanation provided.";

      setBadgeContent(biasRating, explanation)
    }
  );
}
