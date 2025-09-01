import { escapeHTML } from "../utils/escapeHTML.js";

const ROOT_ID = "gj-bias-root";

export function renderLoadingBadge() {
  const root = document.createElement("div");
  root.id = ROOT_ID;

  const loadingBadge = document.createElement("div");
  loadingBadge.className = "gj-badge";
  loadingBadge.innerHTML = `
    <div class="gj-spinner" aria-hidden="true"></div>
    <span class="gj-title">TGJ</span>
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

  if (biasRating <= -0.7) {
    label = "Left Wing";
    bgColor = "#3b82f6";
  } else if (biasRating < -0.25) {
    label = "Lean Left";
    bgColor = "#60a5fa";
  } else if (biasRating <= 0.25) {
    label = "Center";
    bgColor = "#7c3aed";
  } else if (biasRating < 0.7) {
    label = "Lean Right";
    bgColor = "#ef4444";
  } else if (biasRating <= 1) {
    label = "Right Wing";
    bgColor = "#991b1b";
  }

  document.documentElement.style.setProperty("--gj-bg", bgColor);

  // Helpers
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
  const toPct = (val: number) => ((clamp(val, -1, 1) + 1) / 2) * 100;

  // Prebuild ticks for -1, -0.5, 0, 0.5, 1
  const tickValues = [-1, -0.5, 0, 0.5, 1];
  const ticksHTML = tickValues
    .map(v => {
      const left = toPct(v);
      const label = ["Left", "Lean L", "Center", "Lean R", "Right"][tickValues.indexOf(v)];
      return `
        <span class="gj-tick" style="left:${left}%"></span>
        <span class="gj-tick-label" style="left:${left}%">${label}</span>
      `;
    })
    .join("");

  // --- Badge (collapsed) ---
  const badge = document.createElement("button");
  badge.className = "gj-badge";
  badge.setAttribute("aria-label", "Open The Genuine Journal Bias Rating");
  badge.innerHTML = `
    <span class="gj-dot" aria-hidden="true"></span>
    <span class="gj-title">TGJ</span>
    <span class="gj-sub">Bias Rating: ${label}</span>
  `;

  // --- Panel (expanded) ---
  const panel = document.createElement("div");
  panel.className = "gj-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "The Genuine Journal Bias Details");

  // Number line markup
  const markerLeft = toPct(biasRating);
  panel.innerHTML = `
    <h3 style="font-family:inherit">The Genuine Journal Bias Rating</h3>
    <div class="gj-row">
      <span class="gj-chip">${label}</span>
    </div>

    <div class="gj-numberline" role="img" aria-label="Bias number line from −1 (Left) to +1 (Right)">
      <div class="gj-track"></div>
      <div class="gj-ticks-wrap">
        ${ticksHTML}
      </div>
      <div
        class="gj-marker"
        style="left:${markerLeft}%"
        aria-label="Bias position"
        title="${biasRating.toFixed(2)}"
      >
        <span class="gj-marker-dot" aria-hidden="true"></span>
      </div>
    </div>

    <div class="gj-expl">${escapeHTML(explanation)}</div>
    <div class="gj-footer">
      <a class="gj-link" href="https://thegenuinejournal.com" target="_blank" rel="noopener noreferrer">About this rating</a>
      <button class="gj-close" type="button">Close</button>
    </div>
  `;

  // Toggle logic
  const toggle = () => panel.classList.toggle("show");
  badge.addEventListener("click", toggle);
  panel.querySelector(".gj-close")?.addEventListener("click", toggle);

  root.appendChild(badge);
  root.appendChild(panel);
  document.body.appendChild(root);
}
