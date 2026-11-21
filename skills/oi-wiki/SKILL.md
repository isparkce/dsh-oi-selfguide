---
name: oi-wiki
description: 在本地 OI-Wiki 中定位知识点并给出带行号的解释。
whenToUse: 用户问 OI 概念、证明、复杂度，或解释题目/文章需要背景知识时。
---

# 查 OI-Wiki

1. 先定包根：本 skill 的 Base directory 往上两级（`<Base directory>/../..`），解析成绝对路径：
   `ROOT=$(cd "<Base directory>/../.." && pwd); echo "$ROOT"`
   校验 `"$ROOT/.oi-wiki-submodule/mkdocs.yml"` 存在；不存在就让用户先初始化子模块（`git submodule update --init --recursive`），不要编造内容。
2. 查目录：`grep -n "<中文关键词>" "$ROOT/.oi-wiki-submodule/mkdocs.yml"`，从 nav 得到 `docs/` 下的相对路径。
3. 多个候选时，选 1–2 篇最贴近的；先读概述/定义小节，不要整篇复制。
4. 读 `"$ROOT/.oi-wiki-submodule/docs/<path>.md"` 的相关行，引用格式 `docs/...md:行号`（相对 `.oi-wiki-submodule` 根）。
5. 回答顺序：定义 → 为什么 → 怎么做 → 复杂度 → 易错点。
6. Wiki 没有或过时：明说，再按第一性原理回答，标“补充”。

## 规则

- 不把 Wiki 当绝对真理；不替用户读整篇。
- 最多引用 2 段原文；需要时给 3 行阅读路线，而不是全文摘要。
- 中文回答；术语保留英文原名。
