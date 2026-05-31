# OG image fonts

These fonts are committed so the OG image (`public/og-image.svg` →
`og-image.png`) renders identically everywhere, including CI. They are used
only by `scripts/og-image.mjs` at build time and are **not** shipped to the
browser.

Both families are licensed under the SIL Open Font License, Version 1.1.
The full license text is in [`OFL.txt`](./OFL.txt).

| File(s) | Family | License | Source |
| --- | --- | --- | --- |
| `IBMPlexSans-Regular.ttf`, `IBMPlexSans-SemiBold.ttf`, `IBMPlexSans-Bold.ttf` | IBM Plex Sans — Copyright © 2017 IBM Corp., with Reserved Font Name "Plex" | OFL-1.1 | https://github.com/IBM/plex |
| `NotoSansJP.ttf` | Noto Sans JP — Copyright © 2014-2021 Adobe, with Reserved Font Name "Source" | OFL-1.1 | https://github.com/notofonts/noto-cjk |

The fontconfig cache (`.ogfonts/cache/`) is generated locally and is
git-ignored.
