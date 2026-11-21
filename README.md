# OI 讲解员 · DSH 模式

all AI，仅自用，未测试，不保证稳定性，自行自定义。

## 许可

除子模块外，本项目采用 **GNU General Public License v3.0**，完整许可证文本见 [`LICENSE.md`](LICENSE.md)。

SPDX-License-Identifier: GPL-3.0-only

OI Wiki 子模块位于 `.oi-wiki-submodule/`，本项目只使用其中的 `docs/` 与 `mkdocs.yml`，未修改子模块内容。其版权归 OI Wiki Team（及贡献者），遵循上游的 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 与 [The Star And Thank Author License](https://github.com/zTrix/sata-license) 许可；具体以 OI Wiki 上游声明为准。

## 目录

```
dsh-oi-selfguide/
├── .gitmodules            # OI Wiki 子模块定义
├── .oi-wiki-submodule/    # OI Wiki 子模块（docs/ + mkdocs.yml）
├── package.json           # 包名与 dsh bundle 入口
├── cordis.patch.yml       # 模式本体：persona + 工具白名单 + 自解析 skills 目录
├── skills/                # explain-problem / explain-editorial / oi-wiki
├── tools/                 # cph.py（读 CPH 缓存）、cph-path.js（CPH-NG 导入路径）
├── settings.example.json  # 工作区 .vscode/settings.json 模板
├── LICENSE.md             # GPL-3.0-only
└── README.md
```

## 安装

1. `git clone` 后初始化 OI Wiki 子模块：
```bash
git submodule update --init
git -C .oi-wiki-submodule sparse-checkout init --no-cone
git -C .oi-wiki-submodule sparse-checkout set '/docs/' '/mkdocs.yml'
```
2. 把这个目录放在不会被清理的位置。
3. GUI：Plugins → Add plugin → 选这个目录（包名 `@isparkce/dsh-oi-selfguide`）。
4. 开新会话，在模式列表里选「OI 讲解员」。

## 配置

工作区把 `settings.example.json` 复制成 `<工作区>/.vscode/settings.json`，把 `cph-ng.companion.customPathScript` 改成这个包里 `tools/cph-path.js` 的实际路径（绝对路径），把模板里的 `/path/to/dsh-oi-selfguide` 换掉即可。`problemFilePath` / `testcaseFilePath` 保持 `${workspace}/...` 不变。

OI Wiki 内容在 `.oi-wiki-submodule/`，由 git 子模块管理；更新时用 `git submodule update --remote`。

## 卸载

Plugins 里移除后删目录。
