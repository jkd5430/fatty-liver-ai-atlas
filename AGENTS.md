# AGENTS.md — Fatty Liver AI Atlas 專案規範

## 1. 專案目的

本專案把跨超音波機台的脂肪肝 AI 實驗整理成可公開瀏覽、可持續擴充的研究圖譜。網站要回答三個問題：

1. 實驗為什麼要做跨機台驗證？
2. 每一條實驗線做了什麼、得到什麼證據？
3. 下一位維護者或 AI 要如何用相同規格新增實驗？

網站是研究紀錄與教學展示，不是醫療器材，也不得提供個人診斷建議。

## 2. 專案結構

```text
fatty-liver-ai-atlas/
├─ AGENTS.md                    # AI 與貢獻者必讀規範（本檔案）
├─ README.md                    # 專案介紹、啟動與部署方法
├─ SUBMISSION.md                # 作業繳交內容範本
├─ .github/workflows/pages.yml  # GitHub Pages 自動部署
├─ scripts/validate.mjs         # 資料結構、連結及隱私關鍵字檢查
└─ site/
   ├─ index.html                # 單頁入口與語意結構
   ├─ 404.html                  # GitHub Pages 錯誤頁
   ├─ assets/
   │  ├─ styles.css             # 全站設計系統與響應式樣式
   │  └─ app.js                 # 資料載入、篩選、互動與圖表
   └─ data/
      └─ experiments.json       # 實驗內容的唯一資料來源
```

除非功能需求明確改變，不要新增框架、套件管理器或建置工具。網站必須保持零依賴、可由 GitHub Pages 直接提供。

## 3. 視覺與內容風格

- 視覺關鍵字：研究筆記、超音波灰階、螢光綠訊號、資料座標。
- 主色使用深墨色背景與 `#b9ff66` 訊號綠；警示使用暖橘色。新色彩需先在 `:root` 宣告。
- 標題簡潔、內文用繁體中文；專有名詞第一次出現時補英文全名或縮寫。
- 不使用制式「三張功能卡」堆疊。每個區段都必須推進研究敘事：問題 → 方法 → 證據 → 限制 → 下一步。
- 數字一律附上指標名稱與條件，例如「LOMO 影像層級 AUC 0.825」，不可只寫「準確率 82.5%」。
- 動畫只做狀態提示與閱讀輔助；必須尊重 `prefers-reduced-motion`。

## 4. 實驗資料格式

所有實驗卡都放在 `site/data/experiments.json` 的 `experiments` 陣列。新增項目必須包含：

```json
{
  "id": "小寫英文與連字號，永久不變",
  "order": 50,
  "title": "短標題",
  "eyebrow": "實驗階段或輪次",
  "summary": "一至兩句研究問題與結果",
  "status": "confirmed | provisional | method",
  "tags": ["LOMO", "NAS"],
  "metrics": [
    { "label": "指標名稱", "value": "0.825", "note": "必要條件" }
  ],
  "finding": "結論，必須同時交代限制",
  "source": "來源資料夾或結果檔的非機敏描述"
}
```

規則：

- `order` 以 10 為間隔，保留插入空間。
- `status=confirmed`：至少多 seed、跨 fold 或明確重複驗證支持。
- `status=provisional`：單一 seed、探索性分析、最佳值挑選或尚未 confirm。
- `status=method`：描述實驗設計、資料切分或負面結果的研究教訓。
- `metrics` 最多 3 個，只放讀者能解讀的關鍵數字。
- `source` 可以寫 `dg_lomo/RESULTS_STAGE2.md`，不可寫病患路徑、伺服器 IP、帳號或磁碟掛載位置。

## 5. 檔名與放置規則

- 檔名只用小寫英文字母、數字與連字號；資料檔可用 `.json`。
- 共用樣式放 `site/assets/styles.css`，互動放 `site/assets/app.js`，不要在 HTML 中加入大段 inline CSS/JS。
- 新增圖片時放 `site/assets/images/<topic>-<purpose>.<ext>`，需壓縮並提供有意義的 `alt`。
- 禁止把模型權重、原始影像、Excel、CSV 病患表、訓練 log 或大於 1 MB 的研究輸出提交到公開儲存庫。

## 6. 隱私與研究誠信（最高優先）

- 絕不公開姓名、病歷號、生日、影像路徑、醫院內部代碼或能回推個人的欄位。
- 不從原始試算表複製逐筆資料；網站只可使用彙整後的群體層級結果。
- 不把探索性最高值包裝成最終結論。winner's curse、seed 變異與資料洩漏風險必須保留在文字中。
- 任何臨床敘述都加上「僅供研究展示，不作為醫療診斷依據」。
- 來源不確定時先標成 `provisional`，不得自行補造數字、論文或受試者資訊。

## 7. AI 修改與新增內容的工作流程

AI 每次修改必須依序完成：

1. 先讀本檔與 `README.md`。
2. 確認需求是「新增實驗內容」或「改變網站能力」。純內容更新不得改動版型。
3. 從已彙整的 README、summary 或結果報告抽取群體層級資訊，不讀取或輸出個資表。
4. 依第 4 節 schema 新增資料，並判斷證據狀態。
5. 執行 `node scripts/validate.mjs`。
6. 以本機 HTTP server 預覽桌面與手機寬度；檢查鍵盤操作、對比、空狀態及錯誤訊息。
7. 更新 `README.md` 的內容清單（若研究線有新增），提交時說明資料來源與限制。

禁止事項：

- 不因追求視覺效果改寫研究數字。
- 不刪除限制、失敗結果或負面結果。
- 不直接修改 `innerHTML` 插入未轉義的外部內容；目前資料渲染使用 DOM API。
- 不加入追蹤碼、第三方字型或會傳送研究資料的外部服務。

## 8. 完成標準（Definition of Done）

一項變更只有在以下條件全數通過後才算完成：

- `node scripts/validate.mjs` 顯示 `Validation passed`。
- 頁面在 360 px 與 1280 px 寬度皆可閱讀，沒有水平捲動。
- 所有互動可用鍵盤操作，焦點樣式清楚。
- 新增數字能追溯到 `source`，且證據狀態正確。
- 沒有原始病患資料、內部路徑、憑證或大型模型檔。
- GitHub Pages workflow 可部署 `site/`，首頁與 `404.html` 都能開啟。

