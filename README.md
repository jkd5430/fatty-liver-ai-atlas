# 跨機台脂肪肝 AI 實驗介紹

這是一個簡單的主題介紹網站，用白話整理 `D:\nas實驗空間` 中四個脂肪肝超音波 AI 實驗方向。

> 僅供研究與課堂展示，不作為醫療診斷依據。網站不包含原始影像、病患資料或模型權重。

- Repository：<https://github.com/jkd5430/fatty-liver-ai-atlas>
- 網頁：<https://jkd5430.github.io/fatty-liver-ai-atlas/>

## 網站內容

- 專案目的：說明為什麼要研究跨超音波機台的 AI 模型。
- 四個主題：影像分類、跨機台測試、模型架構搜尋、快速評分方法。
- 專案規則：直接在網頁中呈現 AI 後續開發要遵守的規則。
- 響應式版面：手機與電腦都能閱讀。

## 檔案結構

```text
├─ AGENTS.md
├─ README.md
├─ SUBMISSION.md
├─ scripts/validate.mjs
└─ site/
   ├─ index.html
   ├─ 404.html
   └─ assets/styles.css
```

## 本機瀏覽

```powershell
cd site
python -m http.server 8000
```

開啟 <http://localhost:8000>。

## 驗證

```powershell
node scripts/validate.mjs
```

驗證程式會檢查必要檔案、首頁區塊、相對連結與敏感關鍵字。

## 新增一個主題

1. 先讀 `AGENTS.md`。
2. 在 `site/index.html` 複製一張 `.topic-card`。
3. 填入編號、名稱、一至兩句白話介紹與來源資料夾。
4. 執行驗證程式，再推送至 GitHub。

## 部署

推送到 `main` 分支後，GitHub Actions 會自動把 `site/` 部署至 GitHub Pages。
