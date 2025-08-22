import { escapeHTML } from "../utils/escapeHTML.js";

const ROOT_ID = "gj-bias-root";

export function renderLoadingBadge() {
  const root = document.createElement("div");
  root.id = ROOT_ID;

  const loadingBadge = document.createElement("div");
  loadingBadge.className = "gj-badge";
  loadingBadge.innerHTML = `
    <div class="gj-spinner" aria-hidden="true"></div>
    <span class="gj-title">The Genuine Journal</span>
    <span class="gj-sub">Loading rating…</span>
  `;

  root.appendChild(loadingBadge);
  document.body.appendChild(root);
}

export function removeBadge() {
  document.getElementById(ROOT_ID)?.remove();
}

export function clearBadge() {
  const root = document.getElementById(ROOT_ID);
  if (root) root.innerHTML = "";
}

export function setBadgeContent(biasRating: number, explanation: string) {
  const root = document.getElementById(ROOT_ID);

  if (!root) return;

  // --- Map rating -> label/color ---
  let label = "Unknown";
  let bgColor = "#2e2f30";

  if (biasRating <= -0.75) {
    label = "Left Wing";
    bgColor = "#3b82f6";
  } else if (biasRating < -0.25) {
    label = "Lean Left";
    bgColor = "#60a5fa";
  } else if (biasRating <= 0.25) {
    label = "Center";
    bgColor = "#2e2f30";
  } else if (biasRating < 0.75) {
    label = "Lean Right";
    bgColor = "#ef4444";
  } else if (biasRating <= 1) {
    label = "Right Wing";
    bgColor = "#991b1b";
  }

  document.documentElement.style.setProperty("--gj-bg", bgColor);

  // --- Badge (collapsed state) ---
  const badge = document.createElement("button");
  badge.className = "gj-badge";
  badge.setAttribute("aria-label", "Open The Genuine Journal Bias Rating");
  badge.innerHTML = `
      <span class="gj-dot" aria-hidden="true"></span>
      <span class="gj-title">The Genuine Journal</span>
      <span class="gj-sub">Bias Rating: ${label}</span>
    `;

  // --- Panel (expanded) ---
  const panel = document.createElement("div");
  panel.className = "gj-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "The Genuine Journal Bias Details");
  panel.innerHTML = `
      <h3>The Genuine Journal Bias Rating</h3>
      <div class="gj-row">
        <span class="gj-chip">${label}</span>
        <span class="gj-chip">Score: ${biasRating.toFixed(2)}</span>
      </div>
      <div class="gj-meter-wrap" aria-label="Bias meter" title="−1 = Left, 0 = Center, +1 = Right">
        <div class="gj-meter" data-val="${biasRating}"></div>
      </div>
      <div style="height:10px"></div>
      <div class="gj-expl">${escapeHTML(explanation)}</div>
      <div class="gj-footer">
        <a class="gj-link" href="https://thegenuinejournal.com" target="_blank" rel="noopener noreferrer">About this rating</a>
        <button class="gj-close" type="button">Close</button>
      </div>
    `;

  const meter: any = panel.querySelector(".gj-meter");
  if (meter) {
    const pct = ((biasRating + 1) / 2) * 100; // [-1,1] -> [0,100]
    meter.style.width = `${pct}%`;
  }

  // Toggle logic
  const toggle = () => panel.classList.toggle("show");
  badge.addEventListener("click", toggle);
  panel.querySelector(".gj-close")?.addEventListener("click", toggle);

  root.appendChild(badge);
  root.appendChild(panel);
  document.body.appendChild(root);
}

