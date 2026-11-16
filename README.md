# Fatty Liver AI Atlas｜跨機台脂肪肝 AI 實驗圖譜

這是一個把 `D:\nas實驗空間` 中多條脂肪肝超音波 AI 實驗，整理成可公開瀏覽、可持續擴充的研究展示網站。主題聚焦在四台超音波機器之間的 domain shift、LOMO（Leave-One-Machine-Out）驗證、domain generalization 與 neural architecture search。

> 僅供研究與課堂展示，不作為醫療診斷依據。公開網站不包含原始影像、病患資料、模型權重或內部伺服器資訊。

- Repository：<https://github.com/jkd5430/fatty-liver-ai-atlas>
- 網頁：<https://jkd5430.github.io/fatty-liver-ai-atlas/>

## 專案特色

- 用一頁式研究敘事說明問題、方法、主要發現與限制。
- 實驗內容集中在 `site/data/experiments.json`，新內容不需重做版面。
- 以 `confirmed`、`provisional`、`method` 三級標示證據強度。
- 內建篩選、無障礙操作、響應式版面與資料載入錯誤處理。
- `AGENTS.md` 詳細規範 AI 後續如何新增內容、保護隱私與維持研究誠信。

## 本機瀏覽

需使用 HTTP server，因為頁面會讀取 JSON：

```powershell
cd site
python -m http.server 8000
```

開啟 <http://localhost:8000>。

## 驗證

```powershell
node scripts/validate.mjs
```

驗證器會檢查資料 schema、重複 ID、狀態值、相對連結、禁用的機敏關鍵字與 GitHub Pages 必要檔案。

## 新增一筆實驗

1. 讀 `AGENTS.md`，確認證據分級與隱私規則。
2. 在 `site/data/experiments.json` 的 `experiments` 陣列新增一個物件。
3. 以 10 為間隔設定 `order`，並使用永久不變的英文 `id`。
4. 在 `source` 填寫彙整報告的非機敏來源名稱。
5. 執行驗證並用手機、桌面寬度預覽。

## 內容來源

網站內容依據下列本機實驗的 README 與彙整報告重新撰寫：

- `fatty_s0_vs_s123`：S0 vs S1–S3 基礎分類與 LOMO 實驗。
- `nasrl_mednas_lomo`：MedNAS 與 NAS-RL 架構搜尋。
- `dg_lomo`：domain generalization、LOMO × 5-fold、架構池與零成本代理指標。
- `stem_proxy_lomo5`：stem 預訓練、proxy 評分與跨機台指標搜尋。

研究結果仍受資料規模、機台組成、seed 變異與搜尋選擇偏差影響；網站已在相應卡片中保留限制。

## 部署

推送到 GitHub 的 `main` 分支後，`.github/workflows/pages.yml` 會將 `site/` 部署至 GitHub Pages。第一次使用時，請在 Repository → Settings → Pages 將 Source 設為 **GitHub Actions**。

