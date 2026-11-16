const STATUS_LABELS = {
  confirmed: "已確認",
  provisional: "待確認",
  method: "方法設計"
};

const list = document.querySelector("[data-experiment-list]");
const emptyState = document.querySelector("[data-empty]");
const filters = [...document.querySelectorAll("[data-filter]")];

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderMetric(metric) {
  const item = makeElement("div", "metric");
  item.append(
    makeElement("span", "", metric.label),
    makeElement("b", "", metric.value),
    makeElement("small", "", metric.note)
  );
  return item;
}

function renderExperiment(experiment, index) {
  const card = makeElement("article", "experiment-card");
  card.dataset.status = experiment.status;
  card.id = experiment.id;

  const meta = makeElement("div", "card-meta");
  const status = makeElement("span", `status status-${experiment.status}`, STATUS_LABELS[experiment.status]);
  const cardIndex = makeElement("span", "card-index", String(index + 1).padStart(2, "0"));
  meta.append(status, cardIndex);

  const main = makeElement("div", "card-main");
  const eyebrow = makeElement("p", "card-eyebrow", experiment.eyebrow);
  const title = makeElement("h3", "", experiment.title);
  const summary = makeElement("p", "card-summary", experiment.summary);
  const tags = makeElement("div", "tags");
  experiment.tags.forEach((tag) => tags.append(makeElement("span", "", tag)));
  main.append(eyebrow, title, summary, tags);

  const detail = makeElement("div", "card-detail");
  const metrics = makeElement("div", "metrics");
  experiment.metrics.forEach((metric) => metrics.append(renderMetric(metric)));
  const expand = makeElement("button", "card-expand", "閱讀發現與限制 ＋");
  expand.type = "button";
  expand.setAttribute("aria-expanded", "false");
  expand.setAttribute("aria-controls", `${experiment.id}-finding`);
  detail.append(metrics, expand);

  const finding = makeElement("div", "card-finding");
  finding.id = `${experiment.id}-finding`;
  finding.hidden = true;
  finding.append(
    makeElement("p", "", experiment.finding),
    makeElement("small", "", `來源：${experiment.source}`)
  );

  expand.addEventListener("click", () => {
    const willOpen = finding.hidden;
    finding.hidden = !willOpen;
    expand.setAttribute("aria-expanded", String(willOpen));
    expand.textContent = willOpen ? "收起發現與限制 −" : "閱讀發現與限制 ＋";
  });

  card.append(meta, main, detail, finding);
  return card;
}

function updateCounts(experiments) {
  const counts = experiments.reduce((result, item) => {
    result[item.status] += 1;
    return result;
  }, { all: experiments.length, confirmed: 0, provisional: 0, method: 0 });

  Object.entries(counts).forEach(([key, value]) => {
    const target = document.querySelector(`[data-count="${key}"]`);
    if (target) target.textContent = value;
  });
}

function applyFilter(filter) {
  const cards = [...list.querySelectorAll(".experiment-card")];
  let visible = 0;
  cards.forEach((card) => {
    const show = filter === "all" || card.dataset.status === filter;
    card.hidden = !show;
    if (show) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}

async function loadExperiments() {
  try {
    const response = await fetch("data/experiments.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const experiments = [...data.experiments].sort((a, b) => a.order - b.order);
    list.replaceChildren(...experiments.map(renderExperiment));
    updateCounts(experiments);
  } catch (error) {
    const message = makeElement("div", "load-error");
    message.append(
      makeElement("b", "", "實驗資料載入失敗"),
      makeElement("p", "", "請透過本機 HTTP server 或 GitHub Pages 開啟網站，而不是直接雙擊 HTML 檔案。")
    );
    list.replaceChildren(message);
    console.error("Failed to load experiments:", error);
  }
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    applyFilter(button.dataset.filter);
  });
});

const header = document.querySelector("[data-header]");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

loadExperiments();

