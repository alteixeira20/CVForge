# Self-hosted fonts

| File | Family | Subset | Source |
| --- | --- | --- | --- |
| `lexend-latin.woff2` | Lexend (variable, weights 300 to 700) | latin | Google Fonts `lexend/v26` |
| `lexend-latin-ext.woff2` | Lexend (variable, weights 300 to 700) | latin-ext | Google Fonts `lexend/v26` |
| `jetbrains-mono-latin.woff2` | JetBrains Mono (variable, weights 400 to 500) | latin | Google Fonts `jetbrainsmono/v24` |
| `jetbrains-mono-latin-ext.woff2` | JetBrains Mono (variable, weights 400 to 500) | latin-ext | Google Fonts `jetbrainsmono/v24` |

Both families are licensed under the SIL Open Font License 1.1. The license and
copyright notices are in `OFL-Lexend.txt` and `OFL-JetBrainsMono.txt` and must ship with
the font files. The `@font-face` rules are in `src/styles/fonts.css`.

These fonts are used by the website only. The exported PDF uses the standard PDF fonts
(Helvetica, Times, Courier) and embeds no font files.
