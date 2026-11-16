# 作業繳交內容範本

## 繳交標題

`［學校簡稱］ ［學號］ ［系級簡稱］ ［姓名］ 跨機台脂肪肝 AI 實驗圖譜`

## 1. 專案簡介

Fatty Liver AI Atlas 是一個整理跨超音波機台脂肪肝 AI 實驗的研究展示網站。網站以 S0 與 S1–S3 分類任務為核心，介紹 LOMO 驗證、domain generalization、MedNAS／NAS-RL 架構搜尋與零成本代理指標，並清楚標示已確認、待確認及方法學結果。公開內容只使用群體層級的彙整數字，不含病患個資或原始醫療影像。

## 2. GitHub Repository 連結

<https://github.com/jkd5430/fatty-liver-ai-atlas>

## 3. 網頁連結

<https://jkd5430.github.io/fatty-liver-ai-atlas/>

## 4. AGENTS.md

Repository 根目錄的 `AGENTS.md` 定義了專案目的、資料結構、視覺風格、實驗 schema、證據分級、檔名規則、隱私禁區、AI 工作流程與完成標準。

## 5. 規則如何幫助 AI 繼續完成？

之後新增實驗時，AI 不必重新設計頁面，只要先依 `AGENTS.md` 判斷證據屬於 confirmed、provisional 或 method，再按照固定 schema 把標題、摘要、指標、限制與來源加入 `site/data/experiments.json`。驗證程式會檢查缺漏、重複 ID、錯誤狀態與可能的機敏資訊；既有 JavaScript 會自動把新資料渲染成可篩選的實驗卡。這套規則讓內容、視覺與研究誠信可以在多次擴充後仍保持一致。

