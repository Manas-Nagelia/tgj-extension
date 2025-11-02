export function isProbablyArticle() {
  const blacklistedDomains = [
    "youtube.com",
    "vimeo.com",
    "dailymotion.com",
    "twitch.tv",
    "spotify.com",
    "soundcloud.com",
    "bandcamp.com",
    "imgur.com",
    "flickr.com",
    "pinterest.com",
    "reddit.com",
    "twitter.com",
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "medium.com", // Medium is a blogging platform, but its articles are often very short and not suitable for detailed analysis
    "wikipedia.org",
    "wikimedia.org",
    "quora.com",
    "stackexchange.com",
    "stackoverflow.com",
    "github.com",
    "gitlab.com",
    "bitbucket.org",
    "news.ycombinator.com",
    "producthunt.com",
    "etsy.com",
    "amazon.com",
    "ebay.com",
    "netflix.com",
    "hulu.com",
    "chatgpt.com",
    "openai.com",
    "vercel.com",
    "github.io",
  ];
  if (blacklistedDomains.includes(location.href.toLowerCase())) {
    return false;
  }
  // Helper: safe meta getter
  const getMeta = (selector: any) => document.querySelector(selector)?.content?.trim().toLowerCase() || "";

  // 1) Strong: Open Graph type
  const ogType = getMeta('meta[property="og:type"], meta[name="og:type"]');
  if (["article", "news", "blog", "post", "news_article"].includes(ogType)) return true;

  // 2) Strong: JSON-LD Article schema
  try {
    const ldNodes = [...document.querySelectorAll('script[type="application/ld+json"]')];
    for (const node of ldNodes) {
      const json = JSON.parse(node.textContent || "null");
      const types = []
        .concat(json || [])
        .flatMap((x) => (Array.isArray(x) ? x : [x]))
        .flatMap((x) => (x?.["@type"] ? [].concat(x["@type"]) : []))
        .map((t) => String(t).toLowerCase());
      if (types.some((t) => t.includes("article") || t.includes("newsarticle") || t.includes("blogposting"))) {
        return true;
      }
    }
  } catch { /* ignore parse errors */ }

  // 3) Medium: structural hints
  //if (document.querySelector("article, [role='article']")) return true;

  // 4) Medium: author / published time style metas
  const hasAuthor = !!getMeta('meta[name="author"]') || !!getMeta('meta[property="article:author"]');
  const hasPublished = !!getMeta('meta[property="article:published_time"]') || !!getMeta('meta[name="parsely-pub-date"]');
  if (hasAuthor || hasPublished) return true;

  // 5) Light: platform hints
  const parselyType = getMeta('meta[name="parsely-type"]'); // common on news sites
  if (["post", "article"].includes(parselyType)) return true;

  // 6) Light: URL heuristics
  // ! COMMENTED OUT BECAUSE ON CERTAIN SITES SUCH AS YOUTUBE OR SHUTTERSTOCK, IT CAUSES FALSE POSITIVES IF YOU SEARCH FOR "ARTICLE"/"NEWS" IN THE URL
  // const href = location.href.toLowerCase();
  // if (/(^|\/)(news|article)(\/|$)/.test(href)) return true;

  return false;
}