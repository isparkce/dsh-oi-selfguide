# OI 讲解员 · DSH 模式（agent preset）

仅自用，未测试，不保证稳定性，自行自定义。以下是 AI 生成的 readme。

## 目录

```
dsh-oi-selfguide/
├── package.json           # 包名与 dsh bundle 入口
├── cordis.patch.yml       # 模式本体：persona + 工具白名单 + 自解析 skills 目录
├── skills/                # explain-problem / explain-editorial / oi-wiki
├── tools/                 # cph.py（读 CPH 缓存）、cph-path.js（CPH-NG 导入路径）
├── OI-wiki/               # 本地 OI Wiki（docs/ + mkdocs.yml）
├── settings.example.json  # 工作区 .vscode/settings.json 模板
└── README.md
```

## 安装

1. 把这个目录放在不会被清理的位置。
2. 装进 profile，二选一：
   - GUI：Plugins → Add plugin → 选这个目录（包名 `@isparkce/dsh-oi-selfguide`）；
   - 让 agent 执行 `plugin_manager install_bundle`，target 是这个目录的绝对路径。
3. 开新会话，在模式列表里选「OI 讲解员」。

## 配置

工作区把 `settings.example.json` 复制成 `<工作区>/.vscode/settings.json`，把
`cph-ng.companion.customPathScript` 改成这个包里 `tools/cph-path.js` 的实际路径
（绝对路径），把模板里的 `/path/to/dsh-oi-selfguide` 换掉即可。
`problemFilePath` / `testcaseFilePath` 保持 `${workspace}/...` 不变。
OI-wiki 目录结构内容经过调整，与原貌有差别，如欲更新内容请注意适配性。

## 卸载

先在 Plugins 里移除，或让 agent 执行 `plugin_manager remove_bundle @isparkce/dsh-oi-selfguide`，再删目录。
