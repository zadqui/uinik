# Membership PDF assets

All runtime assets are served locally from /membership/. No runtime CDN or external font request is used. The original template is not modified.

- template.pdf
  Source: User-supplied cartadeuinik.pdf (copied without modification)
  SHA-256: 3e1a4dfc0c8cc2450b297f8e15cc0eff6d2e01185141926882afe282ae4a8668

- pdf-lib.min.js
  Source: pdf-lib 1.17.1, official npm distribution, dist/pdf-lib.min.js
  SHA-256: 0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f

- fontkit.umd.min.js
  Source: @pdf-lib/fontkit 1.1.1, official npm distribution, dist/fontkit.umd.min.js
  SHA-256: d8df561b9fba98e24f2e5130e40948809281bbbc55a20c412359f1a0a5eb35a6

- NotoSans-Regular.ttf
  Source: https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf
  SHA-256: b85c38ecea8a7cfb39c24e395a4007474fa5a4fc864f6ee33309eb4948d232d5

- NotoSans-Bold.ttf
  Source: https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf
  SHA-256: c976e4b1b99edc88775377fcc21692ca4bfa46b6d6ca6522bfda505b28ff9d6a

Licenses: pdf-lib-LICENSE.md, fontkit-LICENSE.txt, fontkit-README.md, NotoSans-LICENSE.txt. Noto Sans covers Latin, Greek and Cyrillic; unsupported name glyphs are rejected with an explicit error rather than silently replaced.
