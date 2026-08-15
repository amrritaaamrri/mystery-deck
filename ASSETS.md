# Assets

**Art direction:** A premium Art Nouveau tarot-memory game shown as a close reading-table composition. The surface is deep oxblood velvet with a faint woven grain and low-contrast damask. The deck uses parchment ivory, ink-black engraved linework, antique-gold foil, and double-gilt frames. Illumination is warm and restrained; visual effects are limited to soft turn shimmers and small match sparkles. Avoid people, extra occult props, neon, and heavy magic effects.

## Backgrounds

| Name | Description | Size | Image |
|---|---|---:|---|
| In-game visual target | 16:9 browser-game screenshot used to validate board scale, color, and HUD placement. | 1920 × 1080 px | `/manus-storage/arcana-match-reference_7001dade.jpg` |

## Textures

| Name | Description | Size | Image |
|---|---|---:|---|
| Tarot card back | Vertical symmetrical burgundy, gold, and ivory Art Nouveau card-back design with crescent-star center. | 104 × 156 px card surface | `/manus-storage/arcana-tarot-back_d280492e.png` |
| Tarot faces sheet | Eight coordinated parchment tarot faces bearing Moon, Sun, Star, Tower, Eye, Key, Rose, and Serpent symbols. | 104 × 156 px per card face | `/manus-storage/arcana-tarot-faces_4425e662.png` |

## Sprites

| Name | Description | Size | Image |
|---|---|---:|---|
| Arcana crest | Transparent crescent-and-eight-point-star brand crest in antique gold. | 52 × 52 px header; 80 × 80 px completion seal | `/manus-storage/arcana-logo_f857af6e.png` |

## Asset Assignments

- **Game board:** Uses the tarot-card-back texture at card-back scale and the in-game visual target as the visual QA target.
- **Card faces:** Use original per-card, responsive linework derived from the generated face sheet’s eight named symbols; this keeps each card face accessible and sharp at all layout sizes.
- **Brand and completion UI:** Uses the generated Arcana crest at header and completion scales.
